import React from 'react';
import { HeaderProps } from '@/types/layout-components';
import HeaderClient from './header-client';

export default function Header({ categories = [], blogSettings }: HeaderProps) {
  if (!blogSettings) {
    return null; // Ou um fallback UI
  }
  
  // Mapear os menus para o formato esperado
  const menus = (blogSettings.menus || []).map(menu => ({
    _id: menu._id || '',
    name: menu.name || 'Menu',
    location: menu.location || 'header',
    items: (menu.items || []).map(item => ({
      _id: item._id || '',
      name: item.name || 'Item',
      url: item.url || '#',
      order: typeof item.order === 'number' ? item.order : 0,
      isCTA: Boolean(item.isCTA)
    }))
  }));
  
  return (
    <HeaderClient 
      categories={categories} 
      blogSettings={{
        name: blogSettings.name || 'Site',
        description: blogSettings.description || '',
        logo: blogSettings.logo || '/logo.png',
        menus
      }} 
    />
  );
}
