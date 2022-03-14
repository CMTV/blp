type ParseListener<TProduct> = (product: TProduct) => void;

export abstract class Factory<TProduct>
{
    private parseListeners: ParseListener<TProduct>[] = [];

    fireParseListeners(product: TProduct)
    {
        this.parseListeners.forEach(listener => listener(product));
    }

    addParseListener(listener: ParseListener<TProduct>)
    {
        this.parseListeners.push(listener);
    }

    removeParseListener(listener: ParseListener<TProduct>)
    {
        for (let i = 0; i < this.parseListeners.length; i++)
        {
            if (this.parseListeners[i] === listener)
            {
                this.parseListeners.splice(i, 1);
                i--;
            }
        }
    }
}