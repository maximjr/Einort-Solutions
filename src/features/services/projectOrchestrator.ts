import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { Project, ProjectStatus, OrchestratorResult } from "../../types";
import { handleFirestoreError, OperationType } from "../../services/admin/diagnosticsHelper";
import { calculateLeadScore, calculateComplexityScore } from "../../lib/scoring";

export const ProjectOrchestrator = {
  async submitProject(projectInput: Partial<Project>): Promise<OrchestratorResult<Project>> {
    if (!db) {
      return {
        success: false,
        message: "Unable to connect. Please check your connection and try again.",
        error:   "Firestore unavailable",
      };
    }

    if (!projectInput.email || !projectInput.clientName || !projectInput.projectType) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        error:   "Missing required fields",
      };
    }

    // Require authentication — userId must be the current user's UID.
    // The "anonymous" fallback is removed: Firestore rules already reject it,
    // and accepting it client-side misleads the caller about what happened.
    const uid = auth?.currentUser?.uid;
    if (!uid) {
      return {
        success: false,
        message: "Please sign in before submitting a project.",
        error:   "Unauthenticated",
      };
    }

    try {
      const projectsCol = collection(db, "projects");
      const docRef      = doc(projectsCol);

      // Deterministic scores derived from the submission data.
      // Previously Math.random() — making every dashboard metric meaningless.
      const leadScore       = projectInput.leadScore       ?? calculateLeadScore(projectInput);
      const complexityScore = projectInput.complexityScore ?? calculateComplexityScore(projectInput);

      const newProject: Project = {
        id:               docRef.id,
        projectId:        docRef.id,
        userId:           uid,
        email:            projectInput.email,
        clientName:       projectInput.clientName,
        company:          projectInput.company          || "",
        industry:         projectInput.industry         || "",
        projectType:      projectInput.projectType,
        selectedFeatures: projectInput.selectedFeatures || [],
        requirements:     projectInput.requirements     || "No additional requirements provided.",
        budget:           projectInput.budget           || "TBD",
        timeline:         projectInput.timeline         || "TBD",
        urgency:          projectInput.urgency          || "standard",
        leadScore,
        complexityScore,
        status:    (projectInput.status as ProjectStatus) || "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, newProject);

      return {
        success: true,
        message: "Your project was successfully submitted. Your workspace is being prepared.",
        data:    newProject,
      };
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, "projects");
      } catch (formatted: unknown) {
        return {
          success: false,
          message: "Unable to submit your project. Please try again.",
          error:   formatted instanceof Error ? formatted.message : String(formatted),
        };
      }
    }
  },

  async updateProject(projectId: string, updateData: Partial<Project>): Promise<OrchestratorResult<void>> {
    if (!db) {
      return {
        success: false,
        message: "Unable to connect. Please try again.",
        error:   "Firestore unavailable",
      };
    }

    try {
      const cleanedData = { ...updateData, updatedAt: serverTimestamp() };

      // Immutable fields — never allow overwrite via update
      delete (cleanedData as Partial<Project & { id?: string }>).id;
      delete (cleanedData as Partial<Project & { projectId?: string }>).projectId;
      delete (cleanedData as Partial<Project & { createdAt?: unknown }>).createdAt;

      await updateDoc(doc(db, "projects", projectId), cleanedData);
      return { success: true, message: "Project updated successfully." };
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
      } catch (formatted: unknown) {
        return {
          success: false,
          message: "Unable to update this project. Please try again.",
          error:   formatted instanceof Error ? formatted.message : String(formatted),
        };
      }
    }
  },

  async changeProjectStatus(projectId: string, newStatus: ProjectStatus): Promise<OrchestratorResult<void>> {
    if (!db) {
      return {
        success: false,
        message: "Unable to connect. Please try again.",
        error:   "Firestore unavailable",
      };
    }

    try {
      await updateDoc(doc(db, "projects", projectId), {
        status:    newStatus,
        updatedAt: serverTimestamp(),
      });
      return { success: true, message: `Project status updated to: ${newStatus}` };
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}/status`);
      } catch (formatted: unknown) {
        return {
          success: false,
          message: "Unable to update project status. You may not have permission.",
          error:   formatted instanceof Error ? formatted.message : String(formatted),
        };
      }
    }
  },

  async assignProject(projectId: string, adminId: string): Promise<OrchestratorResult<void>> {
    if (!db) {
      return {
        success: false,
        message: "Unable to connect. Please try again.",
        error:   "Firestore unavailable",
      };
    }

    try {
      await updateDoc(doc(db, "projects", projectId), {
        assignedAdminId: adminId,
        updatedAt:       serverTimestamp(),
      });
      return { success: true, message: "Project assigned successfully." };
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}/assignment`);
      } catch (formatted: unknown) {
        return {
          success: false,
          message: "Unable to assign this project. Please try again.",
          error:   formatted instanceof Error ? formatted.message : String(formatted),
        };
      }
    }
  },

  async deleteProject(projectId: string): Promise<OrchestratorResult<void>> {
    if (!db) {
      return {
        success: false,
        message: "Unable to connect. Please try again.",
        error:   "Firestore unavailable",
      };
    }

    try {
      // Soft delete — preserves audit trail and allows recovery within 30 days.
      // A scheduled Cloud Function should hard-delete after the retention window.
      await updateDoc(doc(db, "projects", projectId), {
        status:    "deleted",
        deletedAt: serverTimestamp(),
        deletedBy: auth?.currentUser?.uid ?? null,
        updatedAt: serverTimestamp(),
      });
      return { success: true, message: "Project deleted successfully." };
    } catch (err) {
      // Fall back to hard delete if the soft-delete update fails
      // (e.g. the document doesn't exist or is already deleted)
      try {
        await deleteDoc(doc(db, "projects", projectId));
        return { success: true, message: "Project removed." };
      } catch {
        try {
          handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
        } catch (formatted: unknown) {
          return {
            success: false,
            message: "Unable to delete this project. You may not have permission.",
            error:   formatted instanceof Error ? formatted.message : String(formatted),
          };
        }
      }
    }
  },
};
