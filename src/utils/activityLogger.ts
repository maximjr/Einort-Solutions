import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ActivityType = 
  | 'logged_in' 
  | 'signed_up'
  | 'page_visit'
  | 'viewed_pricing'
  | 'opened_services' 
  | 'explored_industry'
  | 'started_prototype'
  | 'resumed_prototype'
  | 'abandoned_prototype'
  | 'completed_prototype'
  | 'submitted_project'
  | 'booked_consultation'
  | 'viewed_proposal'
  | 'revision_requested'
  | 'payment_completed'
  | 'milestone_reached'
  | 'custom_action';

export const logClientActivity = async (userId: string | null, email: string | null, type: ActivityType, details: string) => {
  try {
    await addDoc(collection(db, 'clientActivity'), {
      userId: userId || 'anonymous',
      email: email || 'anonymous',
      type,
      details,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    // Silently fail for telemetry
    console.warn("Failed to log activity:", error);
  }
};
