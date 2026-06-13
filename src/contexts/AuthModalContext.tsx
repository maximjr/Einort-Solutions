import { createContext, useCallback, useContext, useState } from "react";

type AuthMode = "login" | "register";

interface AuthModalContextType {
  isOpen: boolean;
  mode:   AuthMode;
  open:   (mode?: AuthMode) => void;
  close:  () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  isOpen: false,
  mode:   "login",
  open:   () => {},
  close:  () => {},
});

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode,   setMode]   = useState<AuthMode>("login");

  const open  = useCallback((m: AuthMode = "login") => { setMode(m); setIsOpen(true); }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, open, close }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}
