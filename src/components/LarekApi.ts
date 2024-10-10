import { IOrder, IOrderResult, IProductItem } from "../types";

export interface ILarekApi {
  getProductItems: () => Promise<IProductItem[]>;
  getProduct: (id: string) => Promise<IProductItem>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>
}