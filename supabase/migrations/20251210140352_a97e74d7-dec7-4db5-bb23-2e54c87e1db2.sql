-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'beneficiary', 'organization', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected')),
  verification_document TEXT,
  verification_document_name TEXT,
  nric TEXT,
  address TEXT,
  birthdate TEXT,
  declaration_agreed BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category_preferences TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verification_document TEXT,
  verification_document_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subcategories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create category_proposals table
CREATE TABLE public.category_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  category_name TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subcategory_preferences table
CREATE TABLE public.subcategory_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  accepted_subcategories TEXT[] DEFAULT '{}',
  rejected_subcategories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, category)
);

-- Create donation_listings table
CREATE TABLE public.donation_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  subcategory TEXT,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
  pickup_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pickup_requests table
CREATE TABLE public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.donation_listings(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  alternative_date DATE,
  alternative_time TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  response_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pickup_request_messages table
CREATE TABLE public.pickup_request_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.pickup_requests(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create item_requests table
CREATE TABLE public.item_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'fulfilled', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create crowdfunding_campaigns table
CREATE TABLE public.crowdfunding_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create crowdfunding_donations table
CREATE TABLE public.crowdfunding_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.crowdfunding_campaigns(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name TEXT,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create volunteer_events table
CREATE TABLE public.volunteer_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  max_volunteers INTEGER NOT NULL,
  current_volunteers INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create volunteer_registrations table
CREATE TABLE public.volunteer_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.volunteer_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  age INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create impact_stories table
CREATE TABLE public.impact_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategory_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_request_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowdfunding_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowdfunding_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;

-- Create has_role function for RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create handle_new_user function for auto-creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Determine status based on role
  user_role := COALESCE((new.raw_user_meta_data->>'role')::app_role, 'user');
  
  -- Insert profile
  INSERT INTO public.profiles (id, email, name, status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    CASE 
      WHEN user_role IN ('beneficiary', 'organization') THEN 'pending'
      ELSE 'active'
    END
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_donation_listings_updated_at BEFORE UPDATE ON public.donation_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pickup_requests_updated_at BEFORE UPDATE ON public.pickup_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_item_requests_updated_at BEFORE UPDATE ON public.item_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crowdfunding_campaigns_updated_at BEFORE UPDATE ON public.crowdfunding_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_volunteer_events_updated_at BEFORE UPDATE ON public.volunteer_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can read all, update own
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles: Only admins can manage, users can view own
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Organizations: Public read, owner update
CREATE POLICY "Anyone can view approved orgs" ON public.organizations FOR SELECT USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create own org" ON public.organizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own org" ON public.organizations FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Categories: Public read, admin manage
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Category proposals: Org owners and admins
CREATE POLICY "Orgs can view own proposals" ON public.category_proposals FOR SELECT USING (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Orgs can create proposals" ON public.category_proposals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage proposals" ON public.category_proposals FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Subcategory preferences
CREATE POLICY "Anyone can view subcategory prefs" ON public.subcategory_preferences FOR SELECT USING (true);
CREATE POLICY "Orgs can manage own prefs" ON public.subcategory_preferences FOR ALL USING (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);

-- Donation listings: Public read, owner manage
CREATE POLICY "Anyone can view available listings" ON public.donation_listings FOR SELECT USING (status = 'available' OR user_id = auth.uid());
CREATE POLICY "Users can create listings" ON public.donation_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON public.donation_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON public.donation_listings FOR DELETE USING (auth.uid() = user_id);

-- Pickup requests: Requester and listing owner
CREATE POLICY "Users can view relevant pickup requests" ON public.pickup_requests FOR SELECT USING (
  requester_id = auth.uid() OR EXISTS (SELECT 1 FROM donation_listings WHERE id = listing_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create pickup requests" ON public.pickup_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Relevant users can update pickup requests" ON public.pickup_requests FOR UPDATE USING (
  requester_id = auth.uid() OR EXISTS (SELECT 1 FROM donation_listings WHERE id = listing_id AND user_id = auth.uid())
);

-- Pickup request messages
CREATE POLICY "Relevant users can view messages" ON public.pickup_request_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM pickup_requests pr
    JOIN donation_listings dl ON pr.listing_id = dl.id
    WHERE pr.id = request_id AND (pr.requester_id = auth.uid() OR dl.user_id = auth.uid())
  )
);
CREATE POLICY "Relevant users can send messages" ON public.pickup_request_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM pickup_requests pr
    JOIN donation_listings dl ON pr.listing_id = dl.id
    WHERE pr.id = request_id AND (pr.requester_id = auth.uid() OR dl.user_id = auth.uid())
  )
);

-- Item requests: Beneficiaries can create, public read approved
CREATE POLICY "Anyone can view approved item requests" ON public.item_requests FOR SELECT USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Beneficiaries can create item requests" ON public.item_requests FOR INSERT WITH CHECK (
  auth.uid() = user_id AND public.has_role(auth.uid(), 'beneficiary')
);
CREATE POLICY "Users can update own requests" ON public.item_requests FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Crowdfunding campaigns: Public read, org manage
CREATE POLICY "Anyone can view active campaigns" ON public.crowdfunding_campaigns FOR SELECT USING (status = 'active' OR EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid()));
CREATE POLICY "Orgs can create campaigns" ON public.crowdfunding_campaigns FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);
CREATE POLICY "Orgs can update own campaigns" ON public.crowdfunding_campaigns FOR UPDATE USING (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);
CREATE POLICY "Orgs can delete own campaigns" ON public.crowdfunding_campaigns FOR DELETE USING (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);

