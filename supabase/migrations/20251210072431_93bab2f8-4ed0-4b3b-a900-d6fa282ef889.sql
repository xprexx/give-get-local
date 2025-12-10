
-- Create enums for user roles and statuses
CREATE TYPE public.app_role AS ENUM ('user', 'beneficiary', 'organization', 'admin');
CREATE TYPE public.user_status AS ENUM ('active', 'pending', 'rejected');
CREATE TYPE public.org_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.item_condition AS ENUM ('new', 'like_new', 'good', 'fair');
CREATE TYPE public.listing_status AS ENUM ('available', 'claimed', 'removed');
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.request_status AS ENUM ('active', 'fulfilled', 'cancelled');
CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.campaign_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE public.volunteer_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.notification_type AS ENUM ('approval', 'donation', 'chat', 'pickup', 'volunteer', 'crowdfunding', 'system');
CREATE TYPE public.pickup_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  verification_document TEXT,
  verification_document_name TEXT,
  -- Beneficiary-specific fields
  nric TEXT,
  address TEXT,
  birthdate DATE,
  declaration_agreed BOOLEAN DEFAULT false,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  accepted_categories TEXT[] DEFAULT '{}',
  rejected_categories TEXT[] DEFAULT '{}',
  status org_status NOT NULL DEFAULT 'pending',
  verification_document TEXT,
  verification_document_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create organization_subcategory_preferences table
CREATE TABLE public.organization_subcategory_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  accepted_subcategories TEXT[] DEFAULT '{}',
  rejected_subcategories TEXT[] DEFAULT '{}',
  UNIQUE (organization_id, category)
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subcategories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, subcategories) VALUES
  ('Clothing', ARRAY['Men', 'Women', 'Children', 'Accessories']),
  ('Electronics', ARRAY['Phones', 'Computers', 'Appliances', 'Audio']),
  ('Furniture', ARRAY['Living Room', 'Bedroom', 'Office', 'Outdoor']),
  ('Books', ARRAY['Fiction', 'Non-fiction', 'Educational', 'Children']),
  ('Toys', ARRAY['Board Games', 'Outdoor', 'Educational', 'Stuffed Animals']),
  ('Kitchen', ARRAY['Cookware', 'Utensils', 'Appliances', 'Storage']),
  ('Sports', ARRAY['Equipment', 'Clothing', 'Accessories']),
  ('Baby Items', ARRAY['Clothing', 'Gear', 'Toys', 'Feeding']),
  ('Others', ARRAY['Miscellaneous']);

-- Create category_proposals table
CREATE TABLE public.category_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  subcategory TEXT,
  description TEXT NOT NULL,
  status moderation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create donation_listings table
CREATE TABLE public.donation_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  subcategory TEXT,
  condition item_condition NOT NULL,
  pickup_location TEXT NOT NULL,
  status listing_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create item_requests table
CREATE TABLE public.item_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  is_custom_category BOOLEAN NOT NULL DEFAULT false,
  location TEXT NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'active',
  moderation_status moderation_status NOT NULL DEFAULT 'pending',
  moderation_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create volunteer_events table
CREATE TABLE public.volunteer_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  spots_total INTEGER NOT NULL,
  spots_filled INTEGER NOT NULL DEFAULT 0,
  status event_status NOT NULL DEFAULT 'upcoming',
  requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create volunteer_registrations table
CREATE TABLE public.volunteer_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.volunteer_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER NOT NULL,
  message TEXT,
  status volunteer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

-- Create crowdfunding_campaigns table
CREATE TABLE public.crowdfunding_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  supporters INTEGER NOT NULL DEFAULT 0,
  status campaign_status NOT NULL DEFAULT 'active',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create crowdfunding_donations table
