import { create } from "zustand";
import type { SessionType } from "@/types/auth";

type SessionStore = {
  session: SessionType | null;
  setSession: (newSession: SessionType | null) => void;
};

const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (newSession) =>
    set({
      session: newSession,
    }),
}));

export default useSessionStore;
