import { Block } from "./block/Block";
import { BlockObject } from "./block/BlockObject";
import { Inliner } from "./inliner/Inliner";
import { Heap } from "./parser/Heap";
import { Parser } from "./parser/Parser";
import { ParseResult } from "./parser/ParseResult";
declare const _default: {
    Block: typeof Block;
    BlockObject: typeof BlockObject;
    Inliner: typeof Inliner;
    Heap: typeof Heap;
    Parser: typeof Parser;
    ParseResult: typeof ParseResult;
    util: {
        removeCaret: (str: string) => string;
        reduceSpaceLines: (str: string) => string;
        removeIndent: (str: string) => string;
    };
};
export default _default;
