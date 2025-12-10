import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'user' | 'beneficiary' | 'organization' | 'admin';
export type UserStatus = 'active' | 'pending' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  verification_document?: string;
  verification_document_name?: string;
  nric?: string;
  address?: string;
  birthdate?: string;
  declaration_agreed?: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
  role?: UserRole; // Added for compatibility
}

export interface Organization {
  id: string;
  user_id: string;
  userId?: string;
  name: string;
  description: string;
  accepted_categories: string[];
  acceptedCategories?: string[];
  rejected_categories: string[];
  rejectedCategories?: string[];
  subcategoryPreferences?: SubcategoryPreference[];
  status: 'pending' | 'approved' | 'rejected';
  verification_document?: string;
  verificationDocument?: string;
  verification_document_name?: string;
  verificationDocumentName?: string;
  created_at: string;
  createdAt?: string;
  updated_at: string;
}

export interface SubcategoryPreference {
  category: string;
  acceptedSubcategories: string[];
  rejectedSubcategories: string[];
}

export interface Category {
  id?: string;
  name: string;
  subcategories: string[];
}

export interface CategoryProposal {
  id: string;
  organization_id: string;
  organizationId?: string;
  organizationName?: string;
  category_name: string;
  categoryName?: string;
  subcategory?: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  createdAt?: string;
}

export interface ItemRequest {
  id: string;
  user_id: string;
  userId?: string;
  title: string;
  description: string;
  category: string;
  is_custom_category: boolean;
  isCustomCategory?: boolean;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'active' | 'fulfilled' | 'cancelled';
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderationStatus?: 'pending' | 'approved' | 'rejected';
  moderation_note?: string;
  moderationNote?: string;
  created_at: string;
  createdAt?: string;
}

export interface DonationListing {
  id: string;
  user_id: string;
  userId?: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  subcategory?: string;
  condition: string;
  pickup_location: string;
  pickupLocation?: string;
  status: 'available' | 'claimed' | 'removed';
  created_at: string;
  createdAt?: string;
}

