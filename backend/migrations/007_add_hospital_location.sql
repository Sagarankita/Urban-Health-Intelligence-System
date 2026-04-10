-- Add hospital area/location used by the municipal capacity UI.
-- This migration is safe to run multiple times (IF NOT EXISTS).
ALTER TABLE hospitals
ADD COLUMN IF NOT EXISTS location TEXT;

