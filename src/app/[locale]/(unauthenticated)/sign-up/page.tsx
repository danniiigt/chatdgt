import { Icons } from "@/components/ui/icons";
import { SignUpForm } from "@/components/forms/SignUpForm";
import { getTranslate } from "@/tolgee/server";

export const generateMetadata = async () => {
  const t = await getTranslate();
  return {
    title: t("sign-up.title"),
    description: t("sign-up.description"),
  };
};

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div>
        <Icons.chatgpt className="h-32 w-32" />
      </div>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
