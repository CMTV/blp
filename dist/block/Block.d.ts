import { Parser } from "../parser/Parser";
import { ParseResult } from "../parser/ParseResult";
export declare abstract class Block {
    constructor(str: string, parser: Parser, parseResult: ParseResult);
    abstract parse(str: string, parser: Parser, parseResult: ParseResult): any;
    abstract render(): string;
    static canParse(str: string): boolean;
}