// Extended user type for compatibility
export interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  isBanned: boolean;
  verificationDocument?: string;
  verificationDocumentName?: string;
  nric?: string;
  address?: string;
  birthdate?: string;
  declarationAgreed?: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  organization: Organization | null;
  organizations: Organization[];
  users: ExtendedUser[];
  categories: Category[];
  categoryProposals: CategoryProposal[];
  itemRequests: ItemRequest[];
  donationListings: DonationListing[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    verificationDocument?: string,
    verificationDocumentName?: string,
    beneficiaryDetails?: { nric: string; address: string; birthdate: string }
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Admin functions
  resetPassword: (userId: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  approveOrganization: (orgId: string) => Promise<void>;
  rejectOrganization: (orgId: string) => Promise<void>;
  // Organization functions
  updateOrganization: (updates: Partial<Organization>) => Promise<void>;
  submitCategoryProposal: (proposal: Omit<CategoryProposal, 'id' | 'status' | 'created_at'>) => Promise<void>;
  reviewCategoryProposal: (proposalId: string, status: 'approved' | 'rejected') => Promise<void>;
  // Category functions
  addCategory: (name: string) => Promise<void>;
  updateCategory: (oldName: string, newName: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
  addSubcategory: (categoryName: string, subcategory: string) => Promise<void>;
  updateSubcategory: (categoryName: string, oldSubcategory: string, newSubcategory: string) => Promise<void>;
  deleteSubcategory: (categoryName: string, subcategory: string) => Promise<void>;
  // Item request functions
  submitItemRequest: (request: Partial<ItemRequest> & { title: string; description: string; category: string; location: string; urgency: 'low' | 'medium' | 'high' }) => Promise<void>;
  updateItemRequest: (requestId: string, updates: Partial<ItemRequest>) => Promise<void>;
  deleteItemRequest: (requestId: string) => Promise<void>;
  approveItemRequest: (requestId: string) => Promise<void>;
  rejectItemRequest: (requestId: string, note: string) => Promise<void>;
  // Donation listing functions
  createDonationListing: (listing: Partial<DonationListing> & { title: string; description: string; category: string; condition: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProposals, setCategoryProposals] = useState<CategoryProposal[]>([]);
  const [itemRequests, setItemRequests] = useState<ItemRequest[]>([]);
  const [donationListings, setDonationListings] = useState<DonationListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived user object for compatibility
  const user: ExtendedUser | null = profile && userRole ? {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: userRole,
    status: profile.status,
    isBanned: profile.is_banned,
    verificationDocument: profile.verification_document,
    verificationDocumentName: profile.verification_document_name,
    nric: profile.nric,
    address: profile.address,
    birthdate: profile.birthdate,
    declarationAgreed: profile.declaration_agreed,
    createdAt: profile.created_at,
  } : null;

  // Fetch all data functions
  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) {
      setCategories(data.map(c => ({ id: c.id, name: c.name, subcategories: c.subcategories || [] })));
    }
  }, []);

  const fetchOrganizations = useCallback(async () => {
    const { data } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
    if (data) {
      setOrganizations(data.map(o => ({
        ...o,
        userId: o.user_id,
        acceptedCategories: o.accepted_categories,
        rejectedCategories: o.rejected_categories,
        createdAt: o.created_at,
        verificationDocument: o.verification_document,
        verificationDocumentName: o.verification_document_name,
      })) as unknown as Organization[]);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: roles } = await supabase.from('user_roles').select('*');
    
    if (profiles && roles) {
      const usersWithRoles = profiles.map(p => {
        const userRoleData = roles.find(r => r.user_id === p.id);
        return {
          id: p.id,
          email: p.email,
          name: p.name,
          role: (userRoleData?.role || 'user') as UserRole,
          status: p.status as UserStatus,
          isBanned: p.is_banned,
          verificationDocument: p.verification_document,
          verificationDocumentName: p.verification_document_name,
          nric: p.nric,
          address: p.address,
          birthdate: p.birthdate,
          declarationAgreed: p.declaration_agreed,
          createdAt: p.created_at,
        };
      });
      setUsers(usersWithRoles);
    }
  }, []);

  const fetchCategoryProposals = useCallback(async () => {
    const { data } = await supabase.from('category_proposals').select('*').order('created_at', { ascending: false });
    if (data) {
      const proposalsWithNames = await Promise.all(data.map(async (p) => {
        const { data: org } = await supabase.from('organizations').select('name').eq('id', p.organization_id).single();
        return {
          ...p,
          organizationId: p.organization_id,
          organizationName: org?.name || 'Unknown',
          categoryName: p.category_name,
          createdAt: p.created_at,
        } as CategoryProposal;
      }));
      setCategoryProposals(proposalsWithNames);
    }
  }, []);

  const fetchItemRequests = useCallback(async () => {
    const { data } = await supabase.from('item_requests').select('*').order('created_at', { ascending: false });
    if (data) {
      setItemRequests(data.map(r => ({
        ...r,
        userId: r.user_id,
        isCustomCategory: r.is_custom_category,
        moderationStatus: r.moderation_status,
        moderationNote: r.moderation_note,
        createdAt: r.created_at,
      })) as unknown as ItemRequest[]);
    }
  }, []);

  const fetchDonationListings = useCallback(async () => {
    const { data } = await supabase.from('donation_listings').select('*').order('created_at', { ascending: false });
    if (data) {
      setDonationListings(data.map(l => ({
        ...l,
        userId: l.user_id,
        pickupLocation: l.pickup_location,
        createdAt: l.created_at,
      })) as unknown as DonationListing[]);
    }
  }, []);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (profileData) {
        setProfile(profileData as unknown as Profile);
      }

      const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
      if (roleData) {
        setUserRole(roleData.role as UserRole);

        if (roleData.role === 'organization') {
          const { data: orgData } = await supabase.from('organizations').select('*').eq('user_id', userId).maybeSingle();
          if (orgData) {
            setOrganization(orgData as unknown as Organization);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (authUser) {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
      if (profileData) {
        setProfile(profileData as unknown as Profile);
      }
    }
  }, [authUser]);

  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchCategories(),
      fetchOrganizations(),
      fetchUsers(),
      fetchCategoryProposals(),
      fetchItemRequests(),
      fetchDonationListings(),
    ]);
  }, [fetchCategories, fetchOrganizations, fetchUsers, fetchCategoryProposals, fetchItemRequests, fetchDonationListings]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(() => {
          fetchUserData(session.user.id);
          fetchAllData();
        }, 0);
      } else {
        setProfile(null);
        setUserRole(null);
        setOrganization(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      fetchAllData();
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData, fetchAllData]);

  // Auth functions
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      if (data.user) {
        const { data: profileData } = await supabase.from('profiles').select('is_banned, status').eq('id', data.user.id).single();
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
    } catch {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (
    email: string, password: string, name: string, role: UserRole,
    verificationDocument?: string, verificationDocumentName?: string,
    beneficiaryDetails?: { nric: string; address: string; birthdate: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/`, data: { name, role } }
      });
      if (error) return { success: false, error: error.message };

      await new Promise(resolve => setTimeout(resolve, 500));

      if (data.user) {
        if (role === 'beneficiary' && beneficiaryDetails) {
          await supabase.from('profiles').update({
            verification_document: verificationDocument,
            verification_document_name: verificationDocumentName,
            nric: beneficiaryDetails.nric,
            address: beneficiaryDetails.address,
            birthdate: beneficiaryDetails.birthdate,
            declaration_agreed: true,
          }).eq('id', data.user.id);
        }

        if (role === 'organization') {
          await supabase.from('organizations').insert({
            user_id: data.user.id, name,
            verification_document: verificationDocument,
            verification_document_name: verificationDocumentName,
          });
        }
      }

      if (role === 'beneficiary' || role === 'organization') {
        await supabase.auth.signOut();
      }

      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
    setOrganization(null);
  };

  const refreshUserData = async () => {
    if (authUser) await fetchUserData(authUser.id);
    await fetchAllData();
  };

  // Admin functions
  const resetPassword = async (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      // Note: In production, use Supabase admin API or edge function
      console.log('Password reset requested for:', targetUser.email);
    }
  };

  const banUser = async (userId: string) => {
    await supabase.from('profiles').update({ is_banned: true }).eq('id', userId);
    await fetchUsers();
  };

  const unbanUser = async (userId: string) => {
    await supabase.from('profiles').update({ is_banned: false }).eq('id', userId);
    await fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    // Note: Deleting from auth.users requires admin API
    await supabase.from('profiles').delete().eq('id', userId);
    await fetchAllData();
  };

  const approveUser = async (userId: string) => {
    await supabase.from('profiles').update({ status: 'active' }).eq('id', userId);
    await fetchUsers();
  };

  const rejectUser = async (userId: string) => {
    await supabase.from('profiles').update({ status: 'rejected' }).eq('id', userId);
    await fetchUsers();
  };

  const approveOrganization = async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    await supabase.from('organizations').update({ status: 'approved' }).eq('id', orgId);
    if (org) {
      await supabase.from('profiles').update({ status: 'active' }).eq('id', org.user_id);
    }
    await fetchAllData();
  };

  const rejectOrganization = async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    await supabase.from('organizations').update({ status: 'rejected' }).eq('id', orgId);
    if (org) {
      await supabase.from('profiles').update({ status: 'rejected' }).eq('id', org.user_id);
    }
    await fetchAllData();
  };

  // Organization functions
  const updateOrganization = async (updates: Partial<Organization>) => {
    if (!organization) return;
    await supabase.from('organizations').update(updates).eq('id', organization.id);
    await fetchOrganizations();
    if (authUser) await fetchUserData(authUser.id);
  };

  const submitCategoryProposal = async (proposal: Omit<CategoryProposal, 'id' | 'status' | 'created_at'>) => {
    await supabase.from('category_proposals').insert({
      organization_id: proposal.organization_id,
      category_name: proposal.category_name || proposal.categoryName,
      subcategory: proposal.subcategory,
      description: proposal.description,
    });
    await fetchCategoryProposals();
  };

  const reviewCategoryProposal = async (proposalId: string, status: 'approved' | 'rejected') => {
    const proposal = categoryProposals.find(p => p.id === proposalId);
    await supabase.from('category_proposals').update({ status }).eq('id', proposalId);

    if (status === 'approved' && proposal) {
      const categoryName = proposal.category_name || proposal.categoryName;
      const existingCategory = categories.find(c => c.name === categoryName);
      
      if (existingCategory && proposal.subcategory) {
        await supabase.from('categories').update({
          subcategories: [...existingCategory.subcategories, proposal.subcategory]
        }).eq('id', existingCategory.id);
      } else if (!existingCategory) {
        await supabase.from('categories').insert({
          name: categoryName,
          subcategories: proposal.subcategory ? [proposal.subcategory] : [],
        });
      }
    }
    await fetchAllData();
  };

  // Category functions
  const addCategory = async (name: string) => {
    await supabase.from('categories').insert({ name, subcategories: [] });
    await fetchCategories();
  };

  const updateCategory = async (oldName: string, newName: string) => {
    const cat = categories.find(c => c.name === oldName);
    if (cat?.id) {
      await supabase.from('categories').update({ name: newName }).eq('id', cat.id);
      await fetchCategories();
    }
  };

  const deleteCategory = async (name: string) => {
    const cat = categories.find(c => c.name === name);
    if (cat?.id) {
      await supabase.from('categories').delete().eq('id', cat.id);
      await fetchCategories();
    }
  };

  const addSubcategory = async (categoryName: string, subcategory: string) => {
    const cat = categories.find(c => c.name === categoryName);
    if (cat?.id) {
      await supabase.from('categories').update({
        subcategories: [...cat.subcategories, subcategory]
      }).eq('id', cat.id);
      await fetchCategories();
    }
  };

  const updateSubcategory = async (categoryName: string, oldSubcategory: string, newSubcategory: string) => {
    const cat = categories.find(c => c.name === categoryName);
    if (cat?.id) {
      await supabase.from('categories').update({
        subcategories: cat.subcategories.map(s => s === oldSubcategory ? newSubcategory : s)
      }).eq('id', cat.id);
      await fetchCategories();
    }
  };

  const deleteSubcategory = async (categoryName: string, subcategory: string) => {
    const cat = categories.find(c => c.name === categoryName);
    if (cat?.id) {
      await supabase.from('categories').update({
        subcategories: cat.subcategories.filter(s => s !== subcategory)
      }).eq('id', cat.id);
      await fetchCategories();
    }
  };

  // Item request functions
  const submitItemRequest = async (request: Partial<ItemRequest> & { title: string; description: string; category: string; location: string; urgency: 'low' | 'medium' | 'high' }) => {
    if (!authUser) return;
    const isApproved = categories.some(c => c.name === request.category);
    await supabase.from('item_requests').insert({
      title: request.title,
      description: request.description,
      category: request.category,
      location: request.location,
      urgency: request.urgency,
      user_id: authUser.id,
      is_custom_category: !isApproved,
      status: 'active',
      moderation_status: isApproved ? 'approved' : 'pending',
    });
    await fetchItemRequests();
  };

  const updateItemRequest = async (requestId: string, updates: Partial<ItemRequest>) => {
    const dbUpdates: Record<string, unknown> = { ...updates };
    if (updates.moderationStatus) dbUpdates.moderation_status = updates.moderationStatus;
    if (updates.moderationNote) dbUpdates.moderation_note = updates.moderationNote;
    await supabase.from('item_requests').update(dbUpdates).eq('id', requestId);
    await fetchItemRequests();
  };

  const deleteItemRequest = async (requestId: string) => {
    await supabase.from('item_requests').delete().eq('id', requestId);
    await fetchItemRequests();
  };

  const approveItemRequest = async (requestId: string) => {
    await supabase.from('item_requests').update({ moderation_status: 'approved', moderation_note: null }).eq('id', requestId);
    await fetchItemRequests();
  };

  const rejectItemRequest = async (requestId: string, note: string) => {
    await supabase.from('item_requests').update({ moderation_status: 'rejected', moderation_note: note }).eq('id', requestId);
    await fetchItemRequests();
  };

  // Donation listing functions
  const createDonationListing = async (listing: Partial<DonationListing> & { title: string; description: string; category: string; condition: string }): Promise<{ success: boolean; error?: string }> => {
    if (!authUser) return { success: false, error: 'Not authenticated' };
    
    // Convert condition format from hyphen to underscore for DB enum
    const conditionMap: Record<string, 'new' | 'like_new' | 'good' | 'fair'> = {
      'new': 'new',
      'like-new': 'like_new',
      'like_new': 'like_new',
      'good': 'good',
      'fair': 'fair',
    };
    
    const insertData = {
      title: listing.title,
      description: listing.description,
      category: listing.category,
      subcategory: listing.subcategory || null,
      condition: conditionMap[listing.condition] || 'good',
      images: listing.images || [],
      pickup_location: listing.pickup_location || listing.pickupLocation || '',
      user_id: authUser.id,
    };
    
    const { error } = await supabase.from('donation_listings').insert(insertData);
    if (error) {
      console.error('Error creating donation listing:', error);
      return { success: false, error: error.message };
    }
    
    await fetchDonationListings();
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user, session, profile, userRole, organization, organizations, users, categories,
      categoryProposals, itemRequests, donationListings, loading,
      login, signup, logout, refreshUserData, refreshProfile,
      resetPassword, banUser, unbanUser, deleteUser, approveUser, rejectUser,
      approveOrganization, rejectOrganization, updateOrganization,
      submitCategoryProposal, reviewCategoryProposal,
      addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory,
      submitItemRequest, updateItemRequest, deleteItemRequest, approveItemRequest, rejectItemRequest,
      createDonationListing,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
