'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import MenuEditor from './menu-editor';

interface MenuItem {
  name: string;
  url: string;
  order: number;
}

interface Menu {
  name: string;
  location: string;
  items: MenuItem[];
}

interface BlogSettings {
  menus: Menu[];
  legacyMenuItems?: MenuItem[];
  [key: string]: any;
}

interface PostSuggestion {
  title: string;
  slug: string;
}

interface CategorySuggestion {
  name: string;
  slug: string;
}

export default function MenusSettingsPage() {
  const [settings, setSettings] = useState<BlogSettings>({
    menus: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [postSuggestions, setPostSuggestions] = useState<PostSuggestion[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<CategorySuggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeMenuItemIndex, setActiveMenuItemIndex] = useState<number | null>(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);
  
  // Locais disponíveis para posicionar os menus
  const menuLocations = [
    { id: 'header', name: 'Topo (Header)' },
    { id: 'footer', name: 'Rodapé (Footer)' },
    { id: 'sidebar', name: 'Barra Lateral' },
    { id: 'mobile', name: 'Menu Mobile' }
  ];

  // Carregar configurações ao montar o componente
  useEffect(() => {
    fetchSettings();
    fetchPostsAndCategories();
  }, []);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Buscar configurações do blog
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/blog');
      const data = await response.json();
      
      if (data.settings) {
        // Migrar menus antigos para o novo formato se necessário
        if (!data.settings.menus || data.settings.menus.length === 0) {
          // Se não houver menus no novo formato, mas houver no formato antigo
          if (data.settings.legacyMenuItems && data.settings.legacyMenuItems.length > 0) {
            data.settings.menus = [
              {
                name: 'Menu Principal',
                location: 'header',
                items: data.settings.legacyMenuItems
              }
            ];
          } else {
            // Inicializar com um menu vazio
            data.settings.menus = [
              {
                name: 'Menu Principal',
                location: 'header',
                items: []
              }
            ];
          }
        }
        
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast.error('Erro ao carregar configurações do blog');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar posts e categorias para sugestões
  const fetchPostsAndCategories = async () => {
    try {
      // Buscar posts
      const postsResponse = await fetch('/api/posts?limit=100');
      const postsData = await postsResponse.json();
      
      if (postsData.posts) {
        const suggestions = postsData.posts.map((post: any) => ({
          title: post.title,
          slug: `/blog/${post.slug}`
        }));
        setPostSuggestions(suggestions);
      }

      // Buscar categorias
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      
      if (categoriesData.categories) {
        const suggestions = categoriesData.categories.map((category: any) => ({
          name: category.name,
          slug: `/category/${category.slug}`
        }));
        setCategorySuggestions(suggestions);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  // Salvar configurações
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Ordenar itens de menu por ordem
      const updatedSettings = {
        ...settings,
        menus: settings.menus.map(menu => ({
          ...menu,
          items: [...menu.items].sort((a, b) => a.order - b.order)
        }))
      };
      
      const response = await fetch('/api/settings/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings: updatedSettings })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Configurações de menus salvas com sucesso!');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar um novo menu
  const addMenu = () => {
    setSettings(prev => ({
      ...prev,
      menus: [
        ...prev.menus,
        {
          name: `Novo Menu ${prev.menus.length + 1}`,
          location: 'header',
          items: []
        }
      ]
    }));
    // Selecionar o novo menu
    setActiveMenuIndex(settings.menus.length);
  };

  // Remover um menu
  const removeMenu = (index: number) => {
    setSettings(prev => ({
      ...prev,
      menus: prev.menus.filter((_, i) => i !== index)
    }));
    
    // Ajustar o índice ativo se necessário
    if (activeMenuIndex >= index && activeMenuIndex > 0) {
      setActiveMenuIndex(activeMenuIndex - 1);
    } else if (settings.menus.length <= 1) {
      setActiveMenuIndex(0);
    }
  };

  // Atualizar nome do menu
  const updateMenuName = (index: number, name: string) => {
    setSettings(prev => ({
      ...prev,
      menus: prev.menus.map((menu, i) => 
        i === index ? { ...menu, name } : menu
      )
    }));
  };

  // Atualizar localização do menu
  const updateMenuLocation = (index: number, location: string) => {
    setSettings(prev => ({
      ...prev,
      menus: prev.menus.map((menu, i) => 
        i === index ? { ...menu, location } : menu
      )
    }));
  };

  // Adicionar item ao menu
  const addMenuItem = (menuIndex: number) => {
    setSettings(prev => {
      const updatedMenus = [...prev.menus];
      const menuItems = [...updatedMenus[menuIndex].items];
      
      // Encontrar a maior ordem atual
      const maxOrder = menuItems.length > 0 
        ? Math.max(...menuItems.map(item => item.order))
        : -1;
      
      // Adicionar novo item
      menuItems.push({
        name: 'Novo Item',
        url: '/',
        order: maxOrder + 1
      });
      
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        items: menuItems
      };
      
      return {
        ...prev,
        menus: updatedMenus
      };
    });
  };

  // Remover item do menu
  const removeMenuItem = (menuIndex: number, itemIndex: number) => {
    setSettings(prev => {
      const updatedMenus = [...prev.menus];
      const menuItems = [...updatedMenus[menuIndex].items];
      
      // Remover o item
      menuItems.splice(itemIndex, 1);
      
      // Reordenar os itens restantes
      menuItems.forEach((item, index) => {
        item.order = index;
      });
      
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        items: menuItems
      };
      
      return {
        ...prev,
        menus: updatedMenus
      };
    });
  };

  // Atualizar item do menu
  const updateMenuItem = (menuIndex: number, itemIndex: number, field: keyof MenuItem, value: string | number) => {
    setSettings(prev => {
      const updatedMenus = [...prev.menus];
      const menuItems = [...updatedMenus[menuIndex].items];
      
      menuItems[itemIndex] = {
        ...menuItems[itemIndex],
        [field]: value
      };
      
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        items: menuItems
      };
      
      return {
        ...prev,
        menus: updatedMenus
      };
    });
  };

  // Mover item para cima
  const moveItemUp = (menuIndex: number, itemIndex: number) => {
    if (itemIndex === 0) return;
    
    setSettings(prev => {
      const updatedMenus = [...prev.menus];
      const menuItems = [...updatedMenus[menuIndex].items];
      
      // Trocar a ordem dos itens
      const temp = menuItems[itemIndex].order;
      menuItems[itemIndex].order = menuItems[itemIndex - 1].order;
      menuItems[itemIndex - 1].order = temp;
      
      // Reordenar o array
      menuItems.sort((a, b) => a.order - b.order);
      
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        items: menuItems
      };
      
      return {
        ...prev,
        menus: updatedMenus
      };
    });
  };

  // Mover item para baixo
  const moveItemDown = (menuIndex: number, itemIndex: number) => {
    const menuItems = settings.menus[menuIndex].items;
    if (itemIndex === menuItems.length - 1) return;
    
    setSettings(prev => {
      const updatedMenus = [...prev.menus];
      const menuItems = [...updatedMenus[menuIndex].items];
      
      // Trocar a ordem dos itens
      const temp = menuItems[itemIndex].order;
      menuItems[itemIndex].order = menuItems[itemIndex + 1].order;
      menuItems[itemIndex + 1].order = temp;
      
      // Reordenar o array
      menuItems.sort((a, b) => a.order - b.order);
      
      updatedMenus[menuIndex] = {
        ...updatedMenus[menuIndex],
        items: menuItems
      };
      
      return {
        ...prev,
        menus: updatedMenus
      };
    });
  };

  // Atualizar termo de pesquisa e mostrar sugestões
  const handleSearchChange = (menuIndex: number, itemIndex: number, value: string) => {
    updateMenuItem(menuIndex, itemIndex, 'url', value);
    setSearchTerm(value);
    setShowSuggestions(true);
    setActiveMenuItemIndex(itemIndex);
  };

  // Selecionar sugestão
  const handleSelectSuggestion = (menuIndex: number, itemIndex: number, url: string, name?: string) => {
    updateMenuItem(menuIndex, itemIndex, 'url', url);
    
    // Se o nome do item estiver vazio ou for "Novo Item", atualize-o com o nome da sugestão
    const currentName = settings.menus[menuIndex].items[itemIndex].name;
    if (name && (currentName === 'Novo Item' || currentName === '')) {
      updateMenuItem(menuIndex, itemIndex, 'name', name);
    }
    
    setShowSuggestions(false);
  };

  // Renderizar o componente
  return (
    <div>
      <CardHeader>
        <CardTitle>Configurações de Menus</CardTitle>
        <CardDescription>
          Configure os menus do seu blog. Você pode criar múltiplos menus e definir onde cada um será exibido.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Seleção de menu ativo */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {settings.menus.map((menu, index) => (
                  <Button
                    key={index}
                    variant={activeMenuIndex === index ? "default" : "outline"}
                    onClick={() => setActiveMenuIndex(index)}
                    className="mr-2"
                  >
                    {menu.name}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={addMenu}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Menu
                </Button>
                
                {settings.menus.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => removeMenu(activeMenuIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Menu
                  </Button>
                )}
              </div>
            </div>
            
            {/* Editor do menu ativo */}
            {settings.menus.length > 0 && (
              <MenuEditor
                menuName={settings.menus[activeMenuIndex].name}
                menuLocation={settings.menus[activeMenuIndex].location}
                menuItems={settings.menus[activeMenuIndex].items}
                onMenuNameChange={(name) => updateMenuName(activeMenuIndex, name)}
                onMenuLocationChange={(location) => updateMenuLocation(activeMenuIndex, location)}
                onAddMenuItem={() => addMenuItem(activeMenuIndex)}
                onRemoveMenuItem={(itemIndex) => removeMenuItem(activeMenuIndex, itemIndex)}
                onUpdateMenuItem={(itemIndex, field, value) => updateMenuItem(activeMenuIndex, itemIndex, field, value)}
                onMoveItemUp={(itemIndex) => moveItemUp(activeMenuIndex, itemIndex)}
                onMoveItemDown={(itemIndex) => moveItemDown(activeMenuIndex, itemIndex)}
                onSelectSuggestion={(itemIndex, url, name) => handleSelectSuggestion(activeMenuIndex, itemIndex, url, name)}
                postSuggestions={postSuggestions}
                categorySuggestions={categorySuggestions}
                searchTerm={searchTerm}
                onSearchChange={(itemIndex, value) => handleSearchChange(activeMenuIndex, itemIndex, value)}
                showSuggestions={showSuggestions}
                activeMenuItemIndex={activeMenuItemIndex}
                setActiveMenuItemIndex={setActiveMenuItemIndex}
                menuLocations={menuLocations}
              />
            )}
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={saveSettings}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </div>
  );
}
