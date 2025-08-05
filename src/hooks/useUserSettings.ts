import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/lib/supabase/supabase";

type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];

interface UpdateUserSettingsData {
  theme?: "light" | "dark" | "system";
  language?: string;
  default_model?: string;
}

const fetchUserSettings = async (): Promise<UserSettings> => {
  const response = await fetch("/api/user/settings");
  
  if (!response.ok) {
    throw new Error("Failed to fetch user settings");
  }
  
  const result = await response.json();
  return result.data;
};

const updateUserSettings = async (data: UpdateUserSettingsData): Promise<UserSettings> => {
  const response = await fetch("/api/user/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update user settings");
  }
  
  const result = await response.json();
  return result.data;
};

export const useUserSettings = () => {
  return useQuery({
    queryKey: ["userSettings"],
    queryFn: fetchUserSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(["userSettings"], data);
    },
    onError: (error) => {
      console.error("Error updating user settings:", error);
    },
  });
};