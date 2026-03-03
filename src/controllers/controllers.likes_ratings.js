import * as Helpers from '../utils/utils.helpers.js'
import * as likesRateModel from '../models/models.comments_reviews.js';
import * as authModel from '../models/models.auth.js';

export const likeUnlike = async(req, res)=>{
    try{
        const songId= req.params.song_id;
        const {action=['like','unlike']}= req.query
        const userId= req.user.userId;
        const username = req.user.user_name

        if (!action) {
            return res.status(422).json({
                status: 'error',
                code: 422,
                message: 'action query parameter is required and must be either like or unlike'
            })
        }
        const userExists= await authModel.checkIfUserActivelyExistsByUserId(userId);
            if(!userExists){
              return res.status(401).json({
                status:'error',
                code:401,
                message:'user does not exist'
              });
            };
            const songExists= await songModel.songExistsById(songId);
            if(!songExists){
               return res.status(401).json({
                status:'error',
                code:401,
                message:'song does not exist'
              });
            }

        if(action === 'like'){
            const like = await likesRateModel.likeSong(songId)
            return res.status(200).json({
            status: 'success',
            code: 200,
            message: `Post ${action} successfully by ${username}`
        })
        }if (action === 'unlike'){
            const like = await likesRateModel.unlikeSong(songId);
            return res.status(200).json({
            status: 'success',
            code: 200,
            message: `Post ${action} successfully by ${username}`
        })
    }
    }catch(err){
        return res.status(500).json({
            status: 'error',
            code:500,
            message:err.message
        })
    }
}
export const rateSong = async(req,res)=>{
    try{

    }catch(err){
        return res.status(500).json({
            status: 'error',
            code:500,
            message:err.message
        })
    }
}