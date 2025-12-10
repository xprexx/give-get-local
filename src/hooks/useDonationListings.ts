import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DonationListing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  subcategory?: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  pickup_location: string;
  status: 'available' | 'claimed' | 'removed';
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: {
    name: string;
    email: string;
  };
}

export const useDonationListings = () => {
  const [listings, setListings] = useState<DonationListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('donation_listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setListings(data as unknown as DonationListing[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const createListing = async (listing: Omit<DonationListing, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('donation_listings')
      .insert({
        ...listing,
        user_id: user.id,
      });
    
    if (!error) await fetchListings();
    return { error };
  };

  const updateListing = async (id: string, updates: Partial<DonationListing>) => {
    const { error } = await supabase
      .from('donation_listings')
      .update(updates)
      .eq('id', id);
    
    if (!error) await fetchListings();
    return { error };
  };

  const deleteListing = async (id: string) => {
    const { error } = await supabase
      .from('donation_listings')
      .delete()
      .eq('id', id);
    
    if (!error) await fetchListings();
    return { error };
  };

  return {
    listings,
    loading,
    createListing,
    updateListing,
    deleteListing,
    refresh: fetchListings,
  };
};
