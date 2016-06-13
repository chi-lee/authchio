"use strict"
const UserManager = require("../userManager");

/**
 * Base Class for registrators
 */
class Registrator
{
    /**
     * Create a Registrator
     * @param {UserManager} userManager
     */ 
    constructor(userManager)
    {
        if(!userManager instanceof UserManager) throw new Error("Not an instance of UserManager");
        this._userManager = userManager;
    }
    
    /**
     * Register user.
     * @param {Object} data - info needed for registration
     * @param {Function} callback 
     */
    register(data, callback)
    {
        throw new Error("Calling unimplemented register()");
    }
}
module.exports = exports = Registrator;

Registrator.Credentials = require("./registrator/credentials");
Registrator.Facebook = require("./registrator/facebook");
