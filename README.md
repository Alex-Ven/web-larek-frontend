# Проектная работа "Веб-ларек"

## Используемый стек:
HTML, SCSS, TS, Webpack

### Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

### Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Описание данных и типов данных используемых в приложении

Интерфейс и типы данных, описывающих карточку товара

```

interface IProductItem {
id: string;
title: string;
image: string;
category: string;
description: string;
price: number | null;
}

type IBasketProduct = Pick<IProductItem, 'id' | 'title' | 'price'>;
type ICatalogProduct = Pick<IProductItem, 'id' | 'title' | 'price' | 'image' | 'category'>
```

Интерфейс и типы данных, описывающих данные покупателя

```
interface IUserInfo {
	payment: string;
	address: string;
	email: string;
	phone: string;
	}
```

Интерфейс, описывающий поля форм заказа товара и объеденяющий поля

```
	type IDeliveryForm = Pick<IUserInfo, 'payment' | 'address'>;
	type IOrderForm = Pick<IUserInfo, 'email' | 'phone'>;
  type IOrderForm = IDeliveryForm & IContactsForm;
```

Интерфейс, описывающий оформление заказа

```
interface IOrder {
	items: string[];
	total: number;
}
```

Интерфейс описывающий результат оформления заказа

```

interface IOrderResult {
	id: string;
	total: number;
}
```
Тип, описывающий ошибки валидации форм

```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Интерфейс, для хранения актуального состояния приложения

```
interface IAppState {
	catalog: ICatalogProduct[];
	basket: IBasketProduct[];
	preview: string | null;
	order: IOrder | null;
	orderResponse: IOrderResult | null;
	loading: boolean;
}
```

  
## Архитектура проекта.

При построении архитектуры, применяем слои, согласно парадигме MVP:

- Слой данных (`Model`), бизнес-логика, отвечает за хранение изменение данных, взаимодействуя с серверным API, генерирует событие.
- Слой представления (`View)`, отвечает за отображение данных на странице, реагирует на действие пользователя и генерирует событие.
- Слой презентера (`Presenter`), отвечает за связь отображения и модели данных, обрабатывает событие и вызывает метод модели для изменения данных.

### Описание базовых классов, их предназначение и функции

### Класс Api 

Класс Api содержит в себе базовую логику и отправку запросов.

В полях класса хранятся следующие данные:

- baseUrl: string; - Базовый URL для Api
- options: RequestInit; - Опции для fetch

`constructor` — в конструктор передаётся базовый адрес сервера и опциональный объект с загаловками запросов. 

Методы:

- `get` - выполняет Get запрос на переданный в параметрах эндпоинт.

- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданый как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запрос может быть перед определённым заданием третьего параметра при вызове.

- `handleResponse` — обрабатывает ответ от сервера, проверяет его статус. Если статус успешный (ок), возвращает промис с данными (объектом, который отправил сервер). В противном случае, возвращает ошибку с сообщением об ошибке.


### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на событие, происходящие в системе. Класс используются в призентере для обработки событий и слоях приложения для генерации событий.

Основные методы реализуемые классом описаны интерфейсом `IEvents`.
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `onAll` — предоставляет возможность подписаться на все события;
- `offAll` — удаляет все зарегистрированные обработчики для всех событий;
- `trigger` — создаёт коллбэк-триггер, генерирующий указанное событие при вызове.

Инициализация и подписка на события. Компоненты, такие как Basket, Card, Form, Order, Page, и другие, инициализируются с экземпляром EventEmitter. При инициализации, компоненты подписываются на определенные события с помощью метода on;
Генерация и передача событий. Различные действия пользователей, например: добавление товара в корзину, отправка данных формы заказа, клик на кнопку закрытия модального окна и т. д., инициируются в компонентах. Когда происходят эти действия, компоненты используют метод emit для генерации событий с соответствующими данными;
Обработка событий. Другие компоненты, которые подписаны на эти события, получают уведомления. Например, при добавлении товара в корзину, компонент Basket подписан на событие и обновляет список выбранных товаров и общую стоимость. При отправке данных формы заказа, компонент Order подписан на событие и обрабатывает введенные данные;
Удаление обработчиков событий. При необходимости компоненты могут снять подписку на определенные события, используя метод off;
Групповая подписка и отписка от событий: Методы onAll и offAll предоставляют возможность подписаться на все события или отписаться от всех событий соответственно.

### Слой данных

### Класс AppState 
Класс отражающий полный функционал приложения и 
отвечает за хранение и логику работы с данными карточек товаров,
корзины, заказа, предпросмотра товаров, ошибок форм.

В полях класса хранятся следующие данные:

- catalog: ICatalogProduct[] - массив объектов карточек товаров,
- basket: IBasketProduct[] - массив товаров в корзине,
- _preview: string | null - id карточки выбранной для просмотра в модальном окне,
- order: IOrder | null - данные оформляемого заказа,
- loading: boolean - указывает состояние загрузки данных;
- formErrors: FormErrors - объект с ошибками валидации форм.


Так же класс предоставляет набор методов для взаимодействия с этими данными

- addToBasket(item: IBasketProduct) - добавление товара в корзину
- removeFromBasket(item: IBasketProduct) - удаление товара из корзины
- clearBasket() - очистка корзины при сбросе формы
- getTotal(): number - подсчет общей суммы товаров в корзине
- setCatalog(products: ICard[]) - установка каталога товаров
- validateOrderForm() - валидация полей со способом оплаты и контактов
- setPreview(item: ICard) - показ товаров
- setOrderField(field: keyof IOrder, value: string | number) - устанавливает значение поля заказа для проверки валидности формы контактов


### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

### Класс Modal

Реализует модальное окно. Предоставляет методы `open`, `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального по клику вне модального окна, по оверлей, и по клику на иконку «Закрыть» (крестик).

