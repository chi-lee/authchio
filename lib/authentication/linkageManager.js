"use strict"
const mongoose = require("mongoose");

/**
 * Base Class for linkage managers
 */
class LinkageManager
{
    /**
     * Create a LinkageManager
     */
    constructor()
    {
    }
    
    /**
     * Create a linkage
     * @param {String} userId
     * @param {Object} data
     */
    createLinkage(userId, data, callback)
    {
        throw new Error("Calling unimplented createLinkage()");
    }

    /**
     * Get linkage with user ID
     * @param {String} userId
     * @param {Function} callback
     */
    getLinkageByUserId(userId, callback)
    {
        throw new Error("Calling unimplented getLinkageByUserId()");
    }
    
    /**
     * Get user of linkage
     * @param {Object} data
     * @param {Function} callback
     */
    getLinkage(data, callback)
    {
        throw new Error("Calling unimplented getLinkage()");
    }
    
    /**
     * Delete linkage
     * @param {Object} data
     * @param {Function} callback
     */
    deleteLinkage(data, callback)
    {
        throw new Error("Calling unimplented deleteLinkage()");
    }

    /**
     * Delete linkage with user ID
     * @param {String} userId
     * @param {Function} callback
     */
    deleteLinkageByUserId(userId, callback)
    {
        throw new Error("Calling unimplented deleteLinkageByUserId()");
    } 
}
module.exports = exports = LinkageManager;

LinkageManager.Facebook = require("./linkageManager/facebook");
