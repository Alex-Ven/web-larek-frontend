
import { IProductItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";

export interface ICardAction {
  onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProductItem {
	basketCardIndex?: string;
	buttonTitle?: string;
}

export class Card<T> extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _basketCardIndex?: HTMLElement;
  protected _buttonTitle?: HTMLButtonElement;
  

  private categoryKey: Record<string, string> = {
    'хард-скил': '_hard',
    'софт-скил': '_soft',
  дополнительное: '_additional',
  кнопка: '_button',
  другое: '_other',
  }

  constructor(container: HTMLElement, action?: ICardAction) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.card__title`, container);
    this._image = container.querySelector('.card__image');
    this._price = ensureElement<HTMLElement>(`.card__price`, container);
    this._category = container.querySelector(`.card__category`);
    this._description = container.querySelector(`.card__text`);
    this._button = container.querySelector(`.card__button`);
    this._basketCardIndex = container.querySelector('.basket__item-index');

    if (action?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", action.onClick);
      } else {
        container.addEventListener("click", action.onClick);
      }
    }
  }

  disableButton(value: number | null) {
    if (!value) {
      if(this._button) {
        this._button.disabled = true;
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || "";
  }

  set basketCardIndex(value: string) {
		this._basketCardIndex.textContent = value;
	}

	get basketCardIndex(): string {
		return this._basketCardIndex.textContent || '';
	}

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || "";
  }

  set buttonTitle(value: string) {
    if(this._button) {
      this._button.textContent = value;
    }
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set price(value: number | null) {
    this.setText(this._price, (value) ? `${value.toString()} синапсов` : 'Бесценно');
    this.disableButton(value);
    }

  get price(): number {
    return Number(this._price.textContent || '');
  }

  set category(value: string) {
    this.setText(this._category, value);
    const category = this._category.classList[0];
    this._category.className = '';
    this._category.classList.add(`${category}`);
    this._category.classList.add(`${category}${this.categoryKey[value]}`)
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description.replaceWith(...value.map(str => {
        const descTemplate = this._description.cloneNode() as HTMLElement;
        this.setText(descTemplate, str);
        return descTemplate;
      }))
    } else {
      this.setText(this._description, value);
    }
  }
}

