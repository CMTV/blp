import { Factory } from "src/factory/Factory";
import { Parser } from "src/parser/Parser";
import { ParseResult } from "src/parser/ParseResult";

export abstract class InlinerFactory<TInliner> extends Factory<TInliner>
{
    abstract essential: boolean;
    abstract render(str: string, parser: Parser, parseResult: ParseResult): string;
}