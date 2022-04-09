import Range from "src/Range";
import util from "src/util";

import { Inliner, InlinerFactory, Plain } from "src/inliner";
import { Block, BlockFactory, Paragraph } from "src/block";

export default class Parser
{
    blockFactories: InstanceType<typeof BlockFactory>[] = [];
    inlineFactories: InstanceType<typeof InlinerFactory>[] = [];

    parseBlock(strBlock: string): Block
    {
        for (let i = 0; i < this.blockFactories.length; i++)
        {
            let blockFactory = this.blockFactories[i];

            if (blockFactory.canParse(strBlock, this))
                return blockFactory.parse(strBlock, this);
        }

        return new Paragraph(strBlock, this);        
    }

    parseBlocks(str: string): Block[]
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
                    blocks.push(this.parseBlock(strObjBlock));
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
                else blocks.push(this.parseBlock(strBlock));
            }
        }

        if (strObjBlock !== '')
            blocks.push(this.parseBlock(strObjBlock));

        return blocks;
    }

    parseInliners(str: string, factories = [...this.inlineFactories]): Inliner[]
    {
        if (factories.length === 0)
            return [new Plain(str)];

        let inliners: Inliner[] = [];

        let factory = factories.shift();

        let ranges = factory.detectRanges(str, this);
            ranges = Range.sortRanges(...ranges);

        if (Range.hasIntersection(...ranges))
            throw new Error(`Ranges intersection in factory '${factory.constructor.name}' when parsing string:\n\n${str}`);

        let start = 0;
        let end = str.length;

        ranges.forEach(range =>
        {
            end = range.start;

            inliners.push(...this.parseInliners(str.substring(start, end), [...factories]));
            inliners.push(factory.parse(str.substring(range.start, range.end), this));

            start = range.end;
            end = str.length;
        });

        let lastFragment = str.substring(start, end);
        if (lastFragment)
            inliners.push(...this.parseInliners(lastFragment, [...factories]));

        return inliners;
    }
}