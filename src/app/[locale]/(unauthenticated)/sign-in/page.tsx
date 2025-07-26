import { Icons } from "@/components/ui/icons";
import { SignInForm } from "@/components/forms/SignInForm";
import { getTranslate } from "@/tolgee/server";

export const generateMetadata = async () => {
  const t = await getTranslate();
  return {
    title: t("sign-in.title"),
    description: t("sign-in.description"),
  };
};

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div>
        <Icons.chatgpt className="h-32 w-32" />
      </div>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
