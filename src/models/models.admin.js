import db from "../config/db/index.js";
import queries from "../queries/queries.admin.js";
export const deactivateAdmin = async (user_id, status, current_roles, roles )=>{
    const deactivateAdmin = await db.oneOrNone(queries.controlAdminandUser,[user_id, 'deactivated', false, 'user', false, 'admin' ]);
    return deactivateAdmin;
}
export const reactivateAdmin = async (user_id, status, current_roles, roles )=>{
    const reactivateAdmin = await db.oneOrNone(queries.controlAdminandUser,[user_id, 'active', false,'user', true, 'admin' ]);
    return reactivateAdmin;
}
export const reactivateUser = async (user_id, status, current_roles, roles )=>{
    const reactivateUser = await db.oneOrNone(queries.controlAdminandUser,[user_id, 'active', false, 'user', true,'user'] );
    return reactivateUser;
}
export const deactivateUser = async (user_id, status, current_roles, roles )=>{
    const deactivateUser = await db.oneOrNone(queries.controlAdminandUser,[user_id, 'deactivated', false, 'user', false, 'user' ]);
    return deactivateUser;
}
export const verifyAdmin = async (email)=>{
    const verifiedAdmin = await db.oneOrNone(queries.updateVerifiedAdmin,[email]);
    return verifiedAdmin;
}
export const verifiedAdmin = async (username)=>{
    const verifiedAdmin = await db.oneOrNone(queries.checkIfAdminExistsVerifiedByusername,[username]);
    return verifiedAdmin;
};
export const suspendAdmin = async (user_id)=>{
    const suspendedAdmin = await db.oneOrNone(queries.suspendAdmin, [user_id]);
    return suspendedAdmin;
};
export const suspendUser = async (user_id)=>{
    const suspendedUser = await db.oneOrNone(queries.suspendUser, [user_id]);
    return suspendedUser;
};
export const reinstateAdmin = async (user_id)=>{
    const suspendedUser = await db.oneOrNone(queries.reinstateAdmin, [user_id]);
    return suspendedUser;
};
export const reinstateUser = async (user_id)=>{
    const user = await db.oneOrNone(queries.reinstateUser, [user_id]);
    return user;
};
