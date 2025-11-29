"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { analyzeUserProfile } from "@/lib/actions";
import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  age: z.coerce.number().min(18, { message: "You must be at least 18 years old." }).max(100),
  income: z.coerce.number().min(0, { message: "Income must be a positive number." }),
  investmentAmount: z.coerce.number().min(100, { message: "Minimum investment is $100." }),
  riskTolerance: z.enum(["low", "medium", "high"]),
  investmentExperience: z.enum(["none", "beginner", "intermediate", "expert"]),
  financialGoals: z.string().min(10, { message: "Please describe your goals in at least 10 characters." }),
});

type AnalysisResult = {
    investmentStrategy: string;
    assetAllocation: string;
    riskAssessment: string;
}

export default function OnboardingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      income: 50000,
      investmentAmount: 1000,
      financialGoals: "Long-term growth for retirement.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);
    try {
        const result = await analyzeUserProfile(values);
        setAnalysisResult(result);
        toast({
            title: "Analysis Complete!",
            description: "We've created a personalized strategy for you.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "There was an error processing your profile. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="25" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="income"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Annual Income</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="50000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="investmentAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Initial Investment Amount</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="1000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="riskTolerance"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Risk Tolerance</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your risk tolerance" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                How comfortable are you with market fluctuations?
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="investmentExperience"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Investment Experience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your experience level" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                How experienced are you with investing?
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <FormField
                    control={form.control}
                    name="financialGoals"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Financial Goals</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Save for retirement, buy a house..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                         <>
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Analyze My Profile
                        </>
                    )}
                </Button>
            </form>
        </Form>
        {analysisResult && (
            <Card className="mt-8 bg-secondary">
                <CardHeader>
                    <CardTitle>Your Personalized Strategy</CardTitle>
                    <CardDescription>Based on your profile, here is our AI's recommendation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <h4 className="font-semibold text-foreground">Investment Strategy</h4>
                        <p className="text-muted-foreground">{analysisResult.investmentStrategy}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground">Recommended Asset Allocation</h4>
                        <p className="text-muted-foreground">{analysisResult.assetAllocation}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground">Risk Assessment</h4>
                        <p className="text-muted-foreground">{analysisResult.riskAssessment}</p>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
