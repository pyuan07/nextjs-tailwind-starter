import { toast } from "sonner";

export const useToast = () => {
  return {
    toast: {
      success: (message: string, description?: string) => {
        toast.success(message, { description });
      },
      error: (message: string, description?: string) => {
        toast.error(message, { description });
      },
      info: (message: string, description?: string) => {
        toast.info(message, { description });
      },
      warning: (message: string, description?: string) => {
        toast.warning(message, { description });
      },
      promise: toast.promise,
      dismiss: toast.dismiss,
    },
  };
};
