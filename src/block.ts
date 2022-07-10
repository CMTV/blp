import YAML from "yaml";

import Product from "src/Product";
import IFactory from "src/IFactory";
import Parser, { Context } from "src/Parser";
import { Inliner } from "src/inliner";
import BlockMeta from "./BlockMeta";

export abstract class Block extends Product {}

export class Paragraph extends Block
{
    _type = "paragraph";
    content: Inliner[];

    constructor(content: string, parser: Parser)
    {
        super();
        this.content = parser.parseInliners(content);
    }
}

//
//
//

export abstract class BlockFactory<TBlock extends Block> implements IFactory<TBlock>
{
    abstract canParse(str: string, ctx: Context): boolean;
    abstract parse(str: string, ctx: Context, meta?: BlockMeta): TBlock;
}

export abstract class BlockObjFactory<TBlock extends Block, TObj = any> extends BlockFactory<TBlock>
{
    abstract objType: string;
    abstract parseObj(obj: TObj, ctx: Context, meta?: BlockMeta): TBlock;

    canParse(str: string)
    {
        return str.startsWith('@' + this.objType);
    }

    parse(str: string, ctx: Context, meta?: BlockMeta)
    {
        let yaml = str.substring(str.indexOf('\n') + 1);
        return this.parseObj(YAML.parse(yaml), ctx, meta);
    }
}