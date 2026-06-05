import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Code2,
  Cloud,
  LayoutTemplate,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

const formSchema = z.object({
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select an estimated budget"),
  timeline: z.string().min(1, "Please select a timeline"),
  requirements: z
    .string()
    .min(10, "Please provide some details about your project"),
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  urgency: z.string().min(1, "Please select urgency"),
  selectedFeatures: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const projectTypes = [
  { id: "enterprise", label: "Enterprise Web", icon: <Code2 size={24} /> },
  { id: "saas", label: "SaaS Platform", icon: <Cloud size={24} /> },
  { id: "uiux", label: "UI/UX Redesign", icon: <LayoutTemplate size={24} /> },
  { id: "other", label: "Architecture", icon: <Briefcase size={24} /> },
];

const budgetRanges = [
  { id: "10k-25k", label: "$10k - $25k" },
  { id: "25k-50k", label: "$25k - $50k" },
  { id: "50k-100k", label: "$50k - $100k" },
  { id: "100k+", label: "$100k+" },
];

const timelines = [
  { id: "immediate", label: "Immediate (1-2 Months)" },
  { id: "3-6m", label: "3-6 Months" },
  { id: "6m+", label: "6+ Months" },
  { id: "flexible", label: "Flexible" },
];

import { useAuth } from "../../hooks/useAuth";
import { ProjectOrchestrator } from "../services/projectOrchestrator";

export function ContactForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectType: "",
      budget: "",
      timeline: "",
      requirements: "",
      clientName: "",
      email: "",
      company: "",
      industry: "",
      urgency: "",
      selectedFeatures: [],
    },
  });

  const watchProjectType = watch("projectType");
  const watchBudget = watch("budget");
  const watchTimeline = watch("timeline");

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["projectType", "budget"]);
    } else if (step === 2) {
      isValid = await trigger(["timeline", "urgency", "requirements"]);
    }
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await ProjectOrchestrator.submitProject({
        userId: user?.uid || "anonymous",
        email: data.email,
        clientName: data.clientName,
        company: data.company,
        industry: data.industry,
        projectType: data.projectType,
        selectedFeatures: data.selectedFeatures,
        requirements: data.requirements,
        budget: data.budget,
        timeline: data.timeline,
        urgency: data.urgency,
        status: "pending",
      });

      if (result.success) {
        setIsSuccess(true);
        reset();
        setStep(1);
      } else {
        setSubmitError(result.message || "An error occurred submitting your request.");
      }
    } catch (error) {
      setSubmitError("An error occurred submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-surface relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-[800px] bg-primary/5 blur-[200px] pointer-events-none rounded-full translate-x-1/2"></div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <FadeUp className="lg:col-span-5 pt-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
              Project Discovery
            </h2>
            <h3 className="text-4xl md:text-6xl font-display font-medium tracking-tighter text-white mb-6 leading-[1.1]">
              INITIATE <br /> ALLIANCE.
            </h3>
            <p className="text-lg text-text-muted mb-10 leading-relaxed font-light">
              Connect with our elite architecture team to evaluate your
              requirements and scope your next enterprise deployment.
            </p>

            <div className="space-y-6">
              {[
                { stepNum: 1, title: "Scope" },
                { stepNum: 2, title: "Details" },
                { stepNum: 3, title: "Identity" },
              ].map((s) => (
                <div
                  key={s.stepNum}
                  className={cn(
                    "flex items-center gap-4 transition-all duration-500",
                    step === s.stepNum ? "opacity-100" : "opacity-30",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full font-mono text-sm flex items-center justify-center border transition-all duration-500",
                      step === s.stepNum
                        ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(10,102,194,0.4)]"
                        : step > s.stepNum
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-transparent text-slate-500 border-white/10",
                    )}
                  >
                    {step > s.stepNum ? <CheckCircle2 size={16} /> : s.stepNum}
                  </div>
                  <span
                    className={cn(
                      "uppercase tracking-widest text-xs font-bold",
                      step === s.stepNum ? "text-white" : "text-slate-500",
                    )}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="lg:col-span-7 relative min-h-[500px]">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-10 w-full h-full"
              >
                <Card className="h-full flex flex-col justify-center items-center text-center p-12">
                  <div className="w-20 h-20 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-3xl font-display font-medium text-white mb-3">
                    Request Secured
                  </h4>
                  <p className="text-text-muted text-lg font-light mb-8 max-w-sm">
                    Our elite engineering team has received your brief and will
                    be in touch shortly.
                  </p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)}>
                    Submit Another Inquiry
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <div className="relative w-full h-full">
                <Card className="bg-background/80 backdrop-blur-2xl border-white/10 shadow-2xl relative w-full overflow-hidden min-h-[550px]">
                  <div className="h-1 bg-white/5 w-full absolute top-0 left-0">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "33%" }}
                      animate={{ width: `${(step / 3) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                  <CardContent className="p-8 md:p-12 relative h-full flex flex-col">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex-1"
                        >
                          <h4 className="text-2xl font-display text-white mb-6">
                            What are we building?
                          </h4>
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <Controller
                              name="projectType"
                              control={control}
                              render={({ field }) => (
                                <>
                                  {projectTypes.map((type) => (
                                    <button
                                      key={type.id}
                                      type="button"
                                      onClick={() => field.onChange(type.id)}
                                      className={cn(
                                        "p-4 rounded-xl border text-left transition-all duration-300 flex flex-col gap-3 group",
                                        watchProjectType === type.id
                                          ? "bg-primary/10 border-primary shadow-[0_0_20px_-5px_rgba(10,102,194,0.3)]"
                                          : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/5",
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "text-slate-400 group-hover:text-primary transition-colors",
                                          watchProjectType === type.id &&
                                            "text-primary",
                                        )}
                                      >
                                        {type.icon}
                                      </div>
                                      <span
                                        className={cn(
                                          "font-medium text-sm",
                                          watchProjectType === type.id
                                            ? "text-white"
                                            : "text-slate-400",
                                        )}
                                      >
                                        {type.label}
                                      </span>
                                    </button>
                                  ))}
                                </>
                              )}
                            />
                          </div>
                          {errors.projectType && (
                            <p className="text-red-400 text-xs mt-1 mb-6 relative -top-4">
                              {errors.projectType.message}
                            </p>
                          )}

                          <h4 className="text-xl font-display text-white mb-4">
                            Estimated Budget
                          </h4>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <Controller
                              name="budget"
                              control={control}
                              render={({ field }) => (
                                <>
                                  {budgetRanges.map((range) => (
                                    <button
                                      key={range.id}
                                      type="button"
                                      onClick={() => field.onChange(range.id)}
                                      className={cn(
                                        "py-3 px-4 rounded-lg border text-center transition-all duration-300",
                                        watchBudget === range.id
                                          ? "bg-primary border-primary text-white"
                                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white",
                                      )}
                                    >
                                      <span className="font-mono text-xs">
                                        {range.label}
                                      </span>
                                    </button>
                                  ))}
                                </>
                              )}
                            />
                          </div>
                          {errors.budget && (
                            <p className="text-red-400 text-xs mt-1 relative">
                              {errors.budget.message}
                            </p>
                          )}

                          <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
                            <Button
                              type="button"
                              onClick={handleNext}
                              className="gap-2"
                            >
                              Continue <ArrowRight size={16} />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex-1"
                        >
                          <h4 className="text-2xl font-display text-white mb-6">
                            Timeline & Details
                          </h4>
                          <div className="grid grid-cols-2 gap-3 mb-8">
                            <Controller
                              name="timeline"
                              control={control}
                              render={({ field }) => (
                                <>
                                  {timelines.map((time) => (
                                    <button
                                      key={time.id}
                                      type="button"
                                      onClick={() => field.onChange(time.id)}
                                      className={cn(
                                        "py-3 px-4 rounded-lg border text-center transition-all duration-300",
                                        watchTimeline === time.id
                                          ? "bg-primary/20 border-primary text-white"
                                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:text-white",
                                      )}
                                    >
                                      <span className="font-mono text-xs">
                                        {time.label}
                                      </span>
                                    </button>
                                  ))}
                                </>
                              )}
                            />
                          </div>
                          {errors.timeline && (
                            <p className="text-red-400 text-xs mt-1 mb-6 relative -top-4">
                              {errors.timeline.message}
                            </p>
                          )}

                          <div className="space-y-4 mb-4">
                            <div className="space-y-2">
                              <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                                htmlFor="urgency"
                              >
                                Urgency Level
                              </label>
                              <select
                                id="urgency"
                                {...register("urgency")}
                                className={`flex w-full rounded-md border border-white/5 bg-surface/50 px-4 py-3 text-[15px] text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 ${errors.urgency ? "border-red-500/50" : ""}`}
                              >
                                <option value="">Select urgency</option>
                                <option value="high">
                                  High - Immediate Start
                                </option>
                                <option value="medium">
                                  Medium - Within 3 Months
                                </option>
                                <option value="low">
                                  Low - Exploring Options
                                </option>
                              </select>
                              {errors.urgency && (
                                <p className="text-red-400 text-xs mt-1">
                                  {errors.urgency.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                                htmlFor="requirements"
                              >
                                Project Requirements
                              </label>
                              <textarea
                                id="requirements"
                                rows={5}
                                placeholder="Describe the core objectives, existing tech stack, and key deliverables..."
                                {...register("requirements")}
                                className={`flex w-full rounded-md border border-white/5 bg-surface/50 px-4 py-3 text-[15px] text-white placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 resize-none ${errors.requirements ? "border-red-500/50" : ""}`}
                              />
                              {errors.requirements && (
                                <p className="text-red-400 text-xs mt-1">
                                  {errors.requirements.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-8 pt-8 border-t border-white/5 flex justify-between">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setStep(1)}
                              className="gap-2"
                            >
                              <ArrowLeft size={16} /> Back
                            </Button>
                            <Button
                              type="button"
                              onClick={handleNext}
                              className="gap-2"
                            >
                              Continue <ArrowRight size={16} />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex-1"
                        >
                          <h4 className="text-2xl font-display text-white mb-6">
                            Identity Verification
                          </h4>
                          <div className="space-y-5 mb-8">
                            <div className="space-y-2">
                              <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                                htmlFor="clientName"
                              >
                                Full Name
                              </label>
                              <Input
                                id="clientName"
                                placeholder="Jane Doe"
                                {...register("clientName")}
                                className={
                                  errors.clientName ? "border-red-500/50" : ""
                                }
                              />
                              {errors.clientName && (
                                <p className="text-red-400 text-xs">
                                  {errors.clientName.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                                htmlFor="company"
                              >
                                Company / Organization
                              </label>
                              <Input
                                id="company"
                                placeholder="Acme Global"
                                {...register("company")}
                                className={
                                  errors.company ? "border-red-500/50" : ""
                                }
                              />
                              {errors.company && (
                                <p className="text-red-400 text-xs">
                                  {errors.company.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                                htmlFor="industry"
                              >
                                Industry
                              </label>
                              <Input
                                id="industry"
                                placeholder="Finance, Healthcare, Tech..."
                                {...register("industry")}
                                className={
                                  errors.industry ? "border-red-500/50" : ""
                                }
                              />
                              {errors.industry && (
                                <p className="text-red-400 text-xs">
                                  {errors.industry.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label
                                className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                                htmlFor="email"
                              >
                                Work Email
                              </label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="jane@acmeglobal.com"
                                {...register("email")}
                                className={
                                  errors.email ? "border-red-500/50" : ""
                                }
                              />
                              {errors.email && (
                                <p className="text-red-400 text-xs">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>

                          {submitError && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 mb-4">
                              <XCircle size={16} /> {submitError}
                            </div>
                          )}

                          <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setStep(2)}
                              className="gap-2 px-0"
                            >
                              <ArrowLeft size={16} /> Back
                            </Button>
                            {!user ? (
                              <Button
                                type="button"
                                onClick={() =>
                                  window.dispatchEvent(
                                    new CustomEvent("open-auth", {
                                      detail: { mode: "register" },
                                    }),
                                  )
                                }
                                className="tracking-[0.1em] font-bold gap-2"
                              >
                                Login to Submit
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className="tracking-[0.1em] font-bold gap-2"
                              >
                                {isSubmitting ? (
                                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                  "Initiate Alliance"
                                )}
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            )}
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
