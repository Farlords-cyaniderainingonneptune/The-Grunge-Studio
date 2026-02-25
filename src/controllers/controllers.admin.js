import * as authModel from '../models/models.auth.js';
import * as adminModel from '../models/models.admin.js';
import * as Hash from '../utils/utils.hash.js';
import * as Helpers from '../utils/utils.helpers.js';
import sendMail from '../services/email.js';

export const register = async (req, res) => {
    try{
        const userId= req.user.user_id;
        const actualSuperAdmin= await authModel.checkIfSuperAdmin(userId);
    if(!actualSuperAdmin){
        return res.status(401).json({
            status:'error',
            code:409,
            message:'unauthorized access'
        })
    }
    const { email, password, username, full_name } = req.body
    if (!email || !username || !password || !full_name) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email, username, password and first_name are required'
        })
    }

    if (!email.includes('@')) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email is invalid'
        })
    }
    
    if (password.length < 10) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'password length should not be less than 10'
        })
    }

    if (!/[A-Z]/g.test(password) || !/[a-z]/g.test(password) || !/[0-9]/g.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g.test(password)) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'password should contain at least one uppercase, lowercase, number and special character'
        })
    }

    if (username.length < 3 || full_name.length < 3) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'username, first_name and last_name should not be less than 3 characters'
        })
    }

    const existingEmail = await authModel.checkUserExistsByEmail(email);
    if (existingEmail) {
        return res.status(409).json({
            status: 'error',
            code: 409,
            message: 'email already exists'
        })
    }
    const existingUserName = await authModel.checkUserExistsByUsername(username);
    if (existingUserName) {
        return res.status(409).json({
            status: 'error',
            code: 409,
            message: 'username already exists'
        })
    };
     const existingAdmin = await authModel.checkIfActualAdminByUsername(existingUserName)
   if(existingAdmin){
    return res.status(409).json({
        status:'error',
        code:409,
        message: 'this admin cannot be used'
    })
   }

    // hash password
    const hash = await Hash.hashData(password);
    const verificationCode = Helpers.generateVerificationCode(6);
    const verificationCodeDuration = 10; // in minutes
    const verificationCodeExpireAt = new Date(Date.now() + verificationCodeDuration * 60 * 1000);

    //  send verification email to users
    const Content =`Hello ${full_name}, kindly verify your admin account using this OTP: ${verificationCode}. This OTP will expire in ${verificationCodeDuration} mins`
    await sendMail(email,'Verify Your Account', Content);
    // save to the DB
    const newUser = await authModel.createUser(req.body, hash, verificationCode, verificationCodeExpireAt);
    return res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Account created successfully',
        data: newUser
    })
    }catch(err){
    return res.status(500).json({
            status: 'error',
            code: 500,
            message: err.message
        })
}
};

export const verifyAdminAccount = async (req, res) => {
    const { verification_code, email} = req.body;

    if (!verification_code || !email) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'verification_code and email are required'
        })
    }

    if (verification_code.length !== 6) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'verification_code must be 8 digits'
        })
    }

    const userDetails = await authModel.checkIfUserActivelyExistsByEmail(email);
    if (!userDetails) {
        return res.status(401).json({
            status: 'error',
             code: 401,
             message: 'Invalid email, user does not exist'
        })
    }

    if (userDetails.is_verified_account) {
        return res.status(400).json({
            status: 'error',
             code: 400,
             message: 'Account already verified'
        })
    }

    if (userDetails.verification_code_expire_at < new Date()) {
        return res.status(401).json({
            status: 'error',
             code: 401,
             message: 'Verification code has expired'
        })
    }

    if (verification_code !== userDetails.verification_code) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid verification code'
        })
    }

    // send welcome email to users 
    const Content =`Hello ${userDetails.full_name}. Welcome to The Grunge Studio. Your account has been verified. Sit back and feel some beats`
    await sendMail(email,'Account Verified', Content);

    const verifyAdmin = await adminModel.verifyAdmin(email);

    return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Account verified successfully',
        data: verifyAdmin
    })
};


