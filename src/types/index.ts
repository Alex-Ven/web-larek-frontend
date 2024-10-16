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


//Интерфейс, описывающий поля форм заказа товара и объеденяющий поля

export type IDeliveryForm = Pick<IUserInfo, 'payment' | 'address'>;
export type IContactsForm = Pick<IUserInfo, 'email' | 'phone'>;
export type IOrderForm = IDeliveryForm & IContactsForm;

//Интерфейс описывающий оформление заказа

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

//Интерфейс описывающий результат оформления заказа

export interface IOrderResult {
	id: string;
	total: number;
}
export type ISuccess = Pick<IOrderResult, 'total'>;


//Тип, описывающий ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;


//Интерфейс, для хранения актуального состояния приложения

export interface IAppState {
	catalog: ICatalogProduct[];
	basket: IBasketProduct[];
	preview: string | null;
	order: IOrder | null;
	orderResponse: IOrderResult | null;
	loading: boolean;
}
