import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'user' | 'beneficiary' | 'organization' | 'admin';

export type UserStatus = 'active' | 'pending' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  verificationDocument?: string; // base64 stored document
  verificationDocumentName?: string;
  // Beneficiary-specific fields
  nric?: string;
  address?: string;
  birthdate?: string;
  declarationAgreed?: boolean;
  createdAt: string;
  isBanned: boolean;
}

export interface SubcategoryPreference {
  category: string;
  acceptedSubcategories: string[];
  rejectedSubcategories: string[];
}

export interface Organization {
  id: string;
  userId: string;
  name: string;
  description: string;
  acceptedCategories: string[];
  rejectedCategories: string[];
  subcategoryPreferences: SubcategoryPreference[];
  proposedCategories: string[];
  status: 'pending' | 'approved' | 'rejected';
  verificationDocument?: string;
  verificationDocumentName?: string;
  createdAt: string;
}

export interface CategoryProposal {
  id: string;
  organizationId: string;
  organizationName: string;
  categoryName: string;
  subcategory?: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ItemRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  isCustomCategory: boolean;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'active' | 'fulfilled' | 'cancelled';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  organizations: Organization[];
  categoryProposals: CategoryProposal[];
  itemRequests: ItemRequest[];
  categories: { name: string; subcategories: string[] }[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole, verificationDocument?: string, verificationDocumentName?: string, beneficiaryDetails?: { nric: string; address: string; birthdate: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (userId: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  updateOrganization: (org: Partial<Organization>) => void;
  submitCategoryProposal: (proposal: Omit<CategoryProposal, 'id' | 'status' | 'createdAt'>) => void;
  reviewCategoryProposal: (proposalId: string, status: 'approved' | 'rejected') => void;
  approveOrganization: (orgId: string) => void;
  rejectOrganization: (orgId: string) => void;
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  addSubcategory: (categoryName: string, subcategory: string) => void;
  updateSubcategory: (categoryName: string, oldSubcategory: string, newSubcategory: string) => void;
  deleteSubcategory: (categoryName: string, subcategory: string) => void;
  submitItemRequest: (request: Omit<ItemRequest, 'id' | 'userId' | 'status' | 'moderationStatus' | 'createdAt'>) => void;
  updateItemRequest: (requestId: string, updates: Partial<ItemRequest>) => void;
  deleteItemRequest: (requestId: string) => void;
  approveItemRequest: (requestId: string) => void;
  rejectItemRequest: (requestId: string, note: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_CATEGORIES = [
  { name: 'Clothing', subcategories: ['Men', 'Women', 'Children', 'Accessories'] },
  { name: 'Electronics', subcategories: ['Phones', 'Computers', 'Appliances', 'Audio'] },
  { name: 'Furniture', subcategories: ['Living Room', 'Bedroom', 'Office', 'Outdoor'] },
  { name: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Educational', 'Children'] },
  { name: 'Toys', subcategories: ['Board Games', 'Outdoor', 'Educational', 'Stuffed Animals'] },
  { name: 'Kitchen', subcategories: ['Cookware', 'Utensils', 'Appliances', 'Storage'] },
  { name: 'Sports', subcategories: ['Equipment', 'Clothing', 'Accessories'] },
  { name: 'Baby Items', subcategories: ['Clothing', 'Gear', 'Toys', 'Feeding'] },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [categoryProposals, setCategoryProposals] = useState<CategoryProposal[]>([]);
  const [itemRequests, setItemRequests] = useState<ItemRequest[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const storedUser = localStorage.getItem('givelocal_user');
    const storedUsers = localStorage.getItem('givelocal_users');
    const storedOrgs = localStorage.getItem('givelocal_organizations');
    const storedProposals = localStorage.getItem('givelocal_proposals');
    const storedCategories = localStorage.getItem('givelocal_categories');
    const storedItemRequests = localStorage.getItem('givelocal_item_requests');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedOrgs) setOrganizations(JSON.parse(storedOrgs));
    if (storedProposals) setCategoryProposals(JSON.parse(storedProposals));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedItemRequests) setItemRequests(JSON.parse(storedItemRequests));

    // Create default admin if none exists
    if (!storedUsers || JSON.parse(storedUsers).length === 0) {
      const defaultAdmin: User = {
        id: 'admin-1',
        email: 'admin@givelocal.sg',
        name: 'Admin',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        isBanned: false,
      };
      setUsers([defaultAdmin]);
      localStorage.setItem('givelocal_users', JSON.stringify([defaultAdmin]));
      localStorage.setItem('givelocal_passwords', JSON.stringify({ 'admin@givelocal.sg': 'admin123' }));
    }
  }, []);

  const saveToStorage = (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const passwords = JSON.parse(localStorage.getItem('givelocal_passwords') || '{}');
    const foundUser = users.find(u => u.email === email);

    if (!foundUser) {
      return { success: false, error: 'User not found' };
    }

    if (foundUser.isBanned) {
      return { success: false, error: 'Account has been banned' };
    }

    if (passwords[email] !== password) {
      return { success: false, error: 'Invalid password' };
    }

    // Check if user requires approval
    if (foundUser.role === 'beneficiary' && foundUser.status === 'pending') {
      return { success: false, error: 'Your account is pending verification. Please wait for admin approval.' };
    }

    if (foundUser.role === 'beneficiary' && foundUser.status === 'rejected') {
      return { success: false, error: 'Your verification was rejected. Please contact support.' };
    }

    if (foundUser.role === 'organization') {
      const org = organizations.find(o => o.userId === foundUser.id);
      if (org?.status === 'pending') {
        return { success: false, error: 'Your organization is pending verification. Please wait for admin approval.' };
      }
      if (org?.status === 'rejected') {
        return { success: false, error: 'Your organization verification was rejected. Please contact support.' };
      }
    }

    setUser(foundUser);
    saveToStorage('givelocal_user', foundUser);
    return { success: true };
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    verificationDocument?: string,
    verificationDocumentName?: string,
    beneficiaryDetails?: { nric: string; address: string; birthdate: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Determine initial status based on role
    const requiresApproval = role === 'beneficiary' || role === 'organization';
    const initialStatus: UserStatus = requiresApproval ? 'pending' : 'active';

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      status: initialStatus,
      verificationDocument: role === 'beneficiary' ? verificationDocument : undefined,
      verificationDocumentName: role === 'beneficiary' ? verificationDocumentName : undefined,
      // Beneficiary-specific fields
      nric: role === 'beneficiary' ? beneficiaryDetails?.nric : undefined,
      address: role === 'beneficiary' ? beneficiaryDetails?.address : undefined,
      birthdate: role === 'beneficiary' ? beneficiaryDetails?.birthdate : undefined,
      declarationAgreed: role === 'beneficiary' ? true : undefined,
      createdAt: new Date().toISOString(),
      isBanned: false,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage('givelocal_users', updatedUsers);

    const passwords = JSON.parse(localStorage.getItem('givelocal_passwords') || '{}');
    passwords[email] = password;
    saveToStorage('givelocal_passwords', passwords);

    if (role === 'organization') {
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        userId: newUser.id,
        name: name,
        description: '',
        acceptedCategories: [],
        rejectedCategories: [],
        subcategoryPreferences: [],
        proposedCategories: [],
        status: 'pending',
        verificationDocument,
        verificationDocumentName,
        createdAt: new Date().toISOString(),
      };
      const updatedOrgs = [...organizations, newOrg];
      setOrganizations(updatedOrgs);
      saveToStorage('givelocal_organizations', updatedOrgs);
    }

    // Don't auto-login users that require approval
    if (!requiresApproval) {
      setUser(newUser);
      saveToStorage('givelocal_user', newUser);
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('givelocal_user');
  };

  const resetPassword = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const passwords = JSON.parse(localStorage.getItem('givelocal_passwords') || '{}');
      passwords[targetUser.email] = 'reset123';
      saveToStorage('givelocal_passwords', passwords);
    }
  };

  const banUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBanned: true } : u
    );
    setUsers(updatedUsers);
    saveToStorage('givelocal_users', updatedUsers);
  };

  const unbanUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBanned: false } : u
    );
    setUsers(updatedUsers);
    saveToStorage('givelocal_users', updatedUsers);
  };

  const approveUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: 'active' as UserStatus } : u
    );
    setUsers(updatedUsers);
    saveToStorage('givelocal_users', updatedUsers);
  };

  const rejectUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: 'rejected' as UserStatus } : u
    );
    setUsers(updatedUsers);
    saveToStorage('givelocal_users', updatedUsers);
  };

  const updateOrganization = (orgUpdate: Partial<Organization>) => {
    const updatedOrgs = organizations.map(org =>
      org.userId === user?.id ? { ...org, ...orgUpdate } : org
    );
    setOrganizations(updatedOrgs);
    saveToStorage('givelocal_organizations', updatedOrgs);
  };

  const submitCategoryProposal = (proposal: Omit<CategoryProposal, 'id' | 'status' | 'createdAt'>) => {
    const newProposal: CategoryProposal = {
      ...proposal,
      id: `proposal-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updatedProposals = [...categoryProposals, newProposal];
    setCategoryProposals(updatedProposals);
    saveToStorage('givelocal_proposals', updatedProposals);
  };

  const reviewCategoryProposal = (proposalId: string, status: 'approved' | 'rejected') => {
    const proposal = categoryProposals.find(p => p.id === proposalId);
    
    if (status === 'approved' && proposal) {
      const existingCategory = categories.find(c => c.name === proposal.categoryName);
      if (existingCategory && proposal.subcategory) {
        const updatedCategories = categories.map(c =>
          c.name === proposal.categoryName
            ? { ...c, subcategories: [...c.subcategories, proposal.subcategory!] }
            : c
        );
        setCategories(updatedCategories);
        saveToStorage('givelocal_categories', updatedCategories);
      } else if (!existingCategory) {
        const newCategory = {
          name: proposal.categoryName,
          subcategories: proposal.subcategory ? [proposal.subcategory] : [],
        };
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        saveToStorage('givelocal_categories', updatedCategories);
      }
    }

    const updatedProposals = categoryProposals.map(p =>
      p.id === proposalId ? { ...p, status } : p
    );
    setCategoryProposals(updatedProposals);
    saveToStorage('givelocal_proposals', updatedProposals);
  };

  const approveOrganization = (orgId: string) => {
    const updatedOrgs = organizations.map(org =>
      org.id === orgId ? { ...org, status: 'approved' as const } : org
    );
    setOrganizations(updatedOrgs);
    saveToStorage('givelocal_organizations', updatedOrgs);

    // Also update user status
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      const updatedUsers = users.map(u =>
        u.id === org.userId ? { ...u, status: 'active' as UserStatus } : u
      );
      setUsers(updatedUsers);
      saveToStorage('givelocal_users', updatedUsers);
    }
  };

  const rejectOrganization = (orgId: string) => {
    const updatedOrgs = organizations.map(org =>
      org.id === orgId ? { ...org, status: 'rejected' as const } : org
    );
    setOrganizations(updatedOrgs);
    saveToStorage('givelocal_organizations', updatedOrgs);

    // Also update user status
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      const updatedUsers = users.map(u =>
        u.id === org.userId ? { ...u, status: 'rejected' as UserStatus } : u
      );
      setUsers(updatedUsers);
      saveToStorage('givelocal_users', updatedUsers);
    }
  };

  const addCategory = (name: string) => {
    if (categories.find(c => c.name === name)) return;
    const updatedCategories = [...categories, { name, subcategories: [] }];
    setCategories(updatedCategories);
    saveToStorage('givelocal_categories', updatedCategories);
  };

  const updateCategory = (oldName: string, newName: string) => {
    const updatedCategories = categories.map(c =>
      c.name === oldName ? { ...c, name: newName } : c
    );
    setCategories(updatedCategories);
    saveToStorage('givelocal_categories', updatedCategories);
  };

  const deleteCategory = (name: string) => {
    const updatedCategories = categories.filter(c => c.name !== name);
    setCategories(updatedCategories);
    saveToStorage('givelocal_categories', updatedCategories);
  };

  const addSubcategory = (categoryName: string, subcategory: string) => {
    const updatedCategories = categories.map(c =>
      c.name === categoryName && !c.subcategories.includes(subcategory)
        ? { ...c, subcategories: [...c.subcategories, subcategory] }
        : c
    );
    setCategories(updatedCategories);
    saveToStorage('givelocal_categories', updatedCategories);
  };

  const updateSubcategory = (categoryName: string, oldSubcategory: string, newSubcategory: string) => {
    const updatedCategories = categories.map(c =>
      c.name === categoryName
        ? { ...c, subcategories: c.subcategories.map(s => s === oldSubcategory ? newSubcategory : s) }
        : c
    );
    setCategories(updatedCategories);
    saveToStorage('givelocal_categories', updatedCategories);
  };

  const deleteSubcategory = (categoryName: string, subcategory: string) => {
    const updatedCategories = categories.map(c =>
      c.name === categoryName
        ? { ...c, subcategories: c.subcategories.filter(s => s !== subcategory) }
        : c
    );
    setCategories(updatedCategories);
    saveToStorage('givelocal_categories', updatedCategories);
  };

  const submitItemRequest = (request: Omit<ItemRequest, 'id' | 'userId' | 'status' | 'moderationStatus' | 'createdAt'>) => {
    if (!user) return;
    
    // Check if category is from approved list
    const isApprovedCategory = categories.some(cat => cat.name === request.category);
    
    const newRequest: ItemRequest = {
      ...request,
      id: `request-${Date.now()}`,
      userId: user.id,
      isCustomCategory: !isApprovedCategory,
      status: 'active',
      // Auto-approve if it's an approved category, otherwise require moderation
      moderationStatus: isApprovedCategory ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
    };
    const updatedRequests = [...itemRequests, newRequest];
    setItemRequests(updatedRequests);
    saveToStorage('givelocal_item_requests', updatedRequests);
  };

  const updateItemRequest = (requestId: string, updates: Partial<ItemRequest>) => {
    const updatedRequests = itemRequests.map(req =>
      req.id === requestId ? { ...req, ...updates } : req
    );
    setItemRequests(updatedRequests);
    saveToStorage('givelocal_item_requests', updatedRequests);
  };

  const deleteItemRequest = (requestId: string) => {
    const updatedRequests = itemRequests.filter(req => req.id !== requestId);
    setItemRequests(updatedRequests);
    saveToStorage('givelocal_item_requests', updatedRequests);
  };

  const approveItemRequest = (requestId: string) => {
    const updatedRequests = itemRequests.map(req =>
      req.id === requestId ? { ...req, moderationStatus: 'approved' as const, moderationNote: undefined } : req
    );
    setItemRequests(updatedRequests);
    saveToStorage('givelocal_item_requests', updatedRequests);
  };

  const rejectItemRequest = (requestId: string, note: string) => {
    const updatedRequests = itemRequests.map(req =>
      req.id === requestId ? { ...req, moderationStatus: 'rejected' as const, moderationNote: note } : req
    );
    setItemRequests(updatedRequests);
    saveToStorage('givelocal_item_requests', updatedRequests);
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      organizations,
      categoryProposals,
      itemRequests,
      categories,
      login,
      signup,
      logout,
      resetPassword,
      banUser,
      unbanUser,
      approveUser,
      rejectUser,
      updateOrganization,
      submitCategoryProposal,
      reviewCategoryProposal,
      approveOrganization,
      rejectOrganization,
      addCategory,
      updateCategory,
      deleteCategory,
      addSubcategory,
      updateSubcategory,
      deleteSubcategory,
      submitItemRequest,
      updateItemRequest,
      deleteItemRequest,
      approveItemRequest,
      rejectItemRequest,
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