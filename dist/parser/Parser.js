"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Parser = void 0;
var ParseResult_1 = require("../parser/ParseResult");
var Heap_1 = require("../parser/Heap");
var util_1 = __importDefault(require("../parser/util"));
var Parser = /** @class */ (function () {
    function Parser() {
        this.fBlocks = [];
        this.fInliners = [];
    }
    Parser.prototype.parse = function (str, parent) {
        if (parent === void 0) { parent = null; }
        var result = new ParseResult_1.ParseResult;
        result.parent = parent;
        result.heap = parent ? parent.heap : new Heap_1.Heap;
        if (!str)
            return result;
        str = util_1["default"].removeCaret(str);
        str = util_1["default"].reduceSpaceLines(str);
        str = util_1["default"].removeIndent(str);
        str = str.trim();
        var strBlocks = str.split(/\n{2,}/gm);
        var blocks = [];
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
        blocks.forEach(function (block) {
            result.blocks.push(block);
            result.heap.blocks.push(block);
        });
        return result;
    };
    Parser.prototype.parseStrBlock = function (strBlock, parseResult) {
        for (var i = 0; i < this.fBlocks.length; i++) {
            var fBlock = this.fBlocks[i];
            if (fBlock.canParse(strBlock))
                return fBlock.parse(strBlock, this, parseResult);
        }
        return null;
    };
    Parser.prototype.parseInline = function (str, parseResult) {
        var _this = this;
        if (parseResult === void 0) { parseResult = null; }
        var inliners = [];
        var listener = function (inliner) { return inliners.push(inliner); };
        this.fInliners.forEach(function (fInliner) {
            if (fInliner.essential)
                fInliner.addParseListener(listener);
            str = fInliner.render(str, _this, parseResult);
            fInliner.removeParseListener(listener);
        });
        if (parseResult) {
            parseResult.inliners = parseResult.inliners.concat(inliners);
            parseResult.heap.inliners = parseResult.heap.inliners.concat(inliners);
        }
        return str;
    };
    Parser.prototype.render = function (blocks) {
        var _this = this;
        if (!Array.isArray(blocks))
            blocks = blocks.blocks;
        var str = '';
        blocks.forEach(function (block) {
            str += _this.renderBlock(block);
        });
        return str.replace(/>[\s]+</gm, '><');
    };
    Parser.prototype.renderBlock = function (block) {
        for (var i = 0; i < this.fBlocks.length; i++) {
            var fBlock = this.fBlocks[i];
            if (fBlock.canRender(block))
                return fBlock.render(block, this);
        }
        return null;
    };
    return Parser;
}());
exports.Parser = Parser;
