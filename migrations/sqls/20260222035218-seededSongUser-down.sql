ALTER TABLE studio_songs
ADD COLUMN IF NOT EXISTs spotify_link;

DROP TABLE IF EXISTS album;