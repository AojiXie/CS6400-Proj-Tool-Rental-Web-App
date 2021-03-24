var middlewareObj = {};

middlewareObj.isCustomerLoggedIn = function (req, res, next) {
    if(req.user && req.user.category === 'customer' && req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

middlewareObj.isClerkLoggedIn = function (req, res, next) {
    if(req.user && req.user.category === 'clerk' && req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;