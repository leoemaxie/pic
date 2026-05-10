import { Onboarding } from '@/lib/screens/Onboarding';

export default async function OnboardingPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;

  return <Onboarding step={step} />;
}
