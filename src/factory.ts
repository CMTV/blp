import YAML from "yaml";

import BlockMeta from "./BlockMeta";
import { Parser } from "./Parser";
import { Product, Block, Inliner } from "./product";
import util from "./util";

export abstract class Factory<TProduct extends Product>
{
    protected parser: Parser;

    constructor(parser: Parser)
    {
        this.parser = parser;
    }

    fabricate(str: string): TProduct
    {
        this.preParse(str);
        let product = this.parse(str);
        this.postParse(product);

        return product;
    }

    protected abstract parse(str: string): TProduct;

    protected preParse(str: string): void {}
    protected postParse(product: TProduct): void {}
}

//#region Block Factory

export abstract class BlockFactory<TBlock extends Block> extends Factory<TBlock>
{
    protected blockMeta: BlockMeta = {};

    abstract canParse(str: string): boolean;

    fabricate(str: string, blockMeta?: BlockMeta): TBlock
    {
        if (blockMeta)
            this.blockMeta = blockMeta;

        return super.fabricate(str);
    }
}

export abstract class BlockObjFactory<TBlock extends Block, TObj = object> extends BlockFactory<TBlock>
{
    abstract objType: string;
    protected abstract parseObj(obj: TObj): TBlock;

    canParse(str: string): boolean
    {
        return str.startsWith('@' + this.objType);
    }

    protected parse(str: string): TBlock
    {
        let yaml = util.skipFirstLine(str); 
        return this.parseObj(YAML.parse(yaml));
    }
}

//#endregion

//#region Inliner Factory

export class InlinerFragment
{
    str: string;
    toParse: boolean;

    constructor(str: string, toParse: boolean)
    {
        this.str = str;
        this.toParse = toParse;
    }
}

export abstract class InlinerFactory<TInliner extends Inliner> extends Factory<TInliner>
{
    abstract getFragments(str: string): InlinerFragment[];
}

export abstract class InlinerRegexpFactory<TInliner extends Inliner> extends InlinerFactory<TInliner>
{
    protected abstract regexp: RegExp;
    protected abstract parseMatch(match: RegExpExecArray): TInliner;

    getFragments(str: string): InlinerFragment[]
    {
        let regexp = new RegExp(this.regexp);

        let ranges: ({ start: number, end: number })[] = [];
        let match: RegExpExecArray;
        while ((match = regexp.exec(str)) !== null)
        {
            if (match.index === regexp.lastIndex) { regexp.lastIndex++; }

            ranges.push({
                start:  match.index,
                end:    match.index + match[0].length
            });
        }

        ranges.push({ start: str.length, end: str.length });

        let fragments: InlinerFragment[] = [];

        let cursor = 0;
        ranges.forEach(range =>
        {
            let text = str.slice(cursor, range.start);
            if (text.length > 0)
                fragments.push(new InlinerFragment(text, false));

            let inlinerText = str.slice(range.start, range.end);
            if (inlinerText.length > 0)
                fragments.push(new InlinerFragment(inlinerText, true));

            cursor = range.end;
        });

        return fragments;
    }

    protected parse(str: string): TInliner
    {
        let match = new RegExp(this.regexp).exec(str);
        return this.parseMatch(match);
    }
}

//#endregion