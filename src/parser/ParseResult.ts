import { Heap } from "src/parser/Heap";

export class ParseResult
{
    heap: Heap;
    parent: ParseResult;
    blocks = [];
    inliners = [];
}