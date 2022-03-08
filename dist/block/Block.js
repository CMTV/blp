"use strict";
exports.__esModule = true;
exports.Block = void 0;
var Block = /** @class */ (function () {
    function Block(str, parser, parseResult) {
        this.parse(str, parser, parseResult);
    }
    Block.canParse = function (str) {
        throw new Error('Method not implemented!');
    };
    return Block;
}());
exports.Block = Block;
