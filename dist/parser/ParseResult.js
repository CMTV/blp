"use strict";
exports.__esModule = true;
exports.ParseResult = void 0;
var ParseResult = /** @class */ (function () {
    function ParseResult() {
        this.blocks = [];
        this.inliners = [];
    }
    ParseResult.prototype.handleInliners = function (inliners) {
        var _this = this;
        inliners.forEach(function (inliner) {
            _this.heap.inliners.push(inliner);
            var pushedIndex = _this.heap.inliners.length - 1;
            _this.inliners.push(_this.heap.inliners[pushedIndex]);
        });
    };
    return ParseResult;
}());
exports.ParseResult = ParseResult;
