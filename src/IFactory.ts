import { Context } from "src/Parser";
import Product from "src/Product";

export default interface IFactory<TProduct extends Product>
{
    parse(str: string, ctx: Context): TProduct;
}