export const Adminlogin = async (req, res) => {
    try{
    const { username, password, email } = req.body

    if (!username || !password || !email) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'username and password are required'
        })
    }

    const userExists = await authModel.checkIfUserActivelyExistsByEmailAndUsername(username);
    if (!userExists) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid login credentials'
        })
    };
    
    const userPasswordDetails = await authModel.userPassword(userExists.user_id);
    const validPassword = await Hash.compareData(password, userPasswordDetails.password);
    if (!validPassword) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid login credentials'
        })
    }

    const allowedStatuses = [ 'active', 'inactive']
    if (!allowedStatuses.includes(userExists.status)) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: `User account is ${userExists.status}, kindly contact support team`
        })
    }

    // generate jwt token to manage sessions
    const token = Helpers.generateJWTToken(userExists);
    const actualSuperAdmin= await authModel.checkIfSuperAdmin(userExists.user_id);
    if(actualSuperAdmin){
        return res.status(200).json({
        status: 'success',
         code: 200,
         message: 'User logged in as superAdmin successfully',
         data: { ...userExists, token }
        })
    }
    
    const adminVerified = await adminModel.verifiedAdmin(username)
    if(!adminVerified){
        return res.status(401).json({
            status:'error',
            code:'401',
            message:'Unauthorized access'
        })
    }
    await authModel.updateAdminOnLogin(userExists.user_id);
    return res.status(200).json({
        status: 'success',
         code: 200,
         message: 'User logged in as Admin successfully',
         data: { ...userExists, token }
    })
    }catch(err){
        return res.status(500).json({
            status:'error',
            code:500,
            message:err.message
        })
    }
};

export const adminActivate = async(req, res)=> {
    try{
        const userId = req.user.user_id;
        const {action = ['deactivate', 'reactivate']} = req.query;
        const {user_id} = req.body;
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
                message:'enter the admin user_id'
            })
        }
        const superAdmin = await authModel.checkIfSuperAdmin(userId)
        if(superAdmin){
            return res.status(401).json({
                status:'failed',
                code:401,
                message:'Unauthorized action'
            })
        }
        const actualAdmin = await authModel.checkIfActualAdmin(user_id)
        const wasAdmin = await authModel.checkIfWasAdmin(user_id)
        if (!actualAdmin && !wasAdmin){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
        }
        if(action === 'deactivate'){
            await adminModel.deactivateAdmin(user_id)
            return res.status(200).json({
                status:'success',
                message:'your admin account has been deactivated, kindly contact your superadmin reactivate it.'
            })
        }
        if (action === 'reactivate'){
            await adminModel.reactivateAdmin(user_id)
            return res.status(200).json({
                status:'success',
                message:'your admin account has been succesfully reactivated'
            })
        }
    }catch(err){
        return res.status(500).json({
            status:'error',
            code:500,
            message:err.message
        })
    }
}
export const suspendReinstateAdmin = async(req, res)=> {
    try{
        const userId = req.user.user_id;
        const {action = ['suspend', 'reinstate']}= req.query;
        const {adminId} = req.body;
        if (!action){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'action require, unable to comply'
            })
        }
        if(!adminId){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'enter the admin user_id'
            })
        }
        const superAdmin = await authModel.checkIfSuperAdmin(userId)
        if(!superAdmin){
            return res.status(401).json({
                status:'failed',
                code:401,
                message:'Unauthorized action'
            })
        }
        const actualAdmin = await authModel.checkIfActualAdmin(adminId)
        const wasAdmin = await authModel.checkIfWasAdmin(adminId)
        if(action === 'suspend'){
            if (!actualAdmin){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
        }
            await adminModel.suspendAdmin(adminId)
            return res.status(200).json({
                status:'success',
                message:'your admin account has been suspended, kindly contact your superadmin for further information.'
            })
        }
        if (action === 'reinstate'){
            if (!wasAdmin){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
        }
            await adminModel.reinstateAdmin(adminId)
            return res.status(200).json({
                status:'success',
                message:'you have been suscessfully reinstated as an admin'
            })
        }
    }catch(err){
        return res.status(500).json({
            status:'error',
            code:500,
            message:err.message
        })
    }
}
