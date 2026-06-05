import { ClientUser } from "./clientService";
import { Project } from "../../types";

export interface CRMLeadProfile {
  client: ClientUser;
  associatedProjects: Project[];
  totalValue: number;
  maxLeadScore: number;
}

export const crmService = {
  /**
   * Generates comprehensive CRM profiles combining client metadata and project telemetry.
   */
  generateCRMProfiles(clients: ClientUser[], projects: Project[]): CRMLeadProfile[] {
    return clients.map((client) => {
      const associatedProjects = projects.filter((p) => p.userId === client.id);

      const totalValue = associatedProjects.reduce((acc, p) => {
        if (!p.budget) return acc;
        const b = p.budget.toLowerCase();
        if (b.includes("50k")) return acc + 50000;
        if (b.includes("100k")) return acc + 100000;
        if (b.includes("250k")) return acc + 250000;
        if (b.includes("500k+")) return acc + 500000;
        return acc;
      }, 0);

      const maxLeadScore = associatedProjects.reduce((max, p) => Math.max(max, p.leadScore || 0), 0);

      return {
        client,
        associatedProjects,
        totalValue,
        maxLeadScore,
      };
    });
  }
};
