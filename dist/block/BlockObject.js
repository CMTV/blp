"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.BlockObject = void 0;
var yaml_1 = __importDefault(require("yaml"));
var Block_1 = require("../block/Block");
var BlockObject = /** @class */ (function (_super) {
    __extends(BlockObject, _super);
    function BlockObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlockObject.prototype.parse = function (str) {
        var yaml = str.replace(/^@(.+)$/m, '');
        this.parseObj(yaml_1["default"].parse(yaml));
    };
    BlockObject.canParse = function (str) {
        if (!this.objType)
            return false;
        return str.startsWith('@' + this.objType);
    };
    return BlockObject;
}(Block_1.Block));
exports.BlockObject = BlockObject;
