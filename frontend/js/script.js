const tbody = document.querySelector("tbody");
const addForm = document.querySelector(".add-form");
const inputTask = document.querySelector(".input-task");

// pegando as tasks no banco de dados
const fetchTasks = async () => {
  const response = await fetch("http://localhost:3333/tasks");
  const tasks = await response.json();
  return tasks;
};

// adiciona um nova task quando o formulário é enviado
const addTask = async (event) => {
  event.preventDefault();
  const task = { title: inputTask.value };

  await fetch("http://localhost:3333/tasks", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  loadTasks();
  inputTask.value = "";
};

// deleta as tasks quando ocorre um clique no botão
const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: "delete",
  });

  loadTasks();
};

const updateTask = async ({ id, title, status }) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status }),
  });

  loadTasks();
};

// formata a data que vem do banco, para o horário local do usuário
const formatDate = (dateUTC) => {
  const options = {
    dateStyle: "long",
    timeStyle: "short",
  };
  const date = new Date(dateUTC).toLocaleString("pt-br", options);
  return date;
};

// função que cria as tags HTML
const createElement = (tag, innerText = "", innerHTML = "") => {
  const element = document.createElement(tag);
  if (innerText) {
    element.innerText = innerText;
  }

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
};

// cria o campo de select com os diferentes status
const createSelect = (value) => {
  const options = `
  <option value="pendente">Pendente</option>
  <option value="em andamento">Em andamento</option>
  <option value="concluído">Concluído</option>
  `;
  const select = createElement("select", "", options);
  select.value = value;
  return select;
};

// cria as linhas da tabela com seu respectivo conteúdo
const createRowTask = (task) => {
  // obtendo os valores contidos em task
  const { id, title, created_at, status } = task;
  // criando a estrutura da tabela
  const tr = createElement("tr");
  const tdTitle = createElement("td", title);
  const tdCreatedAt = createElement("td", formatDate(created_at));
  const tdStatus = createElement("td");
  const tdActions = createElement("td");
  const select = createSelect(status);
  select.addEventListener("change", ({ target }) =>
    updateTask({ ...task, status: target.value })
  );

  const editForm = createElement("form");
  const editInput = createElement("input");

  editInput.value = title;
  editForm.appendChild(editInput);

  const editButton = createElement(
    "button",
    "",
    "<span class='material-symbols-outlined'> edit </span>"
  );
  const deleteButton = createElement(
    "button",
    "",
    "<span class='material-symbols-outlined'> delete </span>"
  );

  // montando os botões
  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  // montando o select
  tdStatus.appendChild(select);

  // adicionando a classe que estiliza os botões
  editButton.classList.add("btn-action");
  deleteButton.classList.add("btn-action");

  deleteButton.addEventListener("click", () => deleteTask(id));

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    updateTask({ id, title: editInput.value, status: status });
  });

  editButton.addEventListener("click", () => {
    tdTitle.innerText = "";
    tdTitle.appendChild(editForm);
  });

  // adicionando o onteúdo a cada linha da tabela
  tr.appendChild(tdTitle);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdStatus);
  tr.appendChild(tdActions);

  return tr;
};

// carrega as tarefas existentes na tabela tasks
const loadTasks = async () => {
  const tasks = await fetchTasks();
  tbody.innerHTML = "";

  tasks.forEach((task) => {
    const tr = createRowTask(task);
    tbody.appendChild(tr);
  });
};

addForm.addEventListener("submit", addTask);

loadTasks();
