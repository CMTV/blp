"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Parser = void 0;
var ParseResult_1 = require("../parser/ParseResult");
var util_1 = __importDefault(require("../parser/util"));
var Heap_1 = require("./Heap");
var Parser = /** @class */ (function () {
    function Parser() {
        this.blocks = [];
        this.inliners = [];
    }
    Parser.prototype.parse = function (str, parent) {
        if (parent === void 0) { parent = new Heap_1.Heap; }
        var result = new ParseResult_1.ParseResult;
        result.heap = parent instanceof ParseResult_1.ParseResult ? parent.heap : parent;
        if (!str)
            return result;
        str = util_1["default"].removeCaret(str);
        str = util_1["default"].reduceSpaceLines(str);
        str = util_1["default"].removeIndent(str);
        str = str.trim();
        var strBlocks = str.split(/\n{2,}/gm);
        /* ! */ var blocks = [];
        var insideObjBlock = false;
        var strObjBlock = '';
        for (var i = 0; i < strBlocks.length; i++) {
            var strBlock = strBlocks[i];
            if (insideObjBlock) {
                if (strBlock.search(/\S|$/) > 0)
                    strObjBlock += '\n\n' + strBlock;
                else {
                    blocks.push(this.parseStrBlock(strObjBlock, result));
                    strObjBlock = '';
                    insideObjBlock = false;
                }
            }
            if (!insideObjBlock) {
                if (strBlock.charAt(0) === '@') {
                    insideObjBlock = true;
                    strObjBlock += strBlock;
                }
                else
                    blocks.push(this.parseStrBlock(strBlock, result));
            }
        }
        if (strObjBlock !== '')
            blocks.push(this.parseStrBlock(strObjBlock, result));
        //
        blocks.forEach(function (block) {
            result.heap.blocks.push(block);
            var pushedIndex = result.heap.blocks.length - 1;
            result.blocks.push(result.heap.blocks[pushedIndex]);
        });
        return result;
    };
    Parser.prototype.parseStrBlock = function (strBlock, parseResult) {
        for (var i = 0; i < this.blocks.length; i++) {
            var Block_1 = this.blocks[i];
            if (Block_1.canParse(strBlock)) {
                //@ts-ignore
                return new Block_1(strBlock, this, parseResult);
            }
        }
        return null;
    };
    Parser.prototype.parseInline = function (str, handleInliners) {
        var inliners = [];
        this.inliners.forEach(function (Inliner) { return str = Inliner.render(str, inliners); });
        if (handleInliners)
            handleInliners(inliners);
        return str;
    };
    return Parser;
}());
exports.Parser = Parser;
