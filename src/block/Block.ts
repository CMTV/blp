import { Parser } from "src/parser/Parser";
import { ParseResult } from "src/parser/ParseResult";

export abstract class Block
{
    constructor(str: string, parser: Parser, parseResult: ParseResult)
    {
        this.parse(str, parser, parseResult);
    }

    abstract parse(str: string, parser: Parser, parseResult: ParseResult);
    abstract render(): string;

    static canParse(str: string): boolean
    {
        throw new Error('Method not implemented!');
    }
}