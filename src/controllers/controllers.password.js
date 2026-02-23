import * as authModel from '../models/models.auth.js';
import * as Hash from '../utils/utils.hash.js';
import * as Helpers from '../utils/utils.helpers.js';
import sendMail from '../services/email.js';
export const forgotPassword = async(req, res) => {
    const {email, username} = req.body;
 

    if (!email || !username){
         return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email, username, and newpassword are required'
        })
    }

     if (!email.includes('@')) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email is invalid'
        })
    }
    
   
    if (username.length < 3) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'username should not be less than 3 characters'
        })
    }
    const userDetails = await authModel.checkIfUserActivelyExistsByEmailAndUsername(username, email)
    if (!userDetails) {
        return res.status(401).json({
            status: 'error',
             code: 401,
             message: 'Invalid email, user does not exist'
        })
    }
    const actualAdmin = await authModel.checkIfActualAdmin(user_id)
    const wasAdmin = await authModel.checkIfWasAdmin(user_id)
    if (actualAdmin || wasAdmin){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
        };
const verificationCode = Helpers.generateVerificationCode(6);
const verificationCodeDuration = 10; // in minutes
const verificationCodeExpireAt= new Date(Date.now() + verificationCodeDuration * 60 * 1000);

const Content =`Hello ${full_name}, kindly reset your password using this OTP: ${verificationCode}. This OTP will expire in ${verificationCodeDuration} mins`
    await sendMail(email,'Forgot Password', Content);
const updatedUser = await authModel.updateUserVerificationCode(email, verificationCode, verificationCodeExpireAt)

    return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'password forgotten, new password can now be set',
        data: updatedUser
    })
};

export const resetPassword = async(req,res)=>{
    const {email, new_password, rewrite_newpassword, verificationCode} = req.body;
    if (!email || !new_password || !rewrite_newpassword || !verificationCode){
         return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email, username, and newpassword are required'
        })
    }

     if (!email.includes('@')) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'email is invalid'
        })
    }
     if (new_password.length < 10) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'password length should not be less than 10'
        })
    }

    if (!/[A-Z]/g.test(new_password) || !/[a-z]/g.test(new_password) || !/[0-9]/g.test(new_password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g.test(new_password)) {
        return res.status(422).json({
            status: 'error',
            code: 422,
            message: 'password should contain at least one uppercase, lowercase, number and special character'
        })
    }

    if (new_password !== rewrite_newpassword){
        return res.status(422).json({
            status:"error",
            code:422,
            message:"passwords don't match"
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
     if (userDetails.verification_code_expire_at < new Date()) {
        return res.status(401).json({
            status: 'error',
             code: 401,
             message: 'Verification code has expired'
        })
    }

    if (verificationCode !== userDetails.verification_code) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Invalid verification code'
        })
    }
    const actualAdmin = await authModel.checkIfActualAdmin(user_id)
    const wasAdmin = await authModel.checkIfWasAdmin(user_id)
    if (actualAdmin || wasAdmin){
            return res.status(400).json({
                status:'error',
                code:400,
                message:'Not an admin'
            })
        };
   //encrypt password
 const userPassword = await authModel.userPassword(userDetails.user_id)
     const validPassword = await Hash.compareData(new_password, userPassword.password);
        if (!validPassword) {
            return res.status(409).json({
                status: 'error',
                code: 409,
                message: 'Conflict, you cannot reuse your old password'
            })
        }

   const hash = await Hash.hashData(new_password);
//Comparing old password with new one
    // const validPassword = bcrypt.compareSync(new_password, userDetails.password);
    // if (validPassword){
    //         return res.status(409).json({
    //             status:'error',
    //             code:409,
    //             message:"Conflict, you can't reuse your old password"
    //         })
    // }
    const Content =`Hello ${full_name}, is this you? Your Password has been reset successfully`
    await sendMail(email,'Verify Your Account', Content);
     const resetPassword = await authModel.updateUserPassword(email, verificationCode, hash);
    // await db.one(`
    //     UPDATE blog_users
    //       SET updated_at = NOW(),
    //       status = 'active',
    //       password= $3
    //     WHERE email = $1
    //     RETURNING id, user_id, email, password, first_name`, [ email.trim().toLowerCase(), verificationCode, hash ])

    

    return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'new password set, proceed to login',
        data: resetPassword
    })

}