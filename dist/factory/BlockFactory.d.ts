import { Factory } from "../factory/Factory";
import { Parser } from "../parser/Parser";
import { ParseResult } from "../parser/ParseResult";
export declare abstract class BlockFactory<TBlock extends object> extends Factory<TBlock> {
    abstract canParse(str: string): boolean;
    abstract parse(str: string, parser: Parser, parseResult: ParseResult): TBlock;
    abstract canRender(product: any): boolean;
    abstract render(product: TBlock, parser: Parser): string;
}
