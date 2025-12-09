import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'user' | 'organization' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  isBanned: boolean;
}

export interface Organization {
  id: string;
  userId: string;
  name: string;
  description: string;
  acceptedCategories: string[];
  rejectedCategories: string[];
  proposedCategories: string[];
  status: 'pending' | 'approved' | 'rejected';
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

interface AuthContextType {
  user: User | null;
  users: User[];
  organizations: Organization[];
  categoryProposals: CategoryProposal[];
  categories: { name: string; subcategories: string[] }[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (userId: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  updateOrganization: (org: Partial<Organization>) => void;
  submitCategoryProposal: (proposal: Omit<CategoryProposal, 'id' | 'status' | 'createdAt'>) => void;
  reviewCategoryProposal: (proposalId: string, status: 'approved' | 'rejected') => void;
  approveOrganization: (orgId: string) => void;
  rejectOrganization: (orgId: string) => void;
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
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const storedUser = localStorage.getItem('givelocal_user');
    const storedUsers = localStorage.getItem('givelocal_users');
    const storedOrgs = localStorage.getItem('givelocal_organizations');
    const storedProposals = localStorage.getItem('givelocal_proposals');
    const storedCategories = localStorage.getItem('givelocal_categories');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedOrgs) setOrganizations(JSON.parse(storedOrgs));
    if (storedProposals) setCategoryProposals(JSON.parse(storedProposals));
    if (storedCategories) setCategories(JSON.parse(storedCategories));

    // Create default admin if none exists
    if (!storedUsers || JSON.parse(storedUsers).length === 0) {
      const defaultAdmin: User = {
        id: 'admin-1',
        email: 'admin@givelocal.sg',
        name: 'Admin',
        role: 'admin',
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

    setUser(foundUser);
    saveToStorage('givelocal_user', foundUser);
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
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
        proposedCategories: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      const updatedOrgs = [...organizations, newOrg];
      setOrganizations(updatedOrgs);
      saveToStorage('givelocal_organizations', updatedOrgs);
    }

    setUser(newUser);
    saveToStorage('givelocal_user', newUser);
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
  };

  const rejectOrganization = (orgId: string) => {
    const updatedOrgs = organizations.map(org =>
      org.id === orgId ? { ...org, status: 'rejected' as const } : org
    );
    setOrganizations(updatedOrgs);
    saveToStorage('givelocal_organizations', updatedOrgs);
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      organizations,
      categoryProposals,
      categories,
      login,
      signup,
      logout,
      resetPassword,
      banUser,
      unbanUser,
      updateOrganization,
      submitCategoryProposal,
      reviewCategoryProposal,
      approveOrganization,
      rejectOrganization,
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
