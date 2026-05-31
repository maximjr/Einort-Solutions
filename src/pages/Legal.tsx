import React from 'react';
import { CinematicTransition } from '../components/CinematicTransition';

export function Legal() {
  return (
    <CinematicTransition>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-medium text-white mb-8">Legal Information</h1>
        <div className="prose prose-invert max-w-none text-white/70 font-light">
          <p>Please contact us for more information regarding our Privacy Policy and Terms of Service.</p>
        </div>
      </div>
    </CinematicTransition>
  );
}
