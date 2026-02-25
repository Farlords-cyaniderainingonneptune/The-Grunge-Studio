import db from "../config/db/index.js";
import queries from "../queries/queries.songs.js";

export const viewSongsList= async(offset, limit)=>{
    const songList = await db.any(queries.viewSongsList,[parseInt(offset), parseInt(limit)]);
    return songList;
};
export const viewSong= async(song_id)=>{
    const songList = await db.oneOrNone(queries.viewSong,[song_id]);
    return songList;
};
export const genre= async(genre_name)=>{
    const genreSearch = await db.any(queries.filterByGenre,[genre_name]);
    return genreSearch;
};
export const search= async(title)=>{
    const genreSearch = await db.many(queries.searchSongs,[title]);
    return genreSearch;
};
export const songCount= async()=>{
    const songCount= await db.oneOrNone(queries.fetchSongCount);
    return songCount;
}
export const songExistsByName= async(song_title)=>{
    const songExists= await db.oneOrNone(queries.checkIfSongExistByName,[song_title]);
    return songExists;
};
export const songExistsById = async(song_id)=>{
    const songExists= await db.oneOrNone(queries.checkIfSongExistsById,[song_id]);
    return songExists;
};
export const songExistsByGenre = async(genre_name)=>{
    const songExists= await db.any(queries.checkIfSongExistsByGenre,[genre_name]);
    return songExists;
};
export const addSong = async(song_title, genre_id, artiste, year_of_release, contributor)=>{
    const newSong= await db.oneOrNone(queries.addSong,[song_title, genre_id, artiste, year_of_release, contributor]);
    return newSong;
};
export const setDefault = async(song_id, song_title, genre_id, artiste, year_of_release, contributor)=>{
    const newSong= await db.oneOrNone(queries.setDefault,[song_id, song_title, genre_id, artiste, year_of_release, contributor]);
    return newSong;
};
export const deleteSong = async(song_id)=>{
    const newSong= await db.oneOrNone(queries.deleteSong,[song_id]);
    return newSong;
};
export const updateSong = async(song_id, song_title, genre_id, artiste, year_of_release, contributor)=>{
    const newSong= await db.oneOrNone(queries.updateSong,[song_id, song_title, genre_id, artiste, year_of_release, contributor]);
    return newSong;
};
export const updateView = async(song_id)=>{
    const updateViewCount= await db.oneOrNone(queries.updateView, [song_id]);
    return updateViewCount;
}