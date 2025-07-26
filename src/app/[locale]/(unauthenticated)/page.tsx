import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getTranslate } from "@/tolgee/server";
import Link from "next/link";
import React from "react";

const LandingPage = async () => {
  // Third party hooks
  const t = await getTranslate();

  return (
    <div className="w-full h-dvh flex-col flex items-center justify-center space-y-10">
      <div>
        <Icons.chatgpt className="h-48 w-48" />
      </div>

      <header className="text-center space-y-2">
        <h1 className="text-4xl font-semibold">ChatDGT</h1>
        <h3 className="text-muted-foreground inline-block mr-1">
          {t("landing.description")}
        </h3>
        <Link
          href="https://github.com/danniiigt"
          target="_blank"
          className="inline-flex items-center gap-x-1 w-fit border-b border-b-black/30"
        >
          <span>@danniiigt</span>
          <Icons.github className="h-4 w-4" />
        </Link>
      </header>

      <div className="w-full max-w-sm flex flex-col items-center justify-center gap-x-8">
        <Button size="lg" className="w-full" variant="secondary" asChild>
          <Link prefetch={true} href="/sign-in">
            {t("landing.sign-in")}
          </Link>
        </Button>

        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t border-border" />
          <span className="mx-4 text-muted-foreground text-sm select-none">
            o
          </span>
          <div className="flex-grow border-t border-border" />
        </div>

        <Button size="lg" className="w-full" asChild>
          <Link prefetch={true} href="/sign-up">
            {t("landing.sign-up")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
