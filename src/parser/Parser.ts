import { Block } from "src/block/Block";
import { Inliner } from "src/inliner/Inliner";
import { ParseResult } from "src/parser/ParseResult";
import parseUtils from 'src/parser/util';
import { Heap } from "./Heap";

export class Parser
{
    rootPath: string;
    mustaches: { [key: string]: any };

    blocks: typeof Block[];
    inliners: typeof Inliner[];
                                                                                                                                  
    parse(str: string, parent: ParseResult|Heap = new Heap): ParseResult
    {
        let result = new ParseResult;
            result.heap = parent instanceof ParseResult ? parent.heap : parent;

        if (!str)
            return result;

        str = parseUtils.removeCaret(str);
        str = parseUtils.reduceSpaceLines(str);
        str = parseUtils.removeIndent(str);
        str = str.trim();

        let strBlocks = str.split(/\n{2,}/gm);

        /* ! */ let blocks = [];

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

        //

        blocks.forEach(block =>
        {
            result.heap.blocks.push(block);
            let pushedIndex = result.heap.blocks.length - 1;
            result.blocks.push(result.heap.blocks[pushedIndex]);
        });

        return result;
    }

    private parseStrBlock(strBlock: string, parseResult: ParseResult): Block
    {
        for (let i = 0; i < this.blocks.length; i++)
        {
            let Block = this.blocks[i];

            if (Block.canParse(strBlock))
            {
                //@ts-ignore
                return new Block(strBlock, this, parseResult);
            }
        }

        return null;
    }

    parseInline(str: string, handleInliners: (inliners: Inliner[]) => any)
    {
        let inliners = [];
        this.inliners.forEach(Inliner => str = Inliner.render(str, inliners));
        
        if (handleInliners)
            handleInliners(inliners);

        return str;
    }
}