import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'pending' | 'rejected';
  verification_document?: string;
  verification_document_name?: string;
  nric?: string;
  address?: string;
  birthdate?: string;
  declaration_agreed?: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
  // Joined role
  user_roles?: {
    role: 'user' | 'beneficiary' | 'organization' | 'admin';
  }[];
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProfiles(data as unknown as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updateProfile = async (id: string, updates: Partial<Profile>) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    
    if (!error) await fetchProfiles();
    return { error };
  };

  const approveUser = async (id: string) => {
    return updateProfile(id, { status: 'active' });
  };

  const rejectUser = async (id: string) => {
    return updateProfile(id, { status: 'rejected' });
  };

  const banUser = async (id: string) => {
    return updateProfile(id, { is_banned: true });
  };

  const unbanUser = async (id: string) => {
    return updateProfile(id, { is_banned: false });
  };

  // Get role helper
  const getUserRole = (profile: Profile) => {
    return profile.user_roles?.[0]?.role || 'user';
  };

  return {
    profiles,
    loading,
    updateProfile,
    approveUser,
    rejectUser,
    banUser,
    unbanUser,
    getUserRole,
    refresh: fetchProfiles,
  };
};
