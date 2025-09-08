// UI theme types - for theming system
export interface Theme {
  mode: "light" | "dark" | "system";
}

export type ThemeMode = Theme["mode"];

// Component variant types
export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
