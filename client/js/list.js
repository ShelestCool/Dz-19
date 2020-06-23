import { Content } from "./content";

export class List {
  constructor(container) {
    this.container = container;
    this.activeItemId = null;
    this.data = [];
    this.content = new Content(document.querySelector("#content"));

    this.handleClickList = this._clickList.bind(this);

    this._init();
  }

  _init() {
    this.container.addEventListener("click", this.handleClickList);
  }

  _clear() {
    this.container.innerHTML = "";
  }

  _removeActive() {
    if (!this.activeItemId) return;

    const target = this.container.querySelector(
      `[data-id="${this.activeItemId}"]`
    );

    target.classList.remove("active");
  }

  _selectListItem(id) {
    const target = this.container.querySelector(`[data-id="${id}"]`);

    // После удаления этот элемент теряется, надо сделать проверку
    if (target) {
      this._removeActive();
      this.activeItemId = id;
      target.classList.add("active");
    } else {
      // Если элемент удалён надо обнулить это свойство
      this.activeItemId = null;
    }

    this.data.forEach((item) => {
      if (id == item.id) {
        // Передаём метод для рендера списка, чтобы там вызывать его для обновления
        // Надо передать контекст вызова, this.render использует свойства из текущего класса
        // Если не сделать bind мы потеряем свойства, которые хранятся в этом классе
        this.content.render(item, this.render.bind(this));
      }
    });
  }

  _clickList(event) {
    const target = event.target;

    if (target.classList.value.includes("list-item")) {
      const id = target.getAttribute("data-id");

      this._selectListItem(id);
    }
  }

  render(data) {
    this.data = data;
    this._clear();

    this.data.forEach((item) => {
      const template = `
        <div class="list-item p-3" data-id="${item.id}">
          <h5>${item.title}</h5>
          <small>${item.date}</small>
        </div>
      `;

      this.container.innerHTML = this.container.innerHTML + template;
    });

    if (this.activeItemId) {
      this._selectListItem(this.activeItemId);
    }
  }
}
