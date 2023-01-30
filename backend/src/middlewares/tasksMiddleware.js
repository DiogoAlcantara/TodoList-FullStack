const validateFieldTitle = (request, response, next) => {
  const { body } = request;

  //verificando se o titulo é undefined
  if (body.title === undefined) {
    return response
      .status(400)
      .json({ message: "The field 'title' is required" });
  }

  //verificando se o título é vazio
  if (body.title === "") {
    return response.status(400).json({ message: "title cannot be empty" });
  }

  //caso esteja tudo OK, parte para a próxima etapa
  next();
};

const validateFieldStatus = (request, response, next) => {
  const { body } = request;

  //verificando se o titulo é undefined
  if (body.status === undefined) {
    return response
      .status(400)
      .json({ message: "The field 'status' is required" });
  }

  //verificando se o título é vazio
  if (body.status === "") {
    return response.status(400).json({ message: "status cannot be empty" });
  }

  //caso esteja tudo OK, parte para a próxima etapa
  next();
};

module.exports = {
  validateFieldTitle,
  validateFieldStatus,
};
