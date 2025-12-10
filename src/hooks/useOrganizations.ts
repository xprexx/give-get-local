import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Organization {
  id: string;
  user_id: string;
  name: string;
  description: string;
  accepted_categories: string[];
  rejected_categories: string[];
  status: 'pending' | 'approved' | 'rejected';
  verification_document?: string;
  verification_document_name?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: {
    name: string;
    email: string;
  };
  subcategory_preferences?: SubcategoryPreference[];
}

export interface SubcategoryPreference {
  id: string;
  organization_id: string;
  category: string;
  accepted_subcategories: string[];
  rejected_subcategories: string[];
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrganizations(data as unknown as Organization[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const updateOrganization = async (id: string, updates: Partial<Organization>) => {
    const { error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id);
    
    if (!error) await fetchOrganizations();
    return { error };
  };

  const approveOrganization = async (id: string) => {
    // Update organization status
    const { error: orgError } = await supabase
      .from('organizations')
      .update({ status: 'approved' })
      .eq('id', id);

    if (orgError) return { error: orgError };

    // Get org user_id and update profile status
    const org = organizations.find(o => o.id === id);
    if (org) {
      await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', org.user_id);
    }

    await fetchOrganizations();
    return { error: null };
  };

  const rejectOrganization = async (id: string) => {
    const { error: orgError } = await supabase
      .from('organizations')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (orgError) return { error: orgError };

    const org = organizations.find(o => o.id === id);
    if (org) {
      await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', org.user_id);
    }

    await fetchOrganizations();
    return { error: null };
  };

  const updateSubcategoryPreferences = async (
    organizationId: string, 
    category: string, 
    acceptedSubcategories: string[], 
    rejectedSubcategories: string[]
  ) => {
    // Check if preference exists
    const { data: existing } = await supabase
      .from('subcategory_preferences')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('category', category)
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from('subcategory_preferences')
        .update({
          accepted_subcategories: acceptedSubcategories,
          rejected_subcategories: rejectedSubcategories,
        })
        .eq('id', existing.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('subcategory_preferences')
        .insert({
          organization_id: organizationId,
          category,
          accepted_subcategories: acceptedSubcategories,
          rejected_subcategories: rejectedSubcategories,
        });
      error = result.error;
    }

    if (!error) await fetchOrganizations();
    return { error };
  };

  return {
    organizations,
    loading,
    updateOrganization,
    approveOrganization,
    rejectOrganization,
    updateSubcategoryPreferences,
    refresh: fetchOrganizations,
  };
};