-- Crowdfunding donations: Anyone can donate, public read
CREATE POLICY "Anyone can view donations" ON public.crowdfunding_donations FOR SELECT USING (true);
CREATE POLICY "Anyone can donate" ON public.crowdfunding_donations FOR INSERT WITH CHECK (true);

-- Volunteer events: Public read, org manage
CREATE POLICY "Anyone can view upcoming events" ON public.volunteer_events FOR SELECT USING (status IN ('upcoming', 'ongoing') OR EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid()));
CREATE POLICY "Orgs can create events" ON public.volunteer_events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);
CREATE POLICY "Orgs can update own events" ON public.volunteer_events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);
CREATE POLICY "Orgs can delete own events" ON public.volunteer_events FOR DELETE USING (
  EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND user_id = auth.uid())
);

-- Volunteer registrations
CREATE POLICY "Users can view own registrations" ON public.volunteer_registrations FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM volunteer_events ve JOIN organizations o ON ve.organization_id = o.id
    WHERE ve.id = event_id AND o.user_id = auth.uid()
  )
);
CREATE POLICY "Users can register" ON public.volunteer_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Orgs can manage registrations" ON public.volunteer_registrations FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM volunteer_events ve JOIN organizations o ON ve.organization_id = o.id
    WHERE ve.id = event_id AND o.user_id = auth.uid()
  )
);

-- Notifications: Users can manage own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Impact stories: Public read approved, users manage own
CREATE POLICY "Anyone can view approved stories" ON public.impact_stories FOR SELECT USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create stories" ON public.impact_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage stories" ON public.impact_stories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pickup_request_messages;

-- Insert default categories
INSERT INTO public.categories (name, subcategories) VALUES
  ('Clothing', ARRAY['Men', 'Women', 'Children', 'Shoes', 'Accessories']),
  ('Electronics', ARRAY['Phones', 'Computers', 'Appliances', 'Audio', 'Other']),
  ('Furniture', ARRAY['Living Room', 'Bedroom', 'Office', 'Kitchen', 'Outdoor']),
  ('Books', ARRAY['Fiction', 'Non-Fiction', 'Textbooks', 'Children', 'Comics']),
  ('Food', ARRAY['Canned Goods', 'Dry Goods', 'Fresh Produce', 'Beverages']),
  ('Toys', ARRAY['Educational', 'Outdoor', 'Board Games', 'Stuffed Animals']),
  ('Others', ARRAY['Miscellaneous']);