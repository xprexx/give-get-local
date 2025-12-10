import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ItemRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  is_custom_category: boolean;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'active' | 'fulfilled' | 'cancelled';
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderation_note?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: {
    name: string;
    email: string;
  };
}

export const useItemRequests = () => {
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Fetching item requests for user:', user?.id);
    
    const { data, error } = await supabase
      .from('item_requests')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Item requests fetched:', { data, error });

    if (!error && data) {
      // Fetch related profiles
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = userIds.length > 0
        ? await supabase.from('profiles').select('id, name, email').in('id', userIds)
        : { data: [] };
      
      const profilesMap = new Map((profiles || []).map(p => [p.id, p]));
      
      const enrichedRequests = data.map(req => ({
        ...req,
        profiles: profilesMap.get(req.user_id)
      }));
      
      console.log('Enriched item requests:', enrichedRequests);
      setRequests(enrichedRequests as unknown as ItemRequest[]);
    } else if (error) {
      console.error('Failed to fetch item requests:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const createRequest = async (request: Omit<ItemRequest, 'id' | 'user_id' | 'status' | 'moderation_status' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    // Check if user is a beneficiary (required by RLS policy)
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    
    console.log('User role for item request:', roleData);
    
    if (roleData?.role !== 'beneficiary' && roleData?.role !== 'admin') {
      return { error: { message: 'Only beneficiaries can create item requests. Please update your account type.' } };
    }

    // Fetch categories to check if custom
    const { data: categories } = await supabase
      .from('categories')
      .select('name');

    const isApprovedCategory = categories?.some(c => c.name === request.category) ?? false;

    const { error } = await supabase
      .from('item_requests')
      .insert({
        ...request,
        user_id: user.id,
        is_custom_category: !isApprovedCategory,
        status: 'active',
        moderation_status: isApprovedCategory ? 'approved' : 'pending',
      });
    
    console.log('Item request insert result:', { error });
    
    if (!error) await fetchRequests();
    return { error };
  };

  const updateRequest = async (id: string, updates: Partial<ItemRequest>) => {
    const { error } = await supabase
      .from('item_requests')
      .update(updates)
      .eq('id', id);
    
    if (!error) await fetchRequests();
    return { error };
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from('item_requests')
      .delete()
      .eq('id', id);
    
    if (!error) await fetchRequests();
    return { error };
  };

  const approveRequest = async (id: string) => {
    return updateRequest(id, { moderation_status: 'approved', moderation_note: undefined });
  };

  const rejectRequest = async (id: string, note: string) => {
    return updateRequest(id, { moderation_status: 'rejected', moderation_note: note });
  };

  return {
    requests,
    loading,
    createRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    rejectRequest,
    refresh: fetchRequests,
  };
};
