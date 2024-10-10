//Интерфейс и типы данных, описывающих карточку товара

export interface IProductItem {
	id: string;
	title: string;
	image: string;
	category: string;
	description: string;
	price: number | null;
}

export type IBasketProduct = Pick<IProductItem, 'id' | 'title' | 'price'>;
export type ICatalogProduct = Pick<
	IProductItem,
	'id' | 'title' | 'price' | 'image' | 'category'
>;


//Интерфейс и типы данных, описывающих данные покупателя

export interface IUserInfo {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export type IDeliveryForm = Pick<IUserInfo, 'payment' | 'address'>;
export type IOrderForm = Pick<IUserInfo, 'email' | 'phone'>;


//Интерфейс, описывающий поля заказа товара и объеденяющий поля

export interface IOrder {
	items: string[];
	total: number;
}


//Интерфейс описывающий оформление заказа

export interface IOrderResult {
	id: string;
	total: number;
}


//Тип, описывающий ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;


//Интерфейс, для хранения актуального состояния приложения

export interface IAppState {
	catalog: IProductItem[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	orderResponse: IOrderResult | null;
	loading: boolean;
}
