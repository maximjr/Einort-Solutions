import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Logo } from "../../components/ui/Logo";
import { motion, AnimatePresence } from "motion/react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(6, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginData) => {
    setIsLoading(true);
    setErrorStatus(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      onClose();
    } catch (error: any) {
      setErrorStatus("Password or Email Incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterData) => {
    setIsLoading(true);
    setErrorStatus(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      await updateProfile(userCredential.user, { displayName: data.name });

      // Create single source of truth RBAC profile
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: "client",
        accountType: "enterprise",
        permissions: ["read_own_profile", "read_own_projects"],
        isAdmin: false,
        createdAt: serverTimestamp(),
      });

      onClose();
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setErrorStatus("User already exists. Sign in?");
      } else {
        setErrorStatus(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorStatus(null);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md relative"
          >
            <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Logo className="w-10 h-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
                  <div className="flex flex-col text-left">
                    <span className="text-xl font-display font-bold uppercase tracking-widest text-white leading-none">
                      Einort
                    </span>
                    <span className="text-[9px] font-display font-bold uppercase tracking-[0.3em] text-primary mt-1">
                      Solutions
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-display font-medium text-white uppercase tracking-tight">
                  {mode === "login" ? "Access Portal" : "Create Account"}
                </h2>
                <p className="text-text-muted text-sm mt-2 font-light">
                  {mode === "login"
                    ? "Sign in to access your enterprise dashboard."
                    : "Register to start your architectural journey."}
                </p>
              </div>

              {errorStatus && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3 relative z-10">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-200">
                    {errorStatus}
                    {errorStatus === "User already exists. Sign in?" && (
                      <button
                        onClick={() => switchMode("login")}
                        className="ml-2 underline font-bold hover:text-white"
                      >
                        Switch to Login
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="relative z-10">
                {mode === "login" ? (
                  <form
                    onSubmit={loginForm.handleSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Email
                      </label>
                      <Input
                        placeholder="name@company.com"
                        {...loginForm.register("email")}
                        className={`bg-white/[0.02] border-white/5 focus-visible:border-primary/50 text-[15px] h-12 ${loginForm.formState.errors.email ? "border-red-500/50" : ""}`}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-red-400 text-xs">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...loginForm.register("password")}
                          className={`bg-white/[0.02] border-white/5 focus-visible:border-primary/50 text-[15px] pr-10 h-12 ${loginForm.formState.errors.password ? "border-red-500/50" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-red-400 text-xs">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full uppercase tracking-[0.15em] font-bold mt-2 h-14 text-[11px]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Authenticating..." : "Sign In"}
                    </Button>
                  </form>
                ) : (
                  <form
                    onSubmit={registerForm.handleSubmit(onRegister)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Full Name
                      </label>
                      <Input
                        placeholder="John Doe"
                        {...registerForm.register("name")}
                        className={`bg-white/[0.02] border-white/5 focus-visible:border-primary/50 text-[15px] h-12 ${registerForm.formState.errors.name ? "border-red-500/50" : ""}`}
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-red-400 text-xs">
                          {registerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Email
                      </label>
                      <Input
                        placeholder="name@company.com"
                        {...registerForm.register("email")}
                        className={`bg-white/[0.02] border-white/5 focus-visible:border-primary/50 text-[15px] h-12 ${registerForm.formState.errors.email ? "border-red-500/50" : ""}`}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-red-400 text-xs">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Phone Number
                      </label>
                      <Input
                        placeholder="+1 (555) 000-0000"
                        {...registerForm.register("phone")}
                        className={`bg-white/[0.02] border-white/5 focus-visible:border-primary/50 text-[15px] h-12 ${registerForm.formState.errors.phone ? "border-red-500/50" : ""}`}
                      />
                      {registerForm.formState.errors.phone && (
                        <p className="text-red-400 text-xs">
                          {registerForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...registerForm.register("password")}
                          className={`bg-white/[0.02] border-white/5 focus-visible:border-primary/50 text-[15px] pr-10 h-12 ${registerForm.formState.errors.password ? "border-red-500/50" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="text-red-400 text-xs">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Repeat Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showRepeatPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...registerForm.register("repeatPassword")}
                          className={`bg-white/[0.02] border-white/5 focus-visible:border-primary/50 text-[15px] pr-10 h-12 ${registerForm.formState.errors.repeatPassword ? "border-red-500/50" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowRepeatPassword(!showRepeatPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                        >
                          {showRepeatPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.repeatPassword && (
                        <p className="text-red-400 text-xs">
                          {registerForm.formState.errors.repeatPassword.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full uppercase tracking-[0.15em] font-bold mt-2 h-14 text-[11px]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Register"}
                    </Button>
                  </form>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 text-center relative z-10">
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={() =>
                      switchMode(mode === "login" ? "register" : "login")
                    }
                    className="ml-2 text-primary font-bold hover:text-white transition-colors focus:outline-none"
                  >
                    {mode === "login" ? "Create one" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
