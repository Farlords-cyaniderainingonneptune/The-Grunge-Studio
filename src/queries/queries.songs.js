export default{
  viewSongsList:`
  SELECT * FROM studio_songs
  WHERE is_deleted= false
  ORDER BY created_at DESC
  OFFSET $1
  LIMIT $2
  `,
  fetchSongCount:`
  SELECT COUNT(id) FROM studio_songs WHERE is_deleted=false
  `,  
  viewSong:`
    SELECT s.song_title, a.name AS artiste_name, s.album_name, s.year_of_release, s.views_count, s.likes_count,
    s.average_ratings, g.name AS genre
    FROM studio_songs s
    JOIN artiste a ON s.artiste= a.artiste_id
    JOIN song_genres g ON s.genre= g.id
    WHERE song_id = $1 AND s.is_deleted = false
  `,
  updateView:`
    UPDATE studio_songs
    SET updated_at = NOW(),
    views_count = views_count + 1,
    WHERE is_deleted = 'false'
    AND song_id= $1

  `,
  filterByGenre:`
    SELECT s.song_title, s.album_name, s.year_of_release, s.views_count, s.likes_count,
    s.average_ratings, g.name AS genre
    FROM studio_songs s
    JOIN song_genres g ON s.genre= g.id
    WHERE g.name = $1 AND s.is_deleted = false
    ORDER BY s.created_at DESC
  `,
  searchSongs:`
   SELECT s.song_title, s.artiste, a.name AS artiste
   FROM studio_songs s
   JOIN artiste a ON s.artiste= a.artiste_id
   WHERE s.song_title ILIKE $1
  
  `,
  checkIfSongExistByName:`
  SELECT * FROM studio_songs 
  WHERE song_title ILIKE $1 AND is_deleted= false
  `,
  checkIfSongExistsById:`
  SELECT * FROM studio_songs 
  WHERE id = $1 AND is_deleted = false
  `,
  checkIfSongExistsByGenre:`
   SELECT s.song_title, s.album_name, s.year_of_release, s.views_count, s.likes_count,
    s.average_ratings, g.name AS genre
    FROM studio_songs s
    JOIN song_genres g ON s.genre= g.id
    WHERE g.name = $1 AND s.is_deleted = false
    ORDER BY s.created_at DESC
  `,
  addSong:`
  INSERT INTO studio_songs(song_title, genre, artiste, year_of_release, added_by)
  VALUES($1, $2, $3, $4, $5)
  RETURNING song_title, genre, artiste, year_of_release, added_by, created_at
  `,
  setDefault:`
        UPDATE studio_songs
        SET updated_at= NOW(),
        song_title = $2,
        genre= $3,
        artiste= $4,
        year_of_release= $5,
        added_by= $6
        WHERE id=$1
        RETURNING song_id, song_title, genre, artiste, year_of_release, added_by, created_at
    `,
  deleteSong:`
      DELETE FROM studio_songs
      WHERE id=$1 AND is_deleted= false
    `,
  updateSong:`
  UPDATE studio_songs
  SET updated_at= NOW(),
  song_title = $2,
  genre= $3,
  artiste= $4,
  year_of_release= $5,
  added_by= $6
  WHERE id= $1
  RETURNING song_id, song_title, genre, artiste, year_of_release, added_by, updated_at
  `
}
