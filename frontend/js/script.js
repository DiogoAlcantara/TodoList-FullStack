const tbody = document.querySelector("tbody");
const addForm = document.querySelector(".add-form");
const inputTask = document.querySelector(".input-task");

// pegando as tasks no banco de dados
const fetchTasks = async () => {
  const response = await fetch("http://localhost:3333/tasks");
  const tasks = await response.json();
  return tasks;
};

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
  const tdCreatedAt = createElement("td", created_at);
  const tdStatus = createElement("td");
  const tdActions = createElement("td");
  const select = createSelect(status);
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

  tasks.forEach((task) => {
    const tr = createRowTask(task);
    tbody.appendChild(tr);
  });
};

addForm.addEventListener("submit", addTask);

loadTasks();
