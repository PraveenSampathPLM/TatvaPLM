import { create } from "zustand";

interface ContainerState {
  selectedContainerId: string;
  selectedIndustry: string;
  setSelectedContainerId: (containerId: string) => void;
  setSelectedIndustry: (industry: string) => void;
}

const containerStorageKey = "plm_selected_container_id";
const industryStorageKey  = "plm_selected_industry";

export const useContainerStore = create<ContainerState>((set) => ({
  selectedContainerId: localStorage.getItem(containerStorageKey) ?? "",
  selectedIndustry:    localStorage.getItem(industryStorageKey)  ?? "",
  setSelectedContainerId: (containerId) => {
    localStorage.setItem(containerStorageKey, containerId);
    set({ selectedContainerId: containerId });
  },
  setSelectedIndustry: (industry) => {
    localStorage.setItem(industryStorageKey, industry);
    set({ selectedIndustry: industry });
  }
}));
