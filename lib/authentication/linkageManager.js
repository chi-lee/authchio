"use strict"

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
     * Get linkage by user ID
     * @param {String} userId
     * @param {Function} callback
     */
    getLinkageByUserId(userId, callback)
    {
        throw new Error("Calling unimplented getLinkageByUserId()");
    }
    
    /**
     * Get linkage by data
     * @param {Object} data
     * @param {Function} callback
     */
    getLinkage(data, callback)
    {
        throw new Error("Calling unimplented getLinkage()");
    }

    /**
     * Get user of linkage by user ID
     * @param {String} userId
     * @param {Function} callback
     */
    getUserOfLinkageByUserId(userId, callback)
    {
        throw new Error("Calling unimplented getUserOfLinkageByUserId()");
    }
    
    /**
     * Get user of linkage by data
     * @param {Object} data
     * @param {Function} callback
     */
    getUserOfLinkage(data, callback)
    {
        throw new Error("Calling unimplented getUserOfLinkage()");
    }

    /**
     * Delete linkage by user ID
     * @param {String} userId
     * @param {Function} callback
     */
    deleteLinkageByUserId(userId, callback)
    {
        throw new Error("Calling unimplented deleteLinkageByUserId()");
    } 
    
    /**
     * Delete linkage by data
     * @param {Object} data
     * @param {Function} callback
     */
    deleteLinkage(data, callback)
    {
        throw new Error("Calling unimplented deleteLinkage()");
    }
}
module.exports = exports = LinkageManager;
