
-- Create scan history table
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant TEXT NOT NULL,
  disease TEXT NOT NULL,
  severity TEXT NOT NULL,
  confidence TEXT NOT NULL,
  recommendations TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own scans
CREATE POLICY "Users can view own scans"
  ON public.scan_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own scans
CREATE POLICY "Users can insert own scans"
  ON public.scan_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own scans
CREATE POLICY "Users can delete own scans"
  ON public.scan_history FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster user queries
CREATE INDEX idx_scan_history_user_id ON public.scan_history(user_id);
CREATE INDEX idx_scan_history_created_at ON public.scan_history(created_at DESC);
