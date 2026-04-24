import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { PillarsSection } from './sections/PillarsSection';
import { PersonasSection } from './sections/PersonasSection';
import { ComplianceAcademySection } from './sections/ComplianceAcademySection';

export const LandingPage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <PillarsSection />
      <PersonasSection />
      <ComplianceAcademySection />
    </div>
  );
};
