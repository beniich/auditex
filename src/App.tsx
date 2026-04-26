import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicLayout } from './pages/layout/PublicLayout';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { CISOPage } from './pages/CISOPage';
import { CFOPage } from './pages/CFOPage';
import { CLOPage } from './pages/CLOPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PartnerPortalPage } from './pages/PartnerPortalPage';
import { WebinarPage } from './pages/WebinarPage';
import { RiskCalculatorPage } from './pages/RiskCalculatorPage';
import { ChaosLabPublic } from './pages/ChaosLabPublic';
import { Skeleton } from './components/common/Skeleton';

// Lazy load the internal app container
const DashboardContainer = lazy(() => import('./pages/DashboardContainer').then(m => ({ default: m.DashboardContainer })));

import { usePageTracking } from './hooks/usePageTracking';

// Inner component to use location within BrowserRouter
const TrackingWrapper = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <TrackingWrapper>
        <Toaster position="top-right" expand={false} richColors />
        <Routes>
        {/* Marketing Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ciso" element={<CISOPage />} />
          <Route path="/cfo" element={<CFOPage />} />
          <Route path="/clo" element={<CLOPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/partner" element={<PartnerPortalPage />} />
          <Route path="/webinar" element={<WebinarPage />} />
          <Route path="/risk-calculator" element={<RiskCalculatorPage />} />
          <Route path="/chaos" element={<ChaosLabPublic />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/app/*" element={
          <ProtectedRoute>
            <Suspense fallback={<Skeleton className="h-screen w-full" />}>
              <DashboardContainer />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </TrackingWrapper>
    </BrowserRouter>
  );
}
