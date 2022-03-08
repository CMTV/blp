import { Block } from "../block/Block";
import { Inliner } from "../inliner/Inliner";
import { Heap } from "../parser/Heap";
export declare class ParseResult {
    heap: Heap;
    blocks: Block[];
    inliners: Inliner[];
    handleInliners(inliners: Inliner[]): void;
}
