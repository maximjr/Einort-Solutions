import { create } from 'zustand';

export type LeadStage = 'New Lead' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';

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
  forecast?: number;
}

interface CRMState {
  leads: Lead[];
  activeStage: LeadStage | 'All';
  searchQuery: string;
  setActiveStage: (stage: LeadStage | 'All') => void;
  setSearchQuery: (query: string) => void;
  addLead: (lead: Lead) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
}

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Stark Industries', contact: 'Tony Stark', email: 't.stark@stark.com', value: 120000, stage: 'Qualified', date: '2026-10-15', status: 'Hot', score: 98, aiNote: 'High precision match for enterprise architectural rebuild.', forecast: 85 },
  { id: '2', name: 'Wayne Enterprises', contact: 'Bruce Wayne', email: 'bruce@wayne.com', value: 250000, stage: 'Negotiation', date: '2026-10-12', status: 'Warm', score: 85, aiNote: 'Requires advanced zero-trust security clearance.', forecast: 60 },
  { id: '3', name: 'Oscorp', contact: 'Norman Osborn', email: 'norman@oscorp.com', value: 85000, stage: 'New Lead', date: '2026-10-18', status: 'Cold', score: 42, aiNote: 'Timeline constraints identified in early discovery.', forecast: 20 },
  { id: '4', name: 'Oasis Meta', contact: 'James Halliday', email: 'james@oasis.com', value: 450000, stage: 'Proposal Sent', date: '2026-10-10', status: 'Hot', score: 95, aiNote: 'Massive scale required, perfect match for backend capabilities.', forecast: 90 },
  { id: '5', name: 'Cyberdyne', contact: 'Miles Dyson', email: 'miles@cyberdyne.com', value: 310000, stage: 'Qualified', date: '2026-10-19', status: 'Warm', score: 88, aiNote: 'AI implementation scale needed. Priority prospect.', forecast: 75 },
];

export const useCRMStore = create<CRMState>((set) => ({
  leads: MOCK_LEADS,
  activeStage: 'All',
  searchQuery: '',
  setActiveStage: (stage) => set({ activeStage: stage }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLeadStage: (id, stage) => set((state) => ({
    leads: state.leads.map(lead => lead.id === id ? { ...lead, stage } : lead)
  }))
}));
