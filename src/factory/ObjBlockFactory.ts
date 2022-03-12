import YAML from 'yaml';

import { BlockFactory } from 'src/factory/BlockFactory';
import { Parser } from 'src/parser/Parser';
import { ParseResult } from 'src/parser/ParseResult';

export abstract class ObjBlockFactory<TObjBlock extends object> extends BlockFactory<TObjBlock>
{
    abstract objType: string;
    abstract parseObj(obj: any, parser: Parser, parseResult: ParseResult): TObjBlock;

    parse(str: string, parser: Parser, parseResult: ParseResult)
    {
        let yaml = str.substring(str.indexOf('\n') + 1);
        return this.parseObj(YAML.parse(yaml), parser, parseResult);
    }

    canParse(str: string)
    {
        return str.startsWith('@' + this.objType);
    }
}