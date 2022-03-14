import { BlockFactory } from '../factory/BlockFactory';
import { Parser } from '../parser/Parser';
import { ParseResult } from '../parser/ParseResult';
export declare abstract class ObjBlockFactory<TObj extends object, TObjBlock extends object> extends BlockFactory<TObjBlock> {
    abstract objType: string;
    abstract parseObj(obj: TObj, parser: Parser, parseResult: ParseResult): TObjBlock;
    parse(str: string, parser: Parser, parseResult: ParseResult): TObjBlock;
    canParse(str: string): boolean;
}
