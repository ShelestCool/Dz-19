export class Content {
  constructor(container) {
    this.container = container;
    this.data = {};
    this.updateList = null;

    this.handleClickTrashBtn = this._clickTrashBtn.bind(this);

    // this._init();
  }

  // _init() {}

  _clear() {
    this.container.innerHTML = "";
  }

  _createEditButton(id) {
    const btnNode = document.createElement("button");

    btnNode.classList.value = "btn btn-warning";
    btnNode.textContent = "Редактировать";
    btnNode.setAttribute("data-id", id);

    btnNode.addEventListener("click", this._clickEditBtn);

    return btnNode;
  }

  _createTrashButton(id) {
    const btnNode = document.createElement("button");

    btnNode.classList.value = "btn btn-danger ml-2";
    btnNode.textContent = "Удалить";
    btnNode.setAttribute("data-id", id);

    btnNode.addEventListener("click", this.handleClickTrashBtn);

    return btnNode;
  }

  _clickEditBtn(event) {
    const id = event.currentTarget.getAttribute("data-id");
    const form = document.querySelector("#form");
    const titleField = form.querySelector('[name="title"]');
    const contentField = form.querySelector('[name="content"]');
    const idField = form.querySelector('[name="id"]');
    const dateField = form.querySelector('[name="date"]');

    form.setAttribute("data-method", "PUT");

    fetch("/api/data", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        data.list.forEach((item) => {
          if (item.id == id) {
            titleField.value = item.title;
            contentField.value = item.content;
            idField.value = item.id;
            dateField.value = item.date;

            $("#formModal").modal("show");
          }
        });
      })
      .catch((error) => console.error(error));
  }

  _clickTrashBtn(event) {
    const id = event.currentTarget.getAttribute("data-id");
    const isConfirm = confirm("Вы уверены, что хотите удалить пост?");

    if (!isConfirm) return;

    fetch(`/api/data/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        // Очистить контент послу удаления
        this._clear();
        // Если метод для обновления списка передали в этот класс, то можно запустить
        if (this.updateList) {
          this.updateList(data.list);
        }
      })
      .catch((error) => console.error(error));
  }

  render(data, updateList) {
    this.data = data;
    this.updateList = updateList; // Присваиваем к свойству this.updateList колбэк updateList
    const btnEdit = this._createEditButton(this.data.id);
    const btnTrash = this._createTrashButton(this.data.id);
    const template = `
      <h3>${this.data.title}</h3>
      <h6 class="text-muted">${this.data.date}</h6>
      <div>${this.data.html}</div>
    `;

    this._clear();
    this.container.innerHTML = this.container.innerHTML + template;

    const btnWrap = document.createElement("div");
    btnWrap.classList.value = "mt-auto";
    btnWrap.append(btnEdit, btnTrash);
    this.container.append(btnWrap);
  }
}
