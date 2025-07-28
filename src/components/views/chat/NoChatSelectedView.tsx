import { Icons } from "@/components/ui/icons";
import { getTranslate } from "@/tolgee/server";
import { SuggestedMessages } from "./SuggestedMessages";

export const NoChatSelectedView = async () => {
  // Third party hooks
  const t = await getTranslate();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center pb-16">
        <header className="space-y-8">
          <Icons.chatgpt className="size-40 mx-auto" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-semibold">
                {t("chat.welcome", "¡Hola! Todo bien por aquí")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("chat.welcome-subtitle", "¿En qué te puedo ayudar hoy?")}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-8">
          <SuggestedMessages />
        </div>
      </div>
    </div>
  );
};
