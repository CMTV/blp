import { Block } from "src/block/Block";
import { Inliner } from "src/inliner/Inliner";
import { Heap } from "src/parser/Heap";

export class ParseResult
{
    heap: Heap;
    blocks: Block[] = [];
    inliners: Inliner[] = [];

    handleInliners(inliners: Inliner[])
    {
        inliners.forEach(inliner =>
        {
            this.heap.inliners.push(inliner);
            let pushedIndex = this.heap.inliners.length - 1;
            this.inliners.push(this.heap.inliners[pushedIndex]);
        });
    }
}