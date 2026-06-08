import { lazy } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Loadable } from "../shared/Loadable";

const ActiveClientFloatingMessenger = Loadable(
  lazy(() => import("./ActiveClientFloatingMessenger")),
  () => null
);

export function GlobalFloatingMessenger() {
  const { user, userData, loading } = useAuth();
  
  if (loading) return null;
  
  // Strict guard: ONLY render messaging pipeline for actual clients.
  // Guests, logged out users, and admins/super_admins DO NOT trigger this logic.
  const isClient = user && userData && userData.role !== "admin" && userData.role !== "super_admin" && !userData.isAdmin;

  if (!isClient) return null;

  return <ActiveClientFloatingMessenger user={user} userData={userData} />;
}
