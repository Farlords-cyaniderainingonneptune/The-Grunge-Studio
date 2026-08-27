CREATE TABLE IF NOT EXISTS album (
        id SERIAL,
	album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        artiste_id UUID REFERENCES artiste(artiste_id) ON DELETE CASCADE,
	name VARCHAR(255) NOT NULL,
	image_url TEXT,
	songs INT DEFAULT 0,
	is_deleted BOOLEAN DEFAULT false,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ 
);

ALTER TABLE studio_songs
DROP COLUMN IF EXISTS spotify_link;