export default {
    checkUserExistsByEmail: 'SELECT id, email, user_name FROM studio_users WHERE email = $1',
    checkUserExistsByUsername: 'SELECT id, email, user_name, role FROM studio_users WHERE user_name = $1',
    createUser: `
        INSERT INTO studio_users (email, user_name, password, full_name, verification_code, verification_code_expire_at) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, email, user_id, user_name, full_name, verification_code_expire_at, created_at`,
    checkIfUserActivelyExistsByEmail: 'SELECT id, user_id, full_name, email, is_verified_account, verification_code, verification_code_expire_at FROM studio_users WHERE email = $1 AND is_deleted = FALSE',
    updateUserAccountVerification: `
        UPDATE studio_users
          SET updated_at = NOW(),
          is_verified_account = TRUE,
          status = 'active',
          verification_code = NULL,
          verification_code_expire_at = NULL
        WHERE email = $1
        RETURNING id, user_id, email, full_name, is_verified_account, status, created_at, updated_at`,
    updateUserVerificationCode: 'UPDATE studio_users SET updated_at = NOW(), verification_code = $2, verification_code_expire_at = $3 WHERE email = $1 RETURNING id, user_id, email, verification_code, verification_code_expire_at',
    checkIfUserActivelyExistsByEmailAndUsername: `
        SELECT id, user_id, email, user_name, full_name, is_verified_account, status, created_at 
        FROM studio_users 
        WHERE (user_name = $1 OR email = $2) 
        AND is_deleted = FALSE`,
    checkIfUserActivelyExistsByUserId: 'SELECT id, user_id, email, user_name, full_name, is_verified_account, status, created_at FROM studio_users WHERE user_id = $1 AND is_deleted = FALSE',
    userPassword: 'SELECT id, user_id, password FROM studio_users WHERE user_id = $1',
    updateUserOnLogin: 'UPDATE studio_users SET updated_at = NOW(), last_login_at = NOW() WHERE user_id = $1',
    updateAdminOnLogin: `UPDATE studio_users SET updated_at = NOW(), last_login_at = NOW(), status= 'active', role='admin', current_roles= 'admin' WHERE user_id = $1`,
    updateUserPassword:`
    UPDATE studio_users
    SET updated_at = NOW(), status = 'active', password= $3 WHERE email = $1 RETURNING id, user_id, email, password, full_name`,
     checkIfActualAdmin: `
        SELECT user_id, user_name, role, status 
        FROM studio_users WHERE user_id=$1 
        AND current_roles=$2
        AND status=$3
    `,
     checkIfWasAdmin: `
        SELECT user_id, user_name, role, status 
        FROM studio_users WHERE user_id=$1 
        AND role=$2
    `,
     checkIfActualAdminByUsername: `
        SELECT user_id, user_name, role, status
        FROM studio_users WHERE role= $1
        AND status=$2
    `,
    checkIfUserActive:`
    SELECT user_id, user_name, status FROM studio_users WHERE user_id= $1 AND status='active'
    AND is_deleted = FALSE
    `
}
