import BlockMeta from "./BlockMeta";
import { FParagraph, FText } from "./default";
import { BlockFactory, InlinerFactory } from "./factory";
import { Block, Inliner } from "./product";
import util from "./util";

export type TFactory<TFactoryType> = (new (parser: Parser) => TFactoryType);

export class Parser
{
    blockFactories: TFactory<BlockFactory<Block>>[] = [];
    inlineFactories: TFactory<InlinerFactory<Inliner>>[] = [];

    productCallback: (products: Block[] | Inliner[]) => void;

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
        let strObjBlockMeta = null;

        for (let i = 0; i < strBlocks.length; i++)
        {
            let strBlock = strBlocks[i];

            let strBlockMeta = BlockMeta.createFrom(strBlock);
            if (strBlockMeta)
                strBlock = util.skipFirstLine(strBlock);

            if (insideObjBlock)
            {
                if (strBlock.search(/\S|$/) > 0)
                    strObjBlock += '\n\n' + strBlock;
                else
                {
                    blocks.push(this.parseBlock(strObjBlock, strObjBlockMeta));
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
                    strObjBlockMeta = strBlockMeta;
                }
                else blocks.push(this.parseBlock(strBlock, strBlockMeta));
            }
        }

        if (strObjBlock !== '')
            blocks.push(this.parseBlock(strObjBlock, strObjBlockMeta));

        blocks = blocks.filter(block => !!block);

        if (this.productCallback)
            this.productCallback(blocks);

        return blocks;
    }

    parseBlock(strBlock: string, meta: BlockMeta): Block
    {
        for (let i = 0; i < this.blockFactories.length; i++)
        {
            let TBlockFactory = this.blockFactories[i];
            let blockFactory = new TBlockFactory(this);

            if (blockFactory.canParse(strBlock))
                return blockFactory.fabricate(strBlock, meta);
        }

        return new FParagraph(this).fabricate(strBlock, meta);
    }

    parseInliners(str: string): Inliner[]
    {
        let resultArr: (string | Inliner)[] = [str];

        this.inlineFactories.forEach(TInlinerFactory =>
        {
            let inlinerFactory = new TInlinerFactory(this);
            let insertMap = {};

            for (let i = 0; i < resultArr.length; i++)
            {
                let strPart = resultArr[i];

                if (typeof strPart !== 'string')
                    continue;

                let fragments = inlinerFactory.getFragments(strPart);

                insertMap[i] = fragments.map(fragment => fragment.toParse ? inlinerFactory.fabricate(fragment.str) : fragment.str);
            }

            resultArr = resultArr.flatMap((item, i) =>
            {
                if (i in insertMap)
                    return insertMap[i];

                return item;
            });
        });

        let inliners = resultArr
                            .map(item => typeof item === 'string' ? new FText(this).fabricate(item) : item)
                            .filter(item => !!item);

        if (this.productCallback)
            this.productCallback(inliners);

        return inliners;
    }
}