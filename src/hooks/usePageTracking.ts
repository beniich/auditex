import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook pour le suivi analytique des pages.
 * Intègre Google Analytics (si présent dans l'objet window).
 */
export const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Intégration avec Google Analytics (GTAG)
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
      });
    }
    
    // Log forensic de navigation pour l'auditabilité interne
    console.debug(`[AuditAX Telemetry] Navigated to: ${location.pathname}`);
  }, [location]);
};
