"use strict"
const errors = require("../errors");

class AuthorizationManager
{
    constructor()
    {
        this._roles = new Set();
        this._rules = {};
    }

    registerRole(name)
    {
        if(this._roles.has(name)) throw new Error(`Duplicated registered role ${ name }`);
        this._roles.add(name);
    }

    hasRole(name)
    {
        return this._roles.has(name);
    }

    addRule(category, name, roles)
    {
        const unregisteredRole = roles.find(role => !this._roles.has(role));
        if(unregisteredRole) throw new Error(`Unregistered role ${ unregisteredRole }`);
        if(!this._rules[category]) this._rules[category] = {};
        if(this._rules[category][name]) throw new Error(`Duplicated rule (${ category }, ${ name })`);
        this._rules[category][name] = roles;
    }

    authorize(request, response, category, name, callback)
    {
        if(!request.user)
        {
            const error = new errors.UnauthenticatedError();
            if(callback) return callback(error);
            throw error;
        }
        if(!this._rules[category] || !this._rules[category][name]) return;
        const requiredRoles = new Set(this._rules[category][name]);
        const intersection = new Set(request.user.roles.filter(role => requiredRoles.has(role)));
        if(!intersection.size)
        {
            const error = new errors.UnauthorizedError(category, name, this._rules[category][name], request.user.roles);
            if(callback) return callback(error);
            throw error;
        }
    }
};

module.exports = exports = AuthorizationManager;
