import { BlockFactory, InlinerFactory, InlinerFragment } from "./factory";
import { Block, Inliner } from "./product";

//#region Default Block

export class Paragraph extends Block
{
    _type = 'paragraph';
    content: Inliner[];
}

export class FParagraph extends BlockFactory<Paragraph>
{
    canParse(): boolean
    {
        return true;
    }

    protected parse(str: string): Paragraph
    {
        let paragraph = new Paragraph;
            paragraph.content = this.parser.parseInliners(str);

        return paragraph;
    }
}

//#endregion

//#region Default Inliner

export class Text extends Inliner
{
    _type = 'text';
    content: string;
}

export class FText extends InlinerFactory<Text>
{
    getFragments(str: string): InlinerFragment[]
    {
        return [new InlinerFragment(str, true)];
    }

    protected parse(str: string): Text
    {
        let text = new Text;
            text.content = str;

        return text;
    }
}

//#endregion