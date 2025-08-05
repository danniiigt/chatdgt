"use client";

import { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AVAILABLE_MODELS } from "@/lib/constants";
import {
  useUserSettings,
  useUpdateUserSettings,
} from "@/hooks/useUserSettings";
import { useThemeSync } from "@/hooks/useThemeSync";
import type { Database } from "@/lib/supabase/supabase";
import { LoaderCircle } from "lucide-react";

type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];

export const GeneralTab = () => {
  // Third party hooks
  const { t } = useTranslate();
  const router = useRouter();
  const pathname = usePathname();

  // Data fetching
  const { data: settings, isLoading, error } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();
  const { currentTheme, updateTheme, isUpdating } = useThemeSync();

  // State
  const [localSettings, setLocalSettings] = useState<UserSettings | null>(null);

  // Effects
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Helpers / Functions
  const handleSaveSettings = async () => {
    if (!localSettings) return;

    try {
      // Update theme using the sync hook (for immediate UI update)
      if (localSettings.theme !== currentTheme) {
        await updateTheme(localSettings.theme);
      }

      // Update default model (language is handled separately)
      if (localSettings.default_model !== settings?.default_model) {
        await updateSettingsMutation.mutateAsync({
          default_model: localSettings.default_model,
        });
      }

      toast.success(
        t(
          "settings.general.save-success",
          "Configuración guardada correctamente"
        )
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(
        t("settings.general.save-error", "Error al guardar la configuración")
      );
    }
  };

  const updateSetting = (key: keyof UserSettings, value: string) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, [key]: value });
  };

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    // Update local state
    updateSetting("theme", newTheme);

    // Apply theme immediately for instant feedback
    try {
      await updateTheme(newTheme);
      toast.success(
        t("settings.general.theme-updated", "Tema actualizado correctamente")
      );
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error(
        t("settings.general.theme-error", "Error al actualizar el tema")
      );
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    // Update local state
    updateSetting("language", newLanguage);

    try {
      // Update database
      await updateSettingsMutation.mutateAsync({
        language: newLanguage,
      });

      // Change URL locale
      const currentLocale = pathname.split("/")[1]; // Get current locale from pathname
      const newPathname = pathname.replace(
        `/${currentLocale}`,
        `/${newLanguage}`
      );

      // Navigate to new locale
      router.push(newPathname);

      toast.success(
        t(
          "settings.general.language-updated",
          "Idioma actualizado correctamente"
        )
      );
    } catch (error) {
      console.error("Error updating language:", error);
      toast.error(
        t("settings.general.language-error", "Error al actualizar el idioma")
      );
      // Revert local state on error
      if (settings?.language) {
        setLocalSettings((prev) =>
          prev ? { ...prev, language: settings.language } : null
        );
      }
    }
  };

  // Constants
  const themeOptions = [
    { value: "light", label: t("settings.general.theme.light", "Claro") },
    { value: "dark", label: t("settings.general.theme.dark", "Oscuro") },
    { value: "system", label: t("settings.general.theme.system", "Sistema") },
  ];

  const languageOptions = [
    { value: "es", label: t("settings.general.language.es", "Español") },
    { value: "en", label: t("settings.general.language.en", "English") },
  ];

  const modelOptions = AVAILABLE_MODELS.map((model) => ({
    value: model.id,
    label: model.name,
  }));

  if (isLoading) {
    return (
      <Card className="shadow-none border-none py-0">
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-none border-none py-0">
        <CardContent>
          <p className="text-muted-foreground">
            {t(
              "settings.general.load-error",
              "Error al cargar la configuración"
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!localSettings) {
    return (
      <Card className="shadow-none border-none py-0">
        <CardContent>
          <p className="text-muted-foreground">
            {t(
              "settings.general.no-settings",
              "No se pudo cargar la configuración"
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-none py-0">
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">
              {t("settings.general.theme.label", "Tema")}
            </Label>
            <Select
              value={localSettings.theme}
              onValueChange={(value) =>
                handleThemeChange(value as "light" | "dark" | "system")
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "settings.general.theme.placeholder",
                    "Selecciona un tema"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="language">
              {t("settings.general.language.label", "Idioma")}
            </Label>
            <Select
              value={localSettings.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "settings.general.language.placeholder",
                    "Selecciona un idioma"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="defaultModel">
              {t("settings.general.default-model.label", "Modelo por Defecto")}
            </Label>
            <Select
              value={localSettings.default_model}
              onValueChange={(value) => updateSetting("default_model", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "settings.general.default-model.placeholder",
                    "Selecciona un modelo"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t(
                "settings.general.default-model.help",
                "Este modelo se usará por defecto en nuevos chats"
              )}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending || isUpdating}
        >
          {updateSettingsMutation.isPending || isUpdating ? (
            <>
              {t("chat.edit.saving", "Guardando")}
              <LoaderCircle className="size-4 animate-spin" />
            </>
          ) : (
            t("settings.general.save", "Guardar Cambios")
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
