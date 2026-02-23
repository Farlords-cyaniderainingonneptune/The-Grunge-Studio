import db from "../config/db/index.js";
import queries from "../queries/queries.auth.js";

export const checkUserExistsByEmail = async (email) => {
    const user = await db.oneOrNone(queries.checkUserExistsByEmail, [ email.trim().toLowerCase() ]);
    return user;
}

export const checkUserExistsByUsername = async (username) => {
    const user = await db.oneOrNone(queries.checkUserExistsByUsername, [ username.trim().toLowerCase() ]);
    return user;
}

export const createUser = async (body, hash, verificationCode, verificationCodeExpireAt) => {
    const user = await db.oneOrNone(queries.createUser, [
        body.email.trim().toLowerCase(),
        body.username.trim().toLowerCase(),
        hash,
        body.full_name.trim().toLowerCase(),
        verificationCode,
        verificationCodeExpireAt
    ]);
    return user;
}

export const checkIfUserActivelyExistsByEmail = async (email) => {
    const user = await db.oneOrNone(queries.checkIfUserActivelyExistsByEmail, [ email.trim().toLowerCase() ]);
    return user;
}

export const updateUserVerification = async (email) => {
    const verifiedUser = await db.oneOrNone(queries.updateUserAccountVerification, [ email.trim().toLowerCase() ]);
    return verifiedUser; 
}

export const updateUserVerificationCode = async (email, verificationCode, verificationCodeExpireAt) => {
    const updatedUser = await db.oneOrNone(queries.updateUserVerificationCode, [ email.trim().toLowerCase(), verificationCode, verificationCodeExpireAt ]);
    return updatedUser;
}

export const checkIfUserActivelyExistsByEmailAndUsername = async (username,email)=>{
    const user = await db.oneOrNone(queries.checkIfUserActivelyExistsByEmailAndUsername, [ username, email]);
    return user;
}

export const userPassword = async (user_id) => {
    const userPasswordDetails = await db.oneOrNone(queries.userPassword, [ user_id ]);
    return userPasswordDetails;
}

export const updateUserOnLogin = async (user_id) => {
    const user = await db.oneOrNone(queries.updateUserOnLogin, [ user_id ]);
    return user;
}

export const checkIfUserActivelyExistsByUserId = async (user_id) => {
    const user = await db.oneOrNone(queries.checkIfUserActivelyExistsByUserId, [ user_id ]);
    return user;
}
export const updateUserPassword = async(email, verificationCode, hash)=>{
    const user = await db.oneOrNone(queries.updateUserPassword,[email, verificationCode, hash]);
    return user;
}
export const checkIfActualAdmin = async (user_id, current_roles, status)=>{
    const actualAdmin = await db.oneOrNone(queries.checkIfActualAdmin,[user_id, 'admin', 'active']);
    return actualAdmin;
}
export const checkIfWasAdmin = async (user_id, role)=>{
    const actualAdmin = await db.oneOrNone(queries.checkIfWasAdmin,[user_id, 'admin']);
    return actualAdmin;
}

export const checkIfActualAdminByUsername = async (role, status)=>{
    const actualAdmin = await db.oneOrNone(queries.checkIfActualAdminByUsername,['admin', 'active']);
    return actualAdmin;
}
export const checkIfSuperAdmin = async (user_id, current_roles, status)=>{
    const superAdmin = await db.oneOrNone(queries.checkIfActualAdmin,[user_id, 'superadmin', 'active']);
    return superAdmin;
}
export const updateAdminOnLogin = async (user_id) => {
    const admin = await db.oneOrNone(queries.updateAdminOnLogin, [ user_id ]);
    return admin;
}