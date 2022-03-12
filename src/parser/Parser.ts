import { BlockFactory } from "src/factory/BlockFactory";
import { InlinerFactory } from "src/factory/InlinerFactory";
import { ParseResult } from "src/parser/ParseResult";
import { Heap } from "src/parser/Heap";
import parseUtil from "src/parser/util";

export class Parser
{
    meta: object;

    fBlocks: BlockFactory<any>[] = [];
    fInliners: InlinerFactory<any>[] = [];

    parse(str: string, parent: ParseResult = null): ParseResult
    {
        let result = new ParseResult;
            result.parent = parent;
            result.heap = parent ? parent.heap : new Heap;

        if (!str)
            return result;

        str = parseUtil.removeCaret(str);
        str = parseUtil.reduceSpaceLines(str);
        str = parseUtil.removeIndent(str);
        str = str.trim();

        let strBlocks = str.split(/\n{2,}/gm);

        let blocks = [];

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
                    blocks.push(this.parseStrBlock(strObjBlock, result));
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
                else blocks.push(this.parseStrBlock(strBlock, result));
            }
        }

        if (strObjBlock !== '')
            blocks.push(this.parseStrBlock(strObjBlock, result));

        blocks.forEach(block =>
        {
            result.blocks.push(block);
            result.heap.blocks.push(block);
        });

        return result;
    }

    parseStrBlock(strBlock: string, parseResult: ParseResult)
    {
        for (let i = 0; i < this.fBlocks.length; i++)
        {
            let fBlock = this.fBlocks[i];

            if (fBlock.canParse(strBlock))
                return fBlock.parse(strBlock, this, parseResult);
        }

        return null;
    }

    parseInline(str: string, parseResult: ParseResult = null): string
    {
        let inliners = [];
        let listener = (inliner: any) => inliners.push(inliner);

        this.fInliners.forEach(fInliner =>
        {
            if (fInliner.essential)
                fInliner.addParseListener(listener);

            str = fInliner.render(str, this, parseResult);
            
            fInliner.removeParseListener(listener);
        });

        if (parseResult)
        {
            parseResult.inliners = parseResult.inliners.concat(inliners);
            parseResult.heap.inliners = parseResult.heap.inliners.concat(inliners);
        }

        return str;
    }

    render(blocks: ParseResult | any[])
    {
        if (!Array.isArray(blocks))
            blocks = blocks.blocks;

        let str = '';

        blocks.forEach(block =>
        {
            str += this.renderBlock(block);
        });

        return str.replace(/>[\s]+</gm, '><');
    }

    renderBlock(block)
    {
        for (let i = 0; i < this.fBlocks.length; i++)
        {
            let fBlock = this.fBlocks[i];

            if (fBlock.canRender(block))
                return fBlock.render(block, this);
        }

        return null;
    }
}