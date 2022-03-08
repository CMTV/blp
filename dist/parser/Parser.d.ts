import { Block } from "../block/Block";
import { Inliner } from "../inliner/Inliner";
import { ParseResult } from "../parser/ParseResult";
import { Heap } from "./Heap";
export declare class Parser {
    rootPath: string;
    mustaches: {
        [key: string]: any;
    };
    blocks: typeof Block[];
    inliners: typeof Inliner[];
    parse(str: string, parent?: ParseResult | Heap): ParseResult;
    private parseStrBlock;
    parseInline(str: string, handleInliners: (inliners: Inliner[]) => any): string;
}
