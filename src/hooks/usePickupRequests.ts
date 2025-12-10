import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PickupRequest {
  id: string;
  listing_id: string;
  requester_id: string;
  preferred_date: string;
  preferred_time: string;
  alternative_date?: string;
  alternative_time?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  response_message?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: {
    name: string;
    email: string;
  };
  donation_listings?: {
    title: string;
    user_id: string;
  };
}

export const usePickupRequests = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data as unknown as PickupRequest[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const createRequest = async (request: Omit<PickupRequest, 'id' | 'requester_id' | 'status' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('pickup_requests')
      .insert({
        ...request,
        requester_id: user.id,
        status: 'pending',
      });
    
    if (!error) await fetchRequests();
    return { error };
  };

  const updateRequest = async (id: string, updates: Partial<PickupRequest>) => {
    const { error } = await supabase
      .from('pickup_requests')
      .update(updates)
      .eq('id', id);
    
    if (!error) await fetchRequests();
    return { error };
  };

  const acceptRequest = async (id: string, responseMessage?: string) => {
    return updateRequest(id, { status: 'accepted', response_message: responseMessage });
  };

  const rejectRequest = async (id: string, responseMessage?: string) => {
    return updateRequest(id, { status: 'rejected', response_message: responseMessage });
  };

  const completeRequest = async (id: string) => {
    return updateRequest(id, { status: 'completed' });
  };

  return {
    requests,
    loading,
    createRequest,
    updateRequest,
    acceptRequest,
    rejectRequest,
    completeRequest,
    refresh: fetchRequests,
  };
};
