import { Factory } from "src/factory/Factory";
import { Parser } from "src/parser/Parser";
import { ParseResult } from "src/parser/ParseResult";

export abstract class BlockFactory<TBlock extends object> extends Factory<TBlock>
{
    // Parse

    abstract canParse(str: string): boolean;
    abstract parse(str: string, parser: Parser, parseResult: ParseResult): TBlock;

    // Render

    abstract canRender(product: any): boolean;
    abstract render(product: TBlock, parser: Parser): string;
}