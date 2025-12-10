import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'user' | 'beneficiary' | 'organization' | 'admin';
  created_at: string;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile/role fetch
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleData) {
        setUserRole(roleData as UserRole);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: 'user' | 'beneficiary' | 'organization',
    options?: {
      verificationDocument?: string;
      verificationDocumentName?: string;
      nric?: string;
      address?: string;
      birthdate?: string;
    }
  ) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
          role,
        }
      }
    });

    if (error) return { success: false, error: error.message };

    // If beneficiary, update profile with additional info
    if (role === 'beneficiary' && data.user) {
      await supabase
        .from('profiles')
        .update({
          verification_document: options?.verificationDocument,
          verification_document_name: options?.verificationDocumentName,
          nric: options?.nric,
          address: options?.address,
          birthdate: options?.birthdate,
          declaration_agreed: true,
        })
        .eq('id', data.user.id);
    }

    // If organization, create org record
    if (role === 'organization' && data.user) {
      await supabase
        .from('organizations')
        .insert({
          user_id: data.user.id,
          name,
          verification_document: options?.verificationDocument,
          verification_document_name: options?.verificationDocumentName,
        });
    }

    return { success: true };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error: error.message };

    // Check if user is banned or pending
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_banned, status')
        .eq('id', data.user.id)
        .single();

      if (profileData?.is_banned) {
        await supabase.auth.signOut();
        return { success: false, error: 'Account has been banned' };
      }

      if (profileData?.status === 'pending') {
        await supabase.auth.signOut();
        return { success: false, error: 'Your account is pending verification. Please wait for admin approval.' };
      }

      if (profileData?.status === 'rejected') {
        await supabase.auth.signOut();
        return { success: false, error: 'Your verification was rejected. Please contact support.' };
      }
    }

    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
  };

  return {
    user,
    session,
    profile,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUserData: () => user && fetchUserData(user.id),
  };
};