Поля класса

- _content: HTMLElement - HTML элемент для отображения контента в модальном окне.
_closeButton: HTMLButtonElement - HTML кнопка для закрытия модального окна.

- constructor(container: HTMLElement, protected events: IEvents) - принимает контейнер с элементами модального окна и экземпляр класса `EventEmitter` для возможности инициации событий.

Так же класс предоставляет набор методов

 - `set` content — устанавливает контента модального окна,
- `open` — открывает модальное окно,
- `close` — закрывает модальное окно,
- `render` — рендерит модальное окно с передачей данных о контенте.

### Класс Card

Представляет компонент карточки товара. Он используется для отображения информации о товаре на странице сайта, включая название, изображение, цену, категорию, описание и кнопки для взаимодействия.В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми генерируются соответствующее события.

Поля класса содержат элементы разметки элементов карточки.

- _basketCardIndex?: HTMLElement; - индивидуальный идентификатор карточки
- _description?: HTMLElement - описание карточки товара
- _image?: HTMLImageElement - картинка товара
 - _title: HTMLElement - название карточки товара
 - _category?: `Record<string, string>` - категория карточки товара
- _price: HTMLElement - цена товара
- _button?: HTMLButtonElement - кнопка добавления
 - _buttonTitle: string - текст кнопки

 - constructor - принимает имя блока строка, указывающая на имя блока (класс CSS) для элементов карточки товара, HTML элемент, в который будет встроен компонент карточки товара, и объект событий для обработки действий пользователя, содержащий действие для кнопки карточки товара (например, обработчик события клика).

 Так же класс предоставляет набор методов

 - disableButton - проверяет на бесценный товар и отключает кнопку карточки товара, если цена не указана (null)

 - а так же сеттеры и геттеры для устанавления и получения значений у свойства товаров.

### Basket

Класс Basket для отображения списка выбранных товаров, их общей стоимости в корзине и кнопку для оформления заказа

- constructor - принимает container - HTML элемент, в который будет встроен компонент корзины и экземпляр IEvents, используемый для обработки событий.


Поля класса 

- _list: HTMLElement - HTML элемент для отображения коллекции товаров в корзине,
- _total: HTMLElement - HTML элемент для отображения общей стоимости товаров в корзине,
- _button: HTMLButtonElement - HTML элемент кнопки оформления заказа

Методы - сеттеры

- set items(items: HTMLElement[]) - устанавливает список товаров в корзине,
- set selected(items: string[]) - блокирует / разблокирует кнопку оформления заказа в зависимости от наличия товаров в корзине,
- set total(price: number) - устанавливает общую стоимость товаров в корзине.

### Класс Order

Класс оформления заказа Order, предоставляет методы для установки значений телефона, электронной почты, а так же адреса и выбора оплаты в контейнер

- constructor - принимает container - HTML родительский элемент и экземпляр IEvents, используемый для обработки событий. 

Поля класса

- _payment: HTMLButtonElement[] - элемент для отображения кнопок оплаты, картой или наличными.

Так же класс предоставляет набор сеттеров для установки значений телефона, электронной почты, а так же адреса и метода выбора способа оплаты.

