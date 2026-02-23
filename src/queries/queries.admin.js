export default{
   updateVerifiedAdmin:`
      UPDATE studio_users
          SET updated_at = NOW(),
          is_verified_account = TRUE,
          status = 'active',
          role='admin',
          verification_code = NULL,
          verification_code_expire_at = NULL
        WHERE email = $1
        RETURNING id, user_id, email, full_name, is_verified_account, status, role, created_at, updated_at
   `,
   checkIfAdminExistsVerifiedByusername: `SELECT id, user_id, email, user_name, full_name, 
   is_verified_account, status, role, created_at FROM studio_users 
   WHERE user_name = $1 AND is_deleted = FALSE AND role= 'admin' AND is_verified_account= TRUE`,
   controlAdminandUser:`
   UPDATE studio_users SET updated_at= NOW(),
   status= $2,
   is_deleted= $3,
   current_roles= $4,
   is_verified_account= $5 
   WHERE role=$6 AND user_id= $1
   RETURNING user_id, user_name, full_name, status, role
   `,
   reinstateAdmin:`
   UPDATE studio_users SET updated_at= NOW(),
   status= 'active',
   is_deleted= FALSE,
   current_roles= 'admin',
   is_verified_account= TRUE 
   WHERE role='admin' AND user_id= $1
   RETURNING user_id, user_name, full_name, status, role
   `,
   reinstateUser:`
   UPDATE studio_users SET updated_at= NOW(),
   status= 'active',
   is_deleted= FALSE,
   current_roles= 'user',
   is_verified_account= TRUE 
   WHERE role= 'user' AND user_id= $1
   RETURNING user_id, user_name, full_name, status, role
   `,
   suspendAdmin:`
   UPDATE studio_users SET updated_at= NOW(),
   status= 'suspended',
   is_deleted= FALSE,
   current_roles= 'user',
   is_verified_account= FALSE
   WHERE role= 'admin' AND user_id= $1
   RETURNING user_id, user_name, full_name, status, role
   `,
   suspendUser:`
   UPDATE studio_users SET updated_at= NOW(),
   status= 'suspended',
   is_deleted= FALSE,
   current_roles= 'user',
   is_verified_account= FALSE 
   WHERE role= 'user' AND user_id= $1
   RETURNING user_id, user_name, full_name, status, role
   `

}