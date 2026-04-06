/**
 * Zustand store for transient UI state.
 *
 * Controls sidebar visibility and a generic modal.
 * No persistence is needed — UI state resets on page reload.
 */

import { create } from "zustand";

// ---- State shape ----

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: string | null;
}

interface UIActions {
  /** Toggle the sidebar between open / closed */
  toggleSidebar: () => void;

  /** Explicitly set the sidebar open state */
  setSidebarOpen: (open: boolean) => void;

  /** Open the modal with the given content string */
  openModal: (content: string) => void;

  /** Close the modal and clear its content */
  closeModal: () => void;
}

type UIStore = UIState & UIActions;

// ---- Store creation ----

export const useUIStore = create<UIStore>((set) => ({
  // -- Initial state --
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,

  // -- Actions --
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));
