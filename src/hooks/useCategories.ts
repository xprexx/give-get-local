import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  created_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (!error && data) {
      setCategories(data as Category[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (name: string) => {
    const { error } = await supabase
      .from('categories')
      .insert({ name, subcategories: [] });
    
    if (!error) await fetchCategories();
    return { error };
  };

  const updateCategory = async (id: string, name: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id);
    
    if (!error) await fetchCategories();
    return { error };
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (!error) await fetchCategories();
    return { error };
  };

  const addSubcategory = async (categoryId: string, subcategory: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return { error: { message: 'Category not found' } };

    const { error } = await supabase
      .from('categories')
      .update({ 
        subcategories: [...category.subcategories, subcategory] 
      })
      .eq('id', categoryId);
    
    if (!error) await fetchCategories();
    return { error };
  };

  const updateSubcategory = async (categoryId: string, oldSubcategory: string, newSubcategory: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return { error: { message: 'Category not found' } };

    const { error } = await supabase
      .from('categories')
      .update({ 
        subcategories: category.subcategories.map(s => s === oldSubcategory ? newSubcategory : s) 
      })
      .eq('id', categoryId);
    
    if (!error) await fetchCategories();
    return { error };
  };

  const deleteSubcategory = async (categoryId: string, subcategory: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return { error: { message: 'Category not found' } };

    const { error } = await supabase
      .from('categories')
      .update({ 
        subcategories: category.subcategories.filter(s => s !== subcategory) 
      })
      .eq('id', categoryId);
    
    if (!error) await fetchCategories();
    return { error };
  };

  // Convert to format expected by existing components
  const categoriesFormatted = categories.map(c => ({
    name: c.name,
    subcategories: c.subcategories || []
  }));

  return {
    categories,
    categoriesFormatted,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    refresh: fetchCategories,
  };
};
