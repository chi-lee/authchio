"use strict"
const mongoose = require("mongoose");

/**
 *  Class responsible for managing users 
 */
class UserManager
{
    /**
     * Create a user manager.
     */
    constructor()
    {
        const userSchema = new mongoose.Schema(
        {
            username            : { type: String, index: { unique: true } },
            password            : { type: String, default: "" },
            roles               : [String],
            isActive            : { type: Boolean, default: true }
        }, { timestamps: true });
        this._User = mongoose.model("User", userSchema);
    }
    
    /**
     * Create a user.
     * @param {String} username
     * @param {String} password
     * @param {Function} callback
     */
    createUser(username, password, callback)
    {
        this._User.findOne({ username: username, isActive: true }).exec((err, __user) =>
        {
            if(err) return callback(err);
            if(__user) return callback();
            const _user = new this._User(
            {
                username    : username,
                password    : password
            });
            _user.save(callback);
        });
    }

    /**
     * Get user by username.
     * @param {String} username
     * @param {Function} callback
     */
    getUserByUsername(username, callback)
    {
        this._User.findOne({ username: username, isActive: true }, callback);
    }
        
    /**
     * Remove user by username.
     * @param {String} username
     * @param {Function} callback
     */
    removeUser(username, callback)
    {
        this._User.findOne({ username: username, isActive: true }, (err, _user) =>
        {
            if(err) return callback(err);
            _user.isActive = false;
            _user.save(callback);
        });
    }
}
module.exports = exports = UserManager;

