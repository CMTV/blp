import { Block } from "../block/Block";
export declare abstract class BlockObject extends Block {
    static objType: string;
    abstract parseObj(obj: any): any;
    parse(str: string): void;
    static canParse(str: string): boolean;
}
