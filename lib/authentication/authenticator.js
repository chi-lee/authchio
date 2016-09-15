"use strict"
const UserManager = require("../userManager");

/**
 * Base Class of all authenticators
 */
class Authenticator
{
    /**
     * Create a Authenticator
     * Inject a UserManager instance for subclasses to use
     * @param {UserManager} userManager
     */
    constructor(userManager)
    {
        if(!userManager instanceof UserManager) throw new Error("Not a UserManager instance");
        this._userManager = userManager;
    }

    /**
     * Register user.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for registration
     * @param {Function} callback 
     */
    register(request, response, data, callback)
    {
        throw new Error("Calling unimplemented register()");
    }

    /**
     * Modify user.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for modification
     * @param {Function} callback 
     */
    modify(request, response, data, callback)
    {
        throw new Error("Calling unimplemented modify()");
    }

    /**
     * Grant access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for granting access token
     * @param {Function} callback
     */
    token(request, response, data, callback)
    {
        throw new Error("Calling unimplemented token()");
    }

    /**
     * Authenticate user with access token
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for authentication
     * @param {Function} callback
     */
    authenticate(request, response, data, callback)
    {
        throw new Error("Calling unimplemented authenticate()");
    }

    /**
     * Revoke access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for revoking access token
     * @param {Function} callback 
     */
    revoke(request, response, data, callback)
    {
        throw new Error("Calling unimplemented revoke()");
    }

    /**
     * Deregister user.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for deregistration
     * @param {Function} callback 
     */
    deregister(request, response, data, callback)
    {
        throw new Error("Calling unimplemented deregister()");
    }
}
module.exports = exports = Authenticator;
