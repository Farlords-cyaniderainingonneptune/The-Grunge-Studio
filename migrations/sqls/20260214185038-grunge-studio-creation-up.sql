CREATE TYPE studio_user_status AS ENUM ('active', 'inactive', 'suspended', 'deactivated');
CREATE TYPE studio_user_roles AS ENUM ('user', 'admin', 'superadmin');

CREATE TABLE IF NOT EXISTS song_genres(
	id SERIAL PRIMARY KEY,
	name VARCHAR(250) UNIQUE NOT NULL,
	is_deleted BOOLEAN DEFAULT false,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ
);
INSERT INTO song_genres(name)
VALUES
	('Pop'),
	('Hip-Hop'),
	('Country'),
	('Classical'),
	('Folk'),
	('Trap'),
	('Rock'),
	('Indie-rock'),
	('Heavy Metal'),
	('Death Metal'),
	('R&B'),
	('EDM'),
	('Blues'),
	('Reggae'),
	('Afrobeats'),
	('Fuji'),
	('Juju'),
	('Punk Rock'),
	('Funk'),
	('Gospel');

CREATE TABLE IF NOT EXISTS artiste (
	id SERIAL,
	artiste_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(255) NOT NULL,
	spotify_name TEXT,
	image_url TEXT,
	bio TEXT,
	songs INT DEFAULT 0,
	is_deleted BOOLEAN DEFAULT false,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ 
);

CREATE TABLE IF NOT EXISTS studio_users(
	id SERIAL,
	user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_name VARCHAR(50) UNIQUE NOT NULL,
	full_name VARCHAR(250) NOT NULL,
	email VARCHAR(50) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	status studio_user_status DEFAULT 'inactive',
	role studio_user_roles DEFAULT 'user',
	current_roles studio_user_roles DEFAULT 'user',
	is_verified_account BOOLEAN DEFAULT FALSE,
	verification_code VARCHAR,
	verification_code_expire_at TIMESTAMPTZ,
	is_deleted BOOLEAN DEFAULT FALSE,
	last_login_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS studio_songs(
	id SERIAL,
	song_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	song_title VARCHAR NOT NULL,
	genre INT NOT NULL REFERENCES song_genres(id) ON DELETE CASCADE,  
	artiste UUID NOT NULL REFERENCES artiste(artiste_id) ON DELETE CASCADE ON UPDATE CASCADE,
	year_of_release VARCHAR,
	album_name VARCHAR,
	spotify_link TEXT,
	is_posted BOOLEAN DEFAULT false,
	album_cover TEXT,
	views_count INT DEFAULT 0,
	likes_count INT DEFAULT 0,
	average_ratings INT DEFAULT 0,
	is_deleted BOOLEAN DEFAULT false,
	added_by UUID NOT NULL REFERENCES studio_users(user_id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS song_ratings(
	id SERIAL PRIMARY KEY,
	song_id UUID NOT NULL REFERENCES studio_songs(song_id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES studio_users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	rating_value INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	UNIQUE (song_id, user_id)
);


CREATE TABLE IF NOT EXISTS song_reviews(
	id SERIAL PRIMARY KEY,
	song_id UUID NOT NULL REFERENCES studio_songs(song_id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES studio_users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	review_content TEXT,
	ratings INT NOT NULL CHECK (ratings BETWEEN 1 AND 5),
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS review_comments(
	comment_id SERIAL PRIMARY KEY,
	review_id INT NOT NULL REFERENCES song_reviews(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES studio_users(user_id) ON DELETE CASCADE,
	comment TEXT NOT NULL,
	views_count INT DEFAULT 0,
	likes_count INT DEFAULT 0,
	is_deleted BOOLEAN DEFAULT false,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ 
);