import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import ResumeUpload from "./_components/onboarding-form";

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded) {
    redirect("/dashboard"); // server-side redirect, instant
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <ResumeUpload />
    </main>
  );
}
