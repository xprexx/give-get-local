import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryProposal {
  id: string;
  organization_id: string;
  category_name: string;
  subcategory?: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  // Joined data
  organizations?: {
    name: string;
    user_id: string;
  };
}

export const useCategoryProposals = () => {
  const [proposals, setProposals] = useState<CategoryProposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    const { data, error } = await supabase
      .from('category_proposals')
      .select(`
        *,
        organizations (name, user_id)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProposals(data as CategoryProposal[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const createProposal = async (proposal: Omit<CategoryProposal, 'id' | 'status' | 'created_at'>) => {
    const { error } = await supabase
      .from('category_proposals')
      .insert({
        ...proposal,
        status: 'pending',
      });
    
    if (!error) await fetchProposals();
    return { error };
  };

  const approveProposal = async (id: string) => {
    // Get the proposal details
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return { error: { message: 'Proposal not found' } };

    // Update proposal status
    const { error: updateError } = await supabase
      .from('category_proposals')
      .update({ status: 'approved' })
      .eq('id', id);

    if (updateError) return { error: updateError };

    // Add to categories
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('*')
      .eq('name', proposal.category_name)
      .maybeSingle();

    if (existingCategory && proposal.subcategory) {
      // Add subcategory to existing category
      await supabase
        .from('categories')
        .update({
          subcategories: [...(existingCategory.subcategories || []), proposal.subcategory]
        })
        .eq('id', existingCategory.id);
    } else if (!existingCategory) {
      // Create new category
      await supabase
        .from('categories')
        .insert({
          name: proposal.category_name,
          subcategories: proposal.subcategory ? [proposal.subcategory] : [],
        });
    }

    await fetchProposals();
    return { error: null };
  };

  const rejectProposal = async (id: string) => {
    const { error } = await supabase
      .from('category_proposals')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (!error) await fetchProposals();
    return { error };
  };

  return {
    proposals,
    loading,
    createProposal,
    approveProposal,
    rejectProposal,
    refresh: fetchProposals,
  };
};
