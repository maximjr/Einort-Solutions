import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ENV, isFirebaseConfigured, isGoogleAuthEnabled } from '../config/env';

export function DevSetupGuard() {
  return null;
}