- set address(value: string) - устанавливает адрес доставки,
- set email(value: string) - устанавливает электронную почту,
- set phone(value: string) - устанавливает номер телефона,
- selected(name: string) - устанавливает выбранный метод оплаты.


### Класс Form

Класс Form обеспечивает взаимодействие с формой, ввода данных с возможностью валидации и отображения ошибок в форме.

- constructor - принимает container - HTML элемент формы и экземпляр IEvents, используемый для обработки событий. 

Поля класса

- _submit: HTMLButtonElement- элемент для отображения кнопки отправки формы
- _errors: HTMLElement- элемент для отображения ошибок валидации форм.

Методы 

- onInputChange — обрабатывает изменения значений в поле формы,
- set valid — устанавливает состояние кнопки отправки формы (активна/неактивна),
- set errors — устанавливает текст ошибки валидации формы.
- render — обновляет состояние формы и возвращает HTML элемент формы, с передачей данных о состоянии и ошибках, если они есть.


### Класс Page

Класс Page представляет страницу интерфейса.  Он содержит элементы страницы, такие как, каталог товаров, обертку страницы, элемент корзины и счетчик товаров в корзине, и обеспечивает их отображение и взаимодействие с помощью событий. и включает методы для обновления этих свойств.

- constructor - принимает container - HTML элемент страницы и экземпляр IEvents, используемый для обработки событий. 

Поля класса

- _wrapper: HTMLElement - элемент для отображения самой страница
- _catalog: HTMLElement - элемент для отображения каталога товаров
- _basket: HTMLElement - элемент для отображения корзины
- _counter: HTMLElement - элемент для отображения счетчика элементов в корзине

Так же класс предоставляет набор методов - сеттеров для счетчика товаров в корзине, размещения товаров на странице и блокировки страницы.

### Класс Success

Класс Success используется для отображения сообщения об успешном оформлении заказа.

Поля класса

- _closeButton: HTMLElement - HTML элемент кнопки закрытия сообщения
- _total: HTMLElement - HTML элемент для отображения общей цены об успешной операции.

- constructor - принимает container - HTML элемент для отображения компонента и объект с действиями, для обработки событий клика. 

Так же класс предоставляет метод - сеттер который устанавливает текстовое содержимое элемента - общая стоимость заказа.


### Слой коммуникации

### Класс LarekApi 
Класс LarekApi для взаимодействие с бэкендом, наследует класс Api и реализует обмен данными с севрером, принимает список товаров, получает карточку товара, и отправляет заказ.

- constructor — принимает API_URL, CDN_URL и дополнительные опции запроса;


Так же класс предоставляет набор методов:

 - getProductItems (): `Promise<IProductItem[]>`: Отправляет запрос на сервер для получения списка всех товаров
- order(order: IOrder): Promise<IOrderResult>: Отправляет запрос на сервер для оформления заказа с указанными данными

### Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.

Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий.

В файле `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе*

- `items:changed` - Инициируется при изменении списка товаров и вызывает перерисовку списка товаров на странице.
- `card:select` - Инициируется при клике на карточку товара и приводит
к открытию модального окна с подробным описанием товара.
- `basket:open` -  Инициируется при клике на кнопку "корзина" и открывает модальное окно с классом Basket, где отображаются товары добавленные в корзину.
- `basket:changed` - Инициируется при изменении содержимого корзины и ее общей стоимости.
- `counter:changed` - Инициируется при изменении количества товаров в корзине.
- `product:add` - Инициируется при добавлении товара в корзину.
- `product:delete` - Инициируется при удалении товара из корзины.
- `preview:changed` - Инициируется при отображении предварительной информации о товаре перед добавлением в корзину.
- `order:open` - Инициируется при открытии модального окна для оформления заказа.
- `order.payment:change` - Инициируется при изменении способа оплаты в форме заказа.
- `order.address:change` - Инициируется при изменении поля адреса в форме заказа.
- `formErrors:change` - Инициируется при изменении ошибок валидации форм.
- `order:submit` - Инициируется при попытке отправки формы заказа.
- `/^order\..*:change/`- Инициируется при изменении полей информации в форме оплаты и адреса доставки заказа.
- `/^contacts\..*:change/` - Инициируется при изменении полей контактной информации в форме заказа.
- `contacts:submit` - Инициируется при попытке отправки формы контактной информации.
- `modal:open` - Инициируется при открытии модального окна.
- `modal:close` - Инициируется при закрытии модального окна.
- `card:toBasket` - Инициируется при клике на кнопку "корзина" и открывает модальное окно
    с классом Basket, где отображаются товары добавленные в корзину.