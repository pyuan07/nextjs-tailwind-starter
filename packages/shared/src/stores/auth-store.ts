import { create } from "zustand";
import { authService } from "@/services";
import { getErrorMessage } from "@/utils/api";
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
} from "@/types/api/auth";
import type { User } from "@/types/entities";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: UpdateUserRequest) => Promise<User>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Actions
  clearError: () => {
    set({ error: null });
  },

  refreshAuth: async () => {
    const currentState = get();

    // Allow initial auth check, prevent concurrent calls otherwise
    const isInitialCheck =
      currentState.isLoading &&
      !currentState.isAuthenticated &&
      !currentState.user;
    if (currentState.isLoading && !isInitialCheck) {
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const isAuthenticatedCheck = authService.isAuthenticated();

      if (isAuthenticatedCheck) {
        const response = await authService.getProfile();
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  login: async (credentials: LoginRequest) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authService.login(credentials);

      if (response.success) {
        await get().refreshAuth();
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  register: async (userData: RegisterRequest) => {
    try {
      set({ isLoading: true, error: null });

      if (userData.password !== userData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await authService.register(userData);

      if (response.success) {
        await get().refreshAuth();
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });

      await authService.logout();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  updateProfile: async (updates: UpdateUserRequest) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authService.updateProfile(updates);

      if (!response.success) {
        throw new Error(response.message || "Update failed");
      }

      set({ user: response.data, isLoading: false });

      return response.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },
}));

// Listen for storage changes (multi-tab scenarios) without immediate initialization
if (typeof window !== "undefined") {
  window.addEventListener("storage", () => {
    useAuthStore.getState().refreshAuth();
  });
}
