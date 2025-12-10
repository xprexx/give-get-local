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
    id: string;
    title: string;
    user_id: string;
    images: string[] | null;
    pickup_location: string;
  };
}

export const usePickupRequests = () => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch pickup requests with related data
    const { data, error } = await supabase
      .from('pickup_requests')
      .select(`
        *,
        profiles:requester_id(name, email),
        donation_listings:listing_id(id, title, user_id, images, pickup_location)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data as unknown as PickupRequest[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const createRequest = async (request: Omit<PickupRequest, 'id' | 'requester_id' | 'status' | 'created_at' | 'updated_at' | 'profiles' | 'donation_listings'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('pickup_requests')
      .insert({
        listing_id: request.listing_id,
        preferred_date: request.preferred_date,
        preferred_time: request.preferred_time,
        alternative_date: request.alternative_date || null,
        alternative_time: request.alternative_time || null,
        message: request.message || null,
        requester_id: user.id,
        status: 'pending',
      });
    
    if (!error) await fetchRequests();
    return { error };
  };

  const updateRequest = async (id: string, updates: Partial<Pick<PickupRequest, 'status' | 'response_message'>>) => {
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
