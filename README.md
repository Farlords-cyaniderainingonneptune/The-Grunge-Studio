




To register, verify account and login as a user, make use of the routes.auth.js here  
To change user and superadmin password, make use of the routes.auth here
To add new songs, make use of the routes.songs.js. Take note, in this API, you need not directly add the user id for contributor. The API makes use of the JWT token, reads the user Id and inserts it as the contributor.
As superadmin, to create new admin, make use of the routes.admin.js endpoints,
Only a superadmin can create new admin. An email will be sent to the new admins email and from there on, the admin will login. Only when the admin logs in will the current_roles be updated to admin.
NOTE: The current_roles collumn is very important as it is an heavy restriction on what an admin can do. Only active admin should have their current_roles set to admin. No inactive, suspended or deactivated admin will have their current role set to admin.
To suspend, reinstate, reactivate and deactivate an admin, make use of the routes.status control.js route. NOTE: It is very rigid and it the same time quite flexible. Make sure to take note of the permissions current_roles and roles gives an admin.
To add, edit and view songs, the routes.songs.js will be utilized. You can make use of the names of genres and titles of songs as a query parameter to conduct filter and search accordingly.