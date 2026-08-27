CREATE TYPE subscription_tier AS ENUM ('free','weekly', 'monthly', 'yearly');

ALTER TABLE IF EXISTS studio_users
ADD COLUMN IF NOT EXISTS subscription subscription_tier DEFAULT 'free',
ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN DEFAULT FALSE;
