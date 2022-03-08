"use strict";
exports.__esModule = true;
exports["default"] = {
    removeCaret: removeCaret,
    reduceSpaceLines: reduceSpaceLines,
    removeIndent: removeIndent
};
//
//
//
function removeCaret(str) {
    return str.replace(/\r/gm, '');
}
function reduceSpaceLines(str) {
    return str.replace(/^[ \t]+$/gm, '');
}
function removeIndent(str) {
    var spaces = str.match(/^[ \t]*(?<!$)/gm);
    if (!spaces)
        return str;
    var indent = Math.min.apply(Math, spaces.map(function (match) { return match.length; }));
    if (indent === 0)
        return str;
    var indentRegexp = new RegExp("^[ \\t]{".concat(indent, "}"), 'gm');
    return str.replace(indentRegexp, '');
}
