import { useEffect, useState } from "react";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export function useAuthCheck(endpoint: string = "/api/auth/check") {
  const [status, setStatus] = useState<AuthStatus>("idle");

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    fetch(endpoint, { credentials: "include" })
      .then(async (res) => {
        if (!ignore) {
          if (!res.ok) {
            setStatus("unauthenticated");
            return;
          }
          const data = await res.json();
          setStatus(data.authenticated ? "authenticated" : "unauthenticated");
        }
      })
      .catch(() => !ignore && setStatus("unauthenticated"));
    return () => {
      ignore = true;
    };
  }, [endpoint]);

  return {
    status,
    loading: status === "loading",
    authenticated: status === "authenticated",
  };
}
