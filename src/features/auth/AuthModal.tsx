import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Logo } from "../../components/ui/Logo";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(5, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string().min(6, "Password must be at least 6 characters"),
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
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorStatus(null);
    setSuccessStatus(null);
    loginForm.reset();
    registerForm.reset();
  };

  const redirectUser = async (
    uid: string,
    fallbackData?: {
      email: string;
      fullName: string;
      phone: string;
      emailVerified?: boolean;
    },
  ) => {
    try {
      if (!db) {
        navigate("/client-portal");
        onClose();
        return;
      }
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role === "admin" || data.role === "super_admin") {
          navigate("/admin");
        } else {
          navigate("/client-portal");
        }
      } else {
        // Orphaned account recovery - recreate profile if missing
        if (fallbackData) {
          await setDoc(docRef, {
            uid: uid,
            email: fallbackData.email,
            fullName: fallbackData.fullName,
            role: "client",
            accountType: "enterprise",
            permissions: ["read_own_profile", "read_own_projects"],
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            emailVerified: fallbackData.emailVerified || false,
            profileCompleted: true,
          });
        }
        navigate("/client-portal");
      }
      onClose();
    } catch (e) {
      navigate("/client-portal");
      onClose();
    }
  };

  const onLogin = async (data: LoginData) => {
    if (!auth) {
      setErrorStatus("Auth service not available");
      return;
    }
    setIsLoading(true);
    setErrorStatus(null);
    setSuccessStatus(null);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      setSuccessStatus("Secure connection established. Redirecting...");
      await redirectUser(cred.user.uid, {
        email: data.email,
        fullName: "User",
        phone: "",
      });
    } catch (error: any) {
      setIsLoading(false);
      console.error(`[Firebase Login Error] Code: ${error.code}, Message: ${error.message}`, error);
      
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErrorStatus("Password or Email Incorrect");
      } else {
        setErrorStatus(error.message || "Authentication failed. Please attempt again later.");
      }
    }
  };

  const onRegister = async (data: RegisterData) => {
    if (!auth || !db) return;
    setIsLoading(true);
    setErrorStatus(null);
    setSuccessStatus(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const user = userCredential.user;
      await updateProfile(user, { displayName: data.name });

      // Force token refresh to avoid permission denied race condition in Firestore
      await user.getIdToken(true);

      // Create single source of truth RBAC profile securely
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: data.email,
        fullName: data.name,
        role: "client",
        accountType: "enterprise",
        permissions: ["read_own_profile", "read_own_projects"],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        emailVerified: user.emailVerified,
        profileCompleted: true,
      });

      setSuccessStatus(
        "Account created successfully. Redirecting automatically...",
      );
      await redirectUser(user.uid, {
        email: data.email,
        fullName: data.name,
        phone: data.phone,
        emailVerified: user.emailVerified,
      });
    } catch (error: any) {
      setIsLoading(false);
      console.error(`[Firebase Signup Error] Code: ${error.code}, Message: ${error.message}`, error);
      
      if (error.code === "auth/email-already-in-use") {
        setErrorStatus("User already exists. Sign in?");
      } else {
        setErrorStatus(error.message || "Registration failed. Please attempt again later.");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-surface border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-8 text-center relative z-10">
                <div className="flex justify-center mb-6">
                  <Logo />
                </div>
                <h2 className="text-2xl font-display text-white mb-2">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-text-muted text-sm">
                  {mode === "login"
                    ? "Sign in to access your client portal."
                    : "Register to start your architectural journey."}
                </p>
              </div>

              <div className="relative z-10">
                  {errorStatus && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3 relative z-10 transition-all">
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

                  {successStatus && (
                    <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-start gap-3 relative z-10 transition-all">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-green-200">{successStatus}</div>
                    </div>
                  )}

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
