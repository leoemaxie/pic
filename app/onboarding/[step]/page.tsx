'use client';

import { Onboarding } from '@/lib/screens/Onboarding';

export default function OnboardingPage({ params }: { params: { step: string } }) {
  return <Onboarding step={params.step} />;
}
