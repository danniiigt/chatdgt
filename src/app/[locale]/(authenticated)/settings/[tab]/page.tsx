"use client";

import { use } from "react";
import { useTranslate } from "@tolgee/react";
import { useRouter } from "next/navigation";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { GeneralTab } from "@/components/settings/GeneralTab";
import { UsageLimitsTab } from "@/components/settings/UsageLimitsTab";
import { SettingsTabsNavigation } from "@/components/settings/SettingsTabsNavigation";

interface SettingsTabPageProps {
  params: Promise<{
    tab: string;
  }>;
}

const SettingsTabPage = ({ params }: SettingsTabPageProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const router = useRouter();
  const resolvedParams = use(params);

  // Constants
  const validTabs = ["general", "profile", "usage"];
  const activeTab = validTabs.includes(resolvedParams.tab) 
    ? (resolvedParams.tab as "general" | "profile" | "usage")
    : "general";

  // Helpers / Functions
  const handleTabChange = (tab: "general" | "profile" | "usage") => {
    router.push(`/settings/${tab}`);
  };

  // Conditional rendering
  if (!validTabs.includes(resolvedParams.tab)) {
    router.replace("/settings/general");
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold">
          {t("settings.title", "Configuración")}
        </h1>
        <p className="text-muted-foreground">
          {t(
            "settings.description",
            "Gestiona tu perfil, preferencias y configuración de la cuenta"
          )}
        </p>
      </div>

      <div className="my-8">
        <hr />
      </div>

      <div className="flex gap-8">
        {/* Vertical Tabs Navigation */}
        <SettingsTabsNavigation
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "usage" && <UsageLimitsTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsTabPage;