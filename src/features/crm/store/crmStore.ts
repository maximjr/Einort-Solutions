import { create } from 'zustand';
import { db } from '../../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export type LeadStage = 'new' | 'qualified' | 'discovery' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

export interface ActivityLog {
  id: string;
  type: 'Note' | 'Email' | 'Call' | 'Meeting' | 'StatusChange' | 'Follow-Up Scheduled' | 'Proposal' | 'Contract';
  content: string;
  timestamp: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  email: string;
  value: number;
  stage: LeadStage;
  date: string;
  status: 'Hot' | 'Warm' | 'Cold';
  score: number;
  aiNote: string;
  lastContact?: string;
  nextFollowUp?: string;
  forecast?: number;
  company?: string;
  health?: 'At Risk' | 'On Track' | 'Accelerated';
  contractSent?: boolean;
  proposalSent?: boolean;
  activities?: ActivityLog[];
}

interface CRMState {
  leads: Lead[];
  activeStage: LeadStage | 'All';
  searchQuery: string;
  setActiveStage: (stage: LeadStage | 'All') => void;
  setSearchQuery: (query: string) => void;
  // Actions
  initializeListener: () => () => void;
  addLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
  updateLeadStage: (id: string, stage: LeadStage) => Promise<void>;
  addActivity: (id: string, activity: Omit<ActivityLog, 'id' | 'timestamp'>) => Promise<void>;
}

let activeCRMListener: (() => void) | null = null;
let listenerCount = 0;

export const useCRMStore = create<CRMState>((set) => ({
  leads: [],
  activeStage: 'All',
  searchQuery: '',
  setActiveStage: (stage) => set({ activeStage: stage }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  initializeListener: () => {
    listenerCount++;
    if (!activeCRMListener) {
      const q = query(collection(db, 'leads'));
      activeCRMListener = onSnapshot(q, (snapshot) => {
        const leadsData: Lead[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          leadsData.push({
            id: doc.id,
            name: data.name,
            contact: data.contact,
            email: data.email,
            value: data.value,
            stage: data.stage as LeadStage,
            date: data.date,
            status: data.status,
            score: data.score,
            aiNote: data.aiNote,
            lastContact: data.lastContact,
            nextFollowUp: data.nextFollowUp,
            forecast: data.forecast,
            company: data.company,
            health: data.health || (data.score > 80 ? 'Accelerated' : data.score < 40 ? 'At Risk' : 'On Track'),
            contractSent: !!data.contractSent,
            proposalSent: !!data.proposalSent,
            activities: data.activities || []
          });
        });
        set({ leads: leadsData });
      }, (error) => console.error("Error fetching leads:", error));
    }
    
    return () => {
      listenerCount--;
      if (listenerCount <= 0 && activeCRMListener) {
        activeCRMListener();
        activeCRMListener = null;
        listenerCount = 0;
      }
    };
  },

  addLead: async (lead) => {
    try {
      await addDoc(collection(db, 'leads'), {
        ...lead,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Failed to add lead", e);
    }
  },

  updateLeadStage: async (id, stage) => {
    try {
      const leadRef = doc(db, 'leads', id);
      const activity: ActivityLog = {
        id: crypto.randomUUID(),
        type: 'StatusChange',
        content: `Stage changed to ${stage}`,
        timestamp: new Date().toISOString(),
        author: 'System'
      };
      
      const docSnap = await getDoc(leadRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const activities = data.activities || [];
        await updateDoc(leadRef, { 
          stage,
          activities: [activity, ...activities]
        });
      }
    } catch (e) {
      console.error("Failed to update lead", e);
    }
  },
  
  addActivity: async (id, activityData) => {
      try {
          const leadRef = doc(db, 'leads', id);
          const activity: ActivityLog = {
            id: crypto.randomUUID(),
            ...activityData,
            timestamp: new Date().toISOString()
          };
          
          const docSnap = await getDoc(leadRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const activities = data.activities || [];
            await updateDoc(leadRef, {
                activities: [activity, ...activities]
            });
          }
      } catch (e) {
          console.error("Failed to add activity", e);
      }
  }
}));