CREATE TABLE public.crowdfunding_donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.crowdfunding_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  donor_name TEXT,
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pickup_requests table
CREATE TABLE public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.donation_listings(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  alternative_date DATE,
  alternative_time TEXT,
  message TEXT,
  status pickup_status NOT NULL DEFAULT 'pending',
  response_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_subcategory_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowdfunding_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowdfunding_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    CASE 
      WHEN (NEW.raw_user_meta_data ->> 'role') IN ('beneficiary', 'organization') THEN 'pending'::user_status
      ELSE 'active'::user_status
    END
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'user'::app_role)
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_donation_listings_updated_at BEFORE UPDATE ON public.donation_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_item_requests_updated_at BEFORE UPDATE ON public.item_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_volunteer_events_updated_at BEFORE UPDATE ON public.volunteer_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crowdfunding_campaigns_updated_at BEFORE UPDATE ON public.crowdfunding_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pickup_requests_updated_at BEFORE UPDATE ON public.pickup_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for organizations
CREATE POLICY "Anyone can view approved organizations" ON public.organizations FOR SELECT USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own organization" ON public.organizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own organization" ON public.organizations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any organization" ON public.organizations FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for organization_subcategory_preferences
CREATE POLICY "Anyone can view subcategory preferences" ON public.organization_subcategory_preferences FOR SELECT USING (true);
CREATE POLICY "Org owners can manage subcategory preferences" ON public.organization_subcategory_preferences FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for category_proposals
CREATE POLICY "Org owners can view own proposals" ON public.category_proposals FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Org owners can insert proposals" ON public.category_proposals FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage proposals" ON public.category_proposals FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for donation_listings
CREATE POLICY "Anyone can view available listings" ON public.donation_listings FOR SELECT USING (status = 'available' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can insert listings" ON public.donation_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update own listings" ON public.donation_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any listing" ON public.donation_listings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can delete own listings" ON public.donation_listings FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for item_requests
CREATE POLICY "Anyone can view approved requests" ON public.item_requests FOR SELECT 
  USING (moderation_status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Beneficiaries can insert requests" ON public.item_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'beneficiary'));
CREATE POLICY "Owners can update own requests" ON public.item_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage any request" ON public.item_requests FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for volunteer_events
CREATE POLICY "Anyone can view upcoming events" ON public.volunteer_events FOR SELECT USING (true);
CREATE POLICY "Org owners can insert events" ON public.volunteer_events FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));
CREATE POLICY "Org owners can update own events" ON public.volunteer_events FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));
CREATE POLICY "Org owners can delete own events" ON public.volunteer_events FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));

-- RLS Policies for volunteer_registrations
CREATE POLICY "Users can view own registrations" ON public.volunteer_registrations FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.volunteer_events ve JOIN public.organizations o ON ve.organization_id = o.id WHERE ve.id = event_id AND o.user_id = auth.uid()));
CREATE POLICY "Authenticated users can register" ON public.volunteer_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Org owners can update registrations" ON public.volunteer_registrations FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.volunteer_events ve JOIN public.organizations o ON ve.organization_id = o.id WHERE ve.id = event_id AND o.user_id = auth.uid()));

-- RLS Policies for crowdfunding_campaigns
CREATE POLICY "Anyone can view active campaigns" ON public.crowdfunding_campaigns FOR SELECT USING (status = 'active' OR EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Org owners can insert campaigns" ON public.crowdfunding_campaigns FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));
CREATE POLICY "Org owners can update own campaigns" ON public.crowdfunding_campaigns FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));
CREATE POLICY "Org owners can delete own campaigns" ON public.crowdfunding_campaigns FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND user_id = auth.uid()));

-- RLS Policies for crowdfunding_donations
CREATE POLICY "Anyone can view donations" ON public.crowdfunding_donations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can donate" ON public.crowdfunding_donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for pickup_requests
CREATE POLICY "Users can view own pickup requests" ON public.pickup_requests FOR SELECT 
  USING (requester_id = auth.uid() OR EXISTS (SELECT 1 FROM public.donation_listings WHERE id = listing_id AND user_id = auth.uid()));
CREATE POLICY "Authenticated users can create pickup requests" ON public.pickup_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Involved users can update pickup requests" ON public.pickup_requests FOR UPDATE 
  USING (requester_id = auth.uid() OR EXISTS (SELECT 1 FROM public.donation_listings WHERE id = listing_id AND user_id = auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create function to update campaign totals when donation is made
CREATE OR REPLACE FUNCTION public.update_campaign_on_donation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.crowdfunding_campaigns
  SET 
    current_amount = current_amount + NEW.amount,
    supporters = supporters + 1
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_crowdfunding_donation
  AFTER INSERT ON public.crowdfunding_donations
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_on_donation();
