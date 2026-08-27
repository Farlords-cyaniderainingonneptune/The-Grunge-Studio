DROP TYPE subscription_tier;

ALTER TABLE IF EXISTS studio_users
DROP COLUMN IF EXISTS subscription,
DROP COLUMN IF EXISTS is_subscribed;