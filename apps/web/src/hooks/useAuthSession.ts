import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { authClient } from "@/lib/auth-client";
import useSessionStore from "@/store/session";

export function useAuthSession() {
  const [session, setSession] = useSessionStore(useShallow((s) => [s.session, s.setSession]));

  useEffect(() => {
    async function load() {
      if (!session) {
        const { data } = await authClient.getSession();
        setSession(data ?? null);
      }
    }

    load();
  }, []);

  return { session };
}
