import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEn from '../locales/en/common.json';
import commonFr from '../locales/fr/common.json';
import marketingEn from '../locales/en/marketing.json';
import marketingFr from '../locales/fr/marketing.json';
import dashboardEn from '../locales/en/dashboard.json';
import dashboardFr from '../locales/fr/dashboard.json';
import auditEn from '../locales/en/audit.json';
import auditFr from '../locales/fr/audit.json';
import chaosEn from '../locales/en/chaos.json';
import chaosFr from '../locales/fr/chaos.json';
import vaultEn from '../locales/en/vault.json';
import vaultFr from '../locales/fr/vault.json';

const resources = {
  en: {
    common: commonEn,
    marketing: marketingEn,
    dashboard: dashboardEn,
    audit: auditEn,
    chaos: chaosEn,
    vault: vaultEn,
  },
  fr: {
    common: commonFr,
    marketing: marketingFr,
    dashboard: dashboardFr,
    audit: auditFr,
    chaos: chaosFr,
    vault: vaultFr,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    ns: ['common', 'marketing', 'dashboard', 'audit', 'chaos', 'vault'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
