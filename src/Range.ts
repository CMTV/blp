export default class Range
{
    start: number;
    end: number;

    constructor(start: number, end: number = null)
    {
        this.start = start;
        this.end = end;

        if (end === null)
        {
            this.end = start;
            this.start = 0;
        }

        if (this.start > this.end)
            throw new Error('Range `start` is bigger than `end`!');
    }

    static sortRanges(...ranges: Range[])
    {
        return [...ranges].sort((a, b) => a.start - b.start);
    }

    static hasIntersection(...sortedRanges: Range[])
    {
        for (let i = 0, j = 1; j < sortedRanges.length; i++, j++)
        {
            if (sortedRanges[i].end > sortedRanges[j].start)
                return true;
        }

        return false;
    }
}