CREATE TYPE file_type AS ENUM('mp3', 'wav', 'aac', 'flac');
CREATE TABLE IF NOT EXISTS song_upload(
	id SERIAL PRIMARY KEY,
    uploaded_by UUID NOT NULL REFERENCES studio_users(user_id) on DELETE CASCADE ON UPDATE CASCADE,
    file_url TEXT NOT NULL,
    song_id UUID REFERENCES studio_songs(song_id) ON DELETE CASCADE,
    type file_type NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    size BIGINT NOT NULL,
    cloudinary_public_id TEXT,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
); 

