import Range from "src/Range";
import util from "src/util";

import { Inliner, InlinerFactory, Plain } from "src/inliner";
import { Block, BlockFactory, Paragraph } from "src/block";
import BlockMeta from "src/BlockMeta";

export class Context
{
    parser: Parser;
    extra: object;

    static createFrom(parser: Parser, extra: object = {}): Context
    {
        let ctx = new Context;
            ctx.parser = parser;
            ctx.extra = extra;

        return ctx;
    }
}

export default class Parser
{
    blockFactories: InstanceType<typeof BlockFactory>[] = [];
    inlineFactories: InstanceType<typeof InlinerFactory>[] = [];

    productCallback: (products: Block[] | Inliner[]) => void;

    parseBlock(strBlock: string, extra: object): Block
    {
        for (let i = 0; i < this.blockFactories.length; i++)
        {
            let blockFactory = this.blockFactories[i];

            let meta = BlockMeta.createFrom(strBlock);
            if (meta)
                strBlock = strBlock.substring(strBlock.indexOf('\n') + 1);

            let context = Context.createFrom(this, extra);

            if (blockFactory.canParse(strBlock, context))
                return blockFactory.parse(strBlock, context, meta);
        }

        return new Paragraph(strBlock, this);        
    }

    parseBlocks(str: string, extra: object = {}): Block[]
    {
        if (!str)
            return [];

        str = util.removeCaret(str);
        str = util.reduceSpaceLines(str);
        str = util.removeIndent(str);
        str = str.trim();

        let blocks: Block[] = [];

        let strBlocks = str.split(/\n{2,}/gm);
        let insideObjBlock = false;
        let strObjBlock = '';

        for (let i = 0; i < strBlocks.length; i++)
        {
            let strBlock = strBlocks[i];

            if (insideObjBlock)
            {
                if (strBlock.search(/\S|$/) > 0)
                    strObjBlock += '\n\n' + strBlock;
                else
                {
                    blocks.push(this.parseBlock(strObjBlock, extra));
                    strObjBlock = '';
                    insideObjBlock = false;
                }
            }

            if (!insideObjBlock)
            {
                if (strBlock.charAt(0) === '@')
                {
                    insideObjBlock = true;
                    strObjBlock += strBlock;
                }
                else blocks.push(this.parseBlock(strBlock, extra));
            }
        }

        if (strObjBlock !== '')
            blocks.push(this.parseBlock(strObjBlock, extra));

        this.productCallback(blocks);

        return blocks;
    }

    parseInliners(str: string, extra: object = {}, factories = [...this.inlineFactories]): Inliner[]
    {
        if (factories.length === 0)
            return [new Plain(str)];

        let inliners: Inliner[] = [];

        let factory = factories.shift();

        let context = Context.createFrom(this, extra);

        let ranges = factory.detectRanges(str, context);
            ranges = Range.sortRanges(...ranges);

        if (Range.hasIntersection(...ranges))
            throw new Error(`Ranges intersection in factory '${factory.constructor.name}' when parsing string:\n\n${str}`);

        let start = 0;
        let end = str.length;

        ranges.forEach(range =>
        {
            end = range.start;

            inliners.push(...this.parseInliners(str.substring(start, end), [...factories]));
            inliners.push(factory.parse(str.substring(range.start, range.end), context));

            start = range.end;
            end = str.length;
        });

        let lastFragment = str.substring(start, end);
        if (lastFragment)
            inliners.push(...this.parseInliners(lastFragment, extra, [...factories]));

        this.productCallback(inliners);

        return inliners;
    }
}