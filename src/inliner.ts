import Product from "src/Product";
import Range from "src/Range";
import Parser from "src/Parser";
import IFactory from "src/IFactory";

export abstract class Inliner extends Product {}

export class Plain extends Inliner
{
    _type = "plain";
    
    text: string;

    constructor(text: string)
    {
        super();
        this.text = text;
    }
}

//
//
//

export abstract class InlinerFactory<TInliner extends Inliner> implements IFactory<TInliner>
{
    abstract detectRanges(str: string, parser: Parser): Range[];
    abstract parse(str: string, parser: Parser): TInliner;    
}

export abstract class InlinerRegExpFactory<TInliner extends Inliner> extends InlinerFactory<TInliner>
{
    abstract regexp: RegExp;
    abstract parseMatch(match: RegExpExecArray, parser: Parser): TInliner;

    detectRanges(str: string): Range[]
    {
        this.regexp.lastIndex = 0;

        let ranges: Range[] = [];
        let match: RegExpExecArray;

        while ((match = this.regexp.exec(str)) !== null)
        {
            if (match.index === this.regexp.lastIndex) { this.regexp.lastIndex++; }

            ranges.push(
                new Range(
                    match.index,
                    match.index + match[0].length
                )
            );
        }

        return ranges;
    }

    parse(str: string, parser: Parser): TInliner
    {
        let match = this.regexp.exec(str);
        this.regexp.lastIndex = 0;
        
        return this.parseMatch(match, parser);
    }
}