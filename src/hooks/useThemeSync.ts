import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useUserSettings, useUpdateUserSettings } from "./useUserSettings";

export const useThemeSync = () => {
  const { theme: nextTheme, setTheme } = useTheme();
  const { data: userSettings } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();

  // Sync next-themes with user settings on mount
  useEffect(() => {
    if (userSettings?.theme && nextTheme !== userSettings.theme) {
      setTheme(userSettings.theme);
    }
  }, [userSettings?.theme, nextTheme, setTheme]);

  // Function to update both next-themes and database
  const updateTheme = async (newTheme: "light" | "dark" | "system") => {
    // Update next-themes immediately for instant visual feedback
    setTheme(newTheme);
    
    // Update database
    try {
      await updateSettingsMutation.mutateAsync({
        theme: newTheme,
      });
    } catch (error) {
      // If database update fails, revert the theme
      if (userSettings?.theme) {
        setTheme(userSettings.theme);
      }
      throw error;
    }
  };

  return {
    currentTheme: nextTheme as "light" | "dark" | "system" | undefined,
    updateTheme,
    isUpdating: updateSettingsMutation.isPending,
  };
};