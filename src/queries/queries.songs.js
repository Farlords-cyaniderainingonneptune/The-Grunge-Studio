export default{
  viewSongsList:`
  SELECT * FROM studio_users
  ORDER BY created_at DESC
  WHERE is_deleted= false
  OFFSET $1
  LIMIT $2
  RETURNING song_title, artiste_id, song_id
  `,
  fetchSongCount:`
  SELECT COUNT(id) FROM studio_songs WHERE is_deleted=false
  `,
  viewSong:`
    SELECT s.song_title, s.artiste_id, a.name AS artiste_name, s.album_name, s.year_of_release, s.views_count, s.likes_count,
    s.average_ratings, g.name AS genre_name
    FROM studio_songs s
    JOIN artiste a ON s.artiste= artiste_id
    JOIN song_genres g ON s.genre= genre_id
    WHERE song_id = $1 AND is_deleted = false
    RETURNING s.song_title, a.name,g.name, s.album_name, s.year_of_release, s.views_count++,
    s.likes_count, a.average_ratings
  `,
  filterByGenre:`
    SELECT s.song_title, s.artiste_id, a.name AS artiste_name, s.album_name, s.year_of_release, s.views_count, s.likes_count,
    s.average_ratings, g.name AS genre_name
    FROM studio_songs s
    ORDER BY created_at DESC
    JOIN artiste a ON s.artiste= artiste_id
    JOIN song_genres g ON s.genre= genre_id
    WHERE g.name = $1 AND is_deleted = false
    RETURNING s.song_title, a.name, s.album_name
  `,
  searchSongs:`
   SELECT s.song_title, s.artiste_id, a.name AS artiste_name
   FROM studio_songs s
   JOIN artiste a ON s.artiste= artiste_id
   WHERE song_title ILIKE $1
   RETURNING s.song_title, a.name
  `,
  checkIfSongExistByName:`
  SELECT * FROM studio_songs 
  WHERE song_title ILIKE $1 AND is_deleted= false
  `,
  checkIfSongExistsById:`
  SELECT * FROM studio_songs 
  WHERE song_id = $1 AND is_deleted = false
  `,
  checkIfSongExistsByGenre:`
   SELECT s.song_title, s.artiste_id, s.album_name, s.year_of_release, s.views_count, s.likes_count,
    s.average_ratings, g.name AS genre_name
    FROM studio_songs s
    ORDER BY created_at DESC
    JOIN song_genres g ON s.genre= genre_id
    WHERE g.name = $1 AND is_deleted = false
  `,
  addSong:`
  INSERT INTO studio_songs(song_title, genre, artiste, year_of_release, added_by)
  VALUES($1, $2, $3, $4, $5)
  RETURNING song_title, genre, artiste, year_of_release, added_by, created_at
  `,
  setDefault:`
        UPDATE studio_songs WHERE song_id=$1
        RETURNING song_id, song_title, genre, artiste, year_of_release, added_by, created_at
    `,
  deleteSong:`
      DELETE FROM studio_songs
      WHERE song_id=$1 AND is_deleted= false
    `,
  updateSong:`
  UPDATE studio_songs
  SET update_at= NOW(),
  song_title = $2,
  genre= $3,
  artiste= $4,
  year_of_release= $5,
  added_by= $6
  WHERE song_id= $1
  RETURNING song_id, song_title, genre, artiste, year_of_release, added_by, updated_at
  `
}
