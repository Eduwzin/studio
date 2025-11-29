import OnboardingForm from "@/components/onboarding/onboarding-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto">
       <h1 className="text-3xl font-bold font-headline mb-2">Your Investor Profile</h1>
      <p className="text-muted-foreground mb-8">
        Tell us a bit about yourself so our AI can create the perfect investment strategy for you. Your information helps us tailor recommendations to your financial goals and comfort with risk.
      </p>
      <Card>
        <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
            <CardDescription>This will take just a couple of minutes.</CardDescription>
        </CardHeader>
        <CardContent>
            <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
