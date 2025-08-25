import { getResumeAnalysis } from "@/actions/resume-analysis";
import ResumeAnalysis  from "./_components/resume-analysis ";
import { getUserOnboardingStatus } from "@/actions/user";

export default async function ResumePage() {
 const resume = await getResumeAnalysis();
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return (
    <div className="container mx-auto">
      <ResumeAnalysis  data={resume}/>
    </div>
  );
}