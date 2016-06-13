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
     * Generate access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} options
     * @param {Function} callback
     */
    token(request, response, options, callback)
    {
        throw new Error("Calling unimplemented token()");
    }

    /**
     * Authenticate user with the access token and return User
     * @param {Request} request
     * @param {Response} response
     * @param {Function} callback
     */
    authenticate(request, response, callback)
    {
        throw new Error("Calling unimplemented authenticate()");
    }

    /**
     * Revoke the access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Function} callback 
     */
    revoke(request, response, callback)
    {
        throw new Error("Calling unimplemented revoke()");
    }
}
module.exports = exports = Authenticator;

Authenticator.CredentialsCookies = require("./authenticator/credentialsCookies");
Authenticator.FacebookCookies = require("./authenticator/facebookCookies");
