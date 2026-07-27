-- 1. Lock down helper functions
REVOKE ALL ON FUNCTION public.assign_first_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2. Storage: admin-only writes for product images
DROP POLICY IF EXISTS "authenticated upload product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated update product images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated delete product images" ON storage.objects;

CREATE POLICY "admins upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update product images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete product images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- 3. Orders: validated guest checkout instead of WITH CHECK (true)
DROP POLICY IF EXISTS "anyone can place order" ON public.orders;

CREATE POLICY "anyone can place a valid order"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND total >= 0 AND total <= 10000000
  AND length(btrim(customer_name)) BETWEEN 2 AND 100
  AND length(btrim(phone)) BETWEEN 7 AND 20
  AND phone ~ '^[0-9+()\-\s]+$'
  AND (address IS NULL OR length(address) <= 500)
  AND (notes IS NULL OR length(notes) <= 1000)
  AND (product_name IS NULL OR length(product_name) <= 200)
);