import { BlockFactory } from "../factory/BlockFactory";
import { InlinerFactory } from "../factory/InlinerFactory";
import { ParseResult } from "../parser/ParseResult";
export declare class Parser {
    meta: object;
    fBlocks: BlockFactory<any>[];
    fInliners: InlinerFactory<any>[];
    parse(str: string, parent?: ParseResult): ParseResult;
    parseStrBlock(strBlock: string, parseResult: ParseResult): any;
    parseInline(str: string, parseResult?: ParseResult): string;
    render(blocks: ParseResult | any[]): string;
    renderBlock(block: any): string;
}
