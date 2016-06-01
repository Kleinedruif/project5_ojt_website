// Helper function for handlebars
exports.if_ql = function (pageRoute, route) {
    return pageRoute == route;
};

exports.min = function (lengt, index) {
    return lengt - index;
};

exports.add = function (index, toAdd) {
    return index + toAdd;
};