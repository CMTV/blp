import { Block } from "src/block/Block";
import { Inliner } from "src/inliner/Inliner";

export class Heap
{
    blocks: Block[] = [];
    inliners: Inliner[] = [];
}