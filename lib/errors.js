"use strict"

class UnauthenticatedError extends Error
{
    constructor()
    {
        super("Unauthenticated");
        this.name = "UnauthenticatedError";
    }
}

class UnauthorizedError extends Error
{
    constructor(category, name, requiredRoles, grantedRoles)
    {
        super("");
        this.name = "UnauthorizedError";
        this.category = category;
        this.ruleName = name;
        this.requiredRoles = requiredRoles;
        this.grantedRoles = grantedRoles;
        this.message = `Unauthorized access for "${ this.ruleName }" in "${ this.category }", required roles: [${ this.requiredRoles.join(", ") }], granted roles: [${ this.grantedRoles.join(", ") }]`;
    }
}

exports.UnauthenticatedError = UnauthenticatedError;
exports.UnauthorizedError = UnauthorizedError;
