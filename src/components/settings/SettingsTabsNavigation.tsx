"use client";

import { useTranslate } from "@tolgee/react";

interface SettingsTabsNavigation {
  activeTab: "general" | "profile" | "usage";
  setActiveTab: (tab: "general" | "profile" | "usage") => void;
}

export const SettingsTabsNavigation = ({
  activeTab,
  setActiveTab,
}: SettingsTabsNavigation) => {
  const { t } = useTranslate();
  return (
    <div className="w-64 flex-shrink-0">
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`cursor-pointer w-full text-left text-sm px-3 py-2.5 rounded-lg transition-colors ${
            activeTab === "general"
              ? "bg-foreground/10 text-foreground"
              : "hover:bg-muted"
          }`}
        >
          {t("settings.tabs.general", "General")}
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`cursor-pointer w-full text-left text-sm px-3 py-2.5 rounded-lg transition-colors ${
            activeTab === "profile"
              ? "bg-foreground/10 text-foreground"
              : "hover:bg-muted"
          }`}
        >
          {t("settings.tabs.profile", "Perfil")}
        </button>
        <button
          onClick={() => setActiveTab("usage")}
          className={`cursor-pointer w-full text-left text-sm px-3 py-2.5 rounded-lg transition-colors ${
            activeTab === "usage"
              ? "bg-foreground/10 text-foreground"
              : "hover:bg-muted"
          }`}
        >
          {t("settings.tabs.usage", "Límites de Uso")}
        </button>
      </nav>
    </div>
  );
};
