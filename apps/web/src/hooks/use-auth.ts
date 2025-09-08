import { useAuthStore } from "@/stores";

/**
 * Simplified auth hook - use this instead of multiple hooks
 */
export function useAuth() {
  const store = useAuthStore();
  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    updateProfile: store.updateProfile,
    clearError: store.clearError,
    refreshAuth: store.refreshAuth,
  };
}

/**
 * Lightweight hook for checking auth status only
 */
export function useAuthStatus() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  return { isAuthenticated, isLoading };
}

// NOTE: Use useAuth() instead of individual hooks above for simpler API
