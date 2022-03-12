declare type ParseListener<TProduct> = (product: TProduct) => void;
export declare abstract class Factory<TProduct extends object> {
    private parseListeners;
    fireParseListeners(product: TProduct): void;
    addParseListener(listener: ParseListener<TProduct>): void;
    removeParseListener(listener: ParseListener<TProduct>): void;
}
export {};
