export default class BlockMeta
{
    id?:         string;
    classList?:  string[];
    other?:      string[];

    static regexp = /^{(.+)}$/m;

    static createFrom(str: string): BlockMeta
    {
        let metaMatch = str.match(BlockMeta.regexp);

        if (!metaMatch)
            return null;

        if (metaMatch.index !== 0 || metaMatch[0] === str)
            return null;

        let metaParts = metaMatch[1].trim().split(' ').filter(metaPart => metaPart.length > 0);

        if (metaParts.length === 0)
            return null;
        
        let meta = new BlockMeta;
            meta.classList = [];
            meta.other = [];

        metaParts.forEach(metaPart =>
        {
            if (metaPart.startsWith('#'))
            {
                meta.id = metaPart.slice(1);
                return;
            }

            if (metaPart.startsWith('.'))
            {
                meta.classList.push(metaPart.slice(1));
                return;
            } 
            
            meta.other.push(metaPart);
        });

        if (meta.classList.length === 0)    delete meta.classList;
        if (meta.other.length === 0)        delete meta.other;

        return meta;
    }
}