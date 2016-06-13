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
        this._User.findOne({ username: username, isActive: true }).exec((err, refUser) =>
        {
            if(err) return callback(err);
            if(refUser) return callback();
            const newUser = new this._User(
            {
                username    : username,
                password    : password
            });
            newUser.save(err =>
            {
                if(err) return callback(err);
                return callback(null, newUser);
            });
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
        this._User.findOne({ username: username, isActive: true }, (err, refUser) =>
        {
            if(err) return callback(err);
            refUser.isActive = false;
            refUser.save(callback);
        });
    }
}
exports = UserManager;
