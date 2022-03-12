import { Heap } from "../parser/Heap";
export declare class ParseResult {
    heap: Heap;
    parent: ParseResult;
    blocks: any[];
    inliners: any[];
}
