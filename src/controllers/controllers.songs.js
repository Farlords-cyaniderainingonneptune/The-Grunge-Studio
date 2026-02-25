import db from '../config/db/index.js';
import * as Helpers from '../utils/utils.helpers.js'
import * as songModel from '../models/models.songs.js';
import * as authModel from '../models/models.auth.js';



//this allows you to view a list of songs available in paginated format
export const songList = async(req, res) => {
    
    try{
    const {query}= req;
    if(parseInt(query.per_page)> 100){
        return res.status(422).json({
        status: 'error',
        code: 422,
        message: 'Unprocessable entity, kindly check your per_page'
    });
};
const { offset, limit } = Helpers.paginationOffsetLimit(query);
   
  const songs = await songModel.viewSongsList(offset, limit);
  const totalsongs= await songModel.songCount();

  const totalsongsCount = parseInt(totalsongs.count);
  const totalPages = Helpers.paginationTotalPages(totalsongsCount, limit);

  return res.status(200).json({
    status: 'success',
    message: 'Blog posts retrieved successfully',
    source:'database',
    data: {
      page: parseInt(query.page) || 1,
      total_count: totalsongsCount,
      total_pages: parseInt(totalPages),
      songs
    },

  });
}catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
}
   
};
//this allows you to view a particular song
export const viewSong = async(req, res)=>{
  try{
    const userId= req.user.user_id;
    const{song_id}=req.query;
    if(!song_id){
      return res.status(400).json({
        status:'error',
        code:400,
        message:'No song_id given'
      });
    };
    const userExists= await authModel.checkIfUserActivelyExistsByUserId(userId);
    if(!userExists){
      return res.status(401).json({
        status:'error',
        code:401,
        message:'user does not exist'
      });
    };
    const songExists= await songModel.songExistsById(song_id);
    if(!songExists){
       return res.status(401).json({
        status:'error',
        code:401,
        message:'song does not exist'
      });
    }
    const viewSong= await songModel.viewSong(song_id)
     return res.status(200).json({
        status:'success',
        code:200,
        data:viewSong
      });
  
  }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
}
}
//search for songs
export const searchSongs = async(req,res)=>{
  try{
    const {userInput}= req.query;
    const song_title = `%${userInput}%`;
    if(!userInput){
      return res.status(400).json({
            status: 'error',
            code: 400,
            message: `user input required`
        });
    }
    if(!song_title){
      return res.status(400).json({
            status: 'error',
            code: 400,
            message: `Enter the title of the song`
        });
    }
    const songExists= await songModel.songExistsByName(song_title);
    if(!songExists){
       return res.status(401).json({
        status:'error',
        code:401,
        message:'song does not exist'
      });
    }

    const viewSong= await songModel.search(song_title)
     return res.status(200).json({
        status:'success',
        code:200,
        data:viewSong
      });

  }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
};
};
//Filter by genre
export const genreFilter = async(req,res)=>{
  try{
    const {genre}= req.query;
    if(!genre){
      return res.status(400).json({
            status: 'error',
            code: 400,
            message: `user input required`
        });
    }
    const genreExists= await songModel.songExistsByGenre(genre);
    if(!genreExists){
       return res.status(401).json({
        status:'error',
        code:401,
        message:'song does not exist'
      });
    }

    const viewSongs= await songModel.genre(genre)
     return res.status(200).json({
        status:'success',
        code:200,
        data:viewSongs
      });
  }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
 };
};
// add a new song(only accessible to admin and superadmin)
export const addSong= async(req,res)=>{
  try{
    const userId =  req.user.user_id;
    const {song_title, genre_id, artiste, year_of_release}= req.body
    if(!song_title || ! genre_id || ! artiste){
      return res.status(400).json({
            status: 'error',
            code: 400,
            message:`You can't proceed without adding title, genre and artiste of the song`
        })
 
    };
       const superAdmin = await authModel.checkIfSuperAdmin(userId)
     const actualAdmin = await authModel.checkIfActualAdmin(userId)
     if (!actualAdmin && !superAdmin){
      return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
     }
     const newSong = await songModel.addSong(song_title, genre_id, artiste, year_of_release, userId);
    return res.status(200).json({
            status: 'error',
            code: 200,
            message: `${song_title} added successfully`,
            data: newSong
        });
  }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
 };
}
// edit details about a song(only accesible to admin and superadmin)
export const editSong = async(req,res)=>{
  try{
    const adminId= req.user.user_id; 
    const song_id= req.params.song_id;
    const {song_title, genre_id, artiste, year_of_release}= req.body;
    if(!song_title || ! genre_id || ! artiste){
    const songExists= await songModel.songExistsById(song_id);
    if(!songExists){
       return res.status(401).json({
        status:'error',
        code:401,
        message:'song does not exist'
      });
    }
      const defaultSong =  await songModel.setDefault(song_id)
      return res.status(400).json({
            status: 'error',
            code: 400,
            message:'You have not added the title, genre or artiste of the song, hence the default details will be set',
            data: defaultSong
        })
    };
    if(!song_id){
       return res.status(401).json({
        status:'error',
        code:401,
        message:'No id inputed'
      });
    }
     const superAdmin = await authModel.checkIfSuperAdmin(adminId)
    const actualAdmin = await authModel.checkIfActualAdmin(adminId)
     if (!actualAdmin && ! superAdmin){
      return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin or superadmin'
            })
     }
    const songExists= await songModel.songExistsById(song_id);
    if(!songExists){
       return res.status(401).json({
        status:'error',
        code:401,
        message:'song does not exist'
      });
    };
    const updateSong = await songModel.updateSong(song_id, song_title, genre_id, artiste, year_of_release, adminId)
    if(!updateSong){
      return res.status(400).json({
            status: 'error',
            code: 400,
            message: `Song could not be updated`
        })
    }
    return res.status(200).json({
            status: 'error',
            code: 500,
            message:`${song_title} updated successfully.`,
            data:updateSong
        })
  }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
 }
}
// delete song
export const deleteSong = async(req,res)=>{
  try{
    const adminId= req.user.user_id; 
    const song_id= req.params.song_id;
  
    const superAdmin = await authModel.checkIfSuperAdmin(adminId)
     const actualAdmin = await authModel.checkIfActualAdmin(adminId)
     if (!actualAdmin && !superAdmin){
      return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
     }
    const songExists= await songModel.songExistsById(song_id);
    if(!songExists){
       return res.status(401).json({
        status:'error',
        code:401,
        message:'song does not exist'
      });
    }
    const deleteSong = await songModel.deleteSong(song_id)
      return res.status(200).json({
        status:'error',
        code:200,
        message:'song successfully deleted'
      });

  }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
 }
}