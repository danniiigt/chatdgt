"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  // Third party hooks
  const router = useRouter();

  // Effects
  useEffect(function redirectToGeneral() {
    router.replace("/settings/general");
  }, [router]);

  return null;
};

export default SettingsPage;