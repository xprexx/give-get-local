-- Allow users to delete their own item requests
CREATE POLICY "Users can delete own item requests"
ON public.item_requests
FOR DELETE
USING (auth.uid() = user_id);

-- Allow admins to delete any item request
CREATE POLICY "Admins can delete any item request"
ON public.item_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));