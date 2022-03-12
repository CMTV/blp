import { Factory } from "../factory/Factory";
import { Parser } from "../parser/Parser";
import { ParseResult } from "../parser/ParseResult";
export declare abstract class InlinerFactory<TInliner extends object> extends Factory<TInliner> {
    abstract essential: boolean;
    abstract render(str: string, parser: Parser, parseResult: ParseResult): string;
}
