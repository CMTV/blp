"use strict";
exports.__esModule = true;
exports.Factory = void 0;
var Factory = /** @class */ (function () {
    function Factory() {
        this.parseListeners = [];
    }
    Factory.prototype.fireParseListeners = function (product) {
        this.parseListeners.forEach(function (listener) { return listener(product); });
    };
    Factory.prototype.addParseListener = function (listener) {
        this.parseListeners.push(listener);
    };
    Factory.prototype.removeParseListener = function (listener) {
        for (var i = 0; i < this.parseListeners.length; i++) {
            if (this.parseListeners[i] === listener) {
                this.parseListeners.splice(i, 1);
                i--;
            }
        }
    };
    return Factory;
}());
exports.Factory = Factory;
