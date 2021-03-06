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
            username            : { type: String, index: true },
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
            if(err) return callback(new Error(`Error occured when finding user with username ${ username }, ${ err.message }`));
            if(__user) return callback(null, false);
            const _user = new this._User(
            {
                username    : username,
                password    : password
            });
            _user.save(err =>
            {
                if(err) return callback(new Error(`Error occured when saving user with username ${ username }, ${ err.message }`));
                callback(null, true);
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
        this._User.findOne({ username: username, isActive: true }, (err, _user) =>
        {
            if(err) return callback(new Error(`Error occured when finding user with username ${ username }, ${ err.message }`));
            callback(null, _user);
        });
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
            if(err) return callback(new Error(`Error occured when finding user with username ${ username }, ${ err.message }`));
            if(!_user) return callback(new Error(`User with username ${ username } doesn't exist`));
            _user.isActive = false;
            _user.save(callback);
        });
    }
}
module.exports = exports = UserManager;

