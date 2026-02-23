import * as authModel from '../models/models.auth.js';
import * as adminModel from '../models/models.admin.js';
import * as Hash from '../utils/utils.hash.js';
import * as Helpers from '../utils/utils.helpers.js';
import sendMail from '../services/email.js';

export const userActivate = async(req, res)=> {
    try{
        const userId= req.user.user_id;
        const {action=['deactivate', 'reactivate']}= req.query;
        const {user_id}= req.body;
        if (!action){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'action require, unable to comply'
            })
        }
        if(!user_id){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'enter the user_id'
            })
        }
        const superAdmin = await authModel.checkIfSuperAdmin(userId)
        if(superAdmin){
            if(action==='deactivate'){
            await adminModel.deactivateUser(user_id)
            return res.status(200).json({
                status:'success',
                message:'your admin account has been deactivated, kindly contact your superadmin reactivate it.'
            })
        }
        if (action==='reactivate'){
            await adminModel.reactivateUser(user_id)
            return res.status(200).json({
                status:'success',
                message:'your admin account has been succesfully reactivated'
            })
        }
    }
        const actualAdmin = await authModel.checkIfActualAdmin(userId)

        if (!actualAdmin){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
        };
        if (actualAdmin){
            if(action==='deactivate'){
            await adminModel.deactivateUser(user_id)
            return res.status(200).json({
                status:'success',
                message:'your user account has been deactivated, kindly contact admins to reactivate it.'
            })
        }
        if (action==='reactivate'){
            await adminModel.reactivateUser(user_id)
            return res.status(200).json({
                status:'success',
                message:'your user account has been succesfully reactivated'
            })
        }
        }
        
    }catch(err){
        return res.status(500).json({
            status:'error',
            code:500,
            message:err.message
        })
    }
}
export const suspendReinstateUser = async(req, res)=> {
    try{
        const adminId= req.user.user_id;
        const {action = ['suspend', 'reinstate']}= req.query;
        const {userId}= req.body;
        if (!action){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'action require, unable to comply'
            })
        }
        if(!userId){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'enter the user_id'
            })
        }
        //superadmin control
        const superAdmin = await authModel.checkIfSuperAdmin(adminId)
        if(superAdmin){
           if(action==='suspend'){
            await adminModel.suspendUser(userId)
            return res.status(200).json({
                status:'success',
                message:'your account has been suspended, kindly contact admin for further information.'
            })
        }
        if (action==='reinstate'){
            await adminModel.reinstateUser(userId)
            return res.status(200).json({
                status:'success',
                message:'you have been suscessfully reinstated as a user'
            });
         };
        };
        //admin control
        const actualAdmin = await authModel.checkIfActualAdmin(adminId)
        if (!actualAdmin){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
        }
        if (actualAdmin){
            if(action==='suspend'){
            await adminModel.suspendUser(userId)
            return res.status(200).json({
                status:'success',
                message:'your account has been suspended, kindly contact your admin for further information.'
            })
        }
        if (action==='reinstate'){
            await adminModel.reinstateUser(userId)
            return res.status(200).json({
                status:'success',
                message:'you have been suscessfully reinstated as a user'
            })
         };
        }; 
    }catch(err){
        return res.status(500).json({
            status:'error',
            code:500,
            message:err.message
        })
    }
};
