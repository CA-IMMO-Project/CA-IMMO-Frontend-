import { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'EUR' | 'USD' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convertPrice: (priceInEur: number) => { value: number; symbol: string; locale: string; currency: string };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Taux de conversion fictifs pour la démonstration
const RATES = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR');

  const convertPrice = (priceInEur: number) => {
    const value = priceInEur * RATES[currency];
    switch (currency) {
      case 'USD': return { value, symbol: '$', locale: 'en-US', currency: 'USD' };
      case 'GBP': return { value, symbol: '£', locale: 'en-GB', currency: 'GBP' };
      case 'EUR':
      default: return { value, symbol: '€', locale: 'fr-FR', currency: 'EUR' };
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
