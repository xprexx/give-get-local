-- Add missing columns to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS accepted_categories text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rejected_categories text[] DEFAULT '{}';

-- Add missing columns to item_requests table
ALTER TABLE public.item_requests 
ADD COLUMN IF NOT EXISTS is_custom_category boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS moderation_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS moderation_note text,
ADD COLUMN IF NOT EXISTS location text;

-- Set moderation_status to 'approved' for items with approved status
UPDATE public.item_requests SET moderation_status = 'approved' WHERE status = 'approved';
UPDATE public.item_requests SET moderation_status = 'pending' WHERE status = 'pending';