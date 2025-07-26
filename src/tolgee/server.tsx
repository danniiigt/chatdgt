import { getLocale } from "next-intl/server";

import { TolgeeBase, getStaticData } from "./shared";
import { createServerInstance } from "@tolgee/react/server";
import { LOCALES } from "@/lib/constants";

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale,
  createTolgee: async (locale) =>
    TolgeeBase().init({
      // load all languages on the server
      staticData: await getStaticData(LOCALES),
      observerOptions: {
        fullKeyEncode: true,
      },
      language: locale,
      // using custom fetch to avoid aggressive caching
      fetch: async (input, init) => {
        const data = await fetch(input, { ...init, next: { revalidate: 0 } });
        return data;
      },
    }),
});
