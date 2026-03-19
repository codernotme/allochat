import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSession() {
  const { signOut } = useAuthActions();
  // We can fetch the user details using a generic currentUser query if defined in convex/users.ts
  const user = undefined; 
  // TODO: connect with api.users.viewer once defined

  return {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
    signOut,
  };
}
