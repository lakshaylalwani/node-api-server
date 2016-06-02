'use strict'
/**
 * Provides methods for authorizing users
 */

// the file name
const registeredUsers = {
    //format email : password
    'abc@xyz.com' : '123',
    'how.cool@is.this' : 'awesome'
};


module.exports = {
    /**
     * Returns whether the user is authorized
     */
    authorizeUser: function(email,password) {
        var isAuthorized = password === registeredUsers[email];
        return isAuthorized;
    }
}