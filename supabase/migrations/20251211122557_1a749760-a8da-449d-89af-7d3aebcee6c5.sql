-- Allow admins to delete any donation listing
CREATE POLICY "Admins can delete any listing"
ON public.donation_listings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));