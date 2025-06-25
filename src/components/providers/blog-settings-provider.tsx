'use client';

import { createContext, useContext, ReactNode } from 'react';
import { BlogSettings } from '@/types/blog-settings';

interface BlogSettingsContextType {
  settings: BlogSettings | null;
  loading: boolean;
  error: string | null;
}

const BlogSettingsContext = createContext<BlogSettingsContextType | undefined>(undefined);

export function BlogSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: BlogSettings | null;
}) {
  return (
    <BlogSettingsContext.Provider 
      value={{
        settings: initialSettings,
        loading: false,
        error: null,
      }}
    >
      {children}
    </BlogSettingsContext.Provider>
  );
}

export function useBlogSettings() {
  const context = useContext(BlogSettingsContext);
  if (context === undefined) {
    throw new Error('useBlogSettings must be used within a BlogSettingsProvider');
  }
  return context;
}

export function useContactInfo() {
  const { settings } = useBlogSettings();
  
  if (!settings) {
    return {
      email: null,
      phone: null,
      address: null,
      hours: null,
      mapUrl: null,
    };
  }
  
  return {
    email: settings.contactEmail || null,
    phone: settings.contactPhone || null,
    address: settings.contactAddress || null,
    hours: settings.contactHours || null,
    mapUrl: settings.contactMapUrl || null,
  };
}
