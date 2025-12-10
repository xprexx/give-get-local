import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CrowdfundingCampaign {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  supporters: number;
  status: 'active' | 'completed' | 'cancelled';
  image_url?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  organizations?: {
    name: string;
    user_id: string;
  };
}

export interface CrowdfundingDonation {
  id: string;
  campaign_id: string;
  user_id?: string;
  amount: number;
  donor_name?: string;
  message?: string;
  is_anonymous: boolean;
  created_at: string;
}

export const useCrowdfunding = () => {
  const [campaigns, setCampaigns] = useState<CrowdfundingCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from('crowdfunding_campaigns')
      .select(`
        *,
        organizations (name, user_id)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCampaigns(data as CrowdfundingCampaign[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const createCampaign = async (campaign: Omit<CrowdfundingCampaign, 'id' | 'organization_id' | 'current_amount' | 'supporters' | 'status' | 'created_at' | 'updated_at'>, organizationId: string) => {
    const { error } = await supabase
      .from('crowdfunding_campaigns')
      .insert({
        ...campaign,
        organization_id: organizationId,
        current_amount: 0,
        supporters: 0,
        status: 'active',
      });
    
    if (!error) await fetchCampaigns();
    return { error };
  };

  const updateCampaign = async (id: string, updates: Partial<CrowdfundingCampaign>) => {
    const { error } = await supabase
      .from('crowdfunding_campaigns')
      .update(updates)
      .eq('id', id);
    
    if (!error) await fetchCampaigns();
    return { error };
  };

  const deleteCampaign = async (id: string) => {
    const { error } = await supabase
      .from('crowdfunding_campaigns')
      .delete()
      .eq('id', id);
    
    if (!error) await fetchCampaigns();
    return { error };
  };

  const makeDonation = async (campaignId: string, amount: number, donorName?: string, message?: string, isAnonymous: boolean = false) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('crowdfunding_donations')
      .insert({
        campaign_id: campaignId,
        user_id: user?.id,
        amount,
        donor_name: donorName,
        message,
        is_anonymous: isAnonymous,
      });
    
    if (!error) await fetchCampaigns();
    return { error };
  };

  const fetchDonations = async (campaignId: string) => {
    const { data, error } = await supabase
      .from('crowdfunding_donations')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    return { data: data as CrowdfundingDonation[] | null, error };
  };

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    makeDonation,
    fetchDonations,
    refresh: fetchCampaigns,
  };
};
