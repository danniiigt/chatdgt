import { getTranslate } from "@/tolgee/server";
import { suggestedMessages } from "@/lib/constants";

export const SuggestedMessages = async () => {
  // Third party hooks
  const t = await getTranslate();

  // Helpers / Functions
  const getRandomMessages = () => {
    const shuffled = [...suggestedMessages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Constants
  const randomMessages = getRandomMessages();

  return (
    <div className="w-full h-full max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {randomMessages.map((message, index) => (
          <button
            key={index}
            className="border rounded-2xl p-5 text-left hover:bg-muted/50 transition-colors duration-200 group cursor-pointer"
          >
            <h3 className="text-sm text-foreground/80 group-hover:text-foreground leading-relaxed">
              {t(message.key, message.keyFallback)}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
};
