const axiosInstance = require("./axiosInstance");
const Ajv = require("ajv");

const ajv = new Ajv();

const userListSchema = {
  type: "object",
  properties: {
    page: { type: "integer" },
    per_page: { type: "integer" },
    total: { type: "integer" },
    total_pages: { type: "integer" },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          email: { type: "string" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          avatar: { type: "string" },
        },
        required: ["id", "email", "first_name", "last_name", "avatar"],
      },
    },
  },
  required: ["page", "per_page", "total", "total_pages", "data"],
};

const singleUserSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        id: { type: "integer" },
        email: { type: "string" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        avatar: { type: "string" },
      },
      required: ["id", "email", "first_name", "last_name", "avatar"],
    },
  },
  required: ["data"],
};

const createUserSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    job: { type: "string" },
    id: { type: "string" },
    createdAt: { type: "string" },
  },
  required: ["name", "job", "id", "createdAt"],
};

const updateUserSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    job: { type: "string" },
    updatedAt: { type: "string" },
  },
  required: ["name", "job", "updatedAt"],
};

describe("GET /users", () => {
  it("Получение списка пользователей со статусом 200", async () => {
    const response = await axiosInstance.get("/users?page=2");
    expect(response.status).toBe(200);

    const validate = ajv.compile(userListSchema);
    const valid = validate(response.data);
    expect(valid).toBe(true);
  });

  it("Получение 404 для несуществующего эндпоинта", async () => {
    try {
      await axiosInstance.get("/unknown-endpoint");
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

describe("POST /users", () => {
  it("Создание нового пользователя со статусом 201", async () => {
    const response = await axiosInstance.post("/users", {
      name: "bogdan",
      job: "leader",
    });
    expect(response.status).toBe(201);

    const validate = ajv.compile(createUserSchema);
    const valid = validate(response.data);
    expect(valid).toBe(true);
  });

  it("Получение 400 для некорректного запроса при создании", async () => {
    try {
      await axiosInstance.post("/users", {});
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });
});

describe("PUT /users/:id", () => {
  it("Обновление пользователя со статусом 200", async () => {
    const response = await axiosInstance.put("/users/2", {
      name: "bogdan",
      job: "rasskazov",
    });
    expect(response.status).toBe(200);

    const validate = ajv.compile(updateUserSchema);
    const valid = validate(response.data);
    expect(valid).toBe(true);
  });
});

describe("DELETE /users/:id", () => {
  it("Удаление пользователя со статусом 204", async () => {
    const response = await axiosInstance.delete("/users/2");
    expect(response.status).toBe(204);
  });
});

describe("GET /users/:id", () => {
  it("Получение пользователя по ID со статусом 200", async () => {
    const response = await axiosInstance.get("/users/2");
    expect(response.status).toBe(200);

    const validate = ajv.compile(singleUserSchema);
    const valid = validate(response.data);
    expect(valid).toBe(true);
  });

  it("Получение 404 для несуществующего пользователя", async () => {
    try {
      await axiosInstance.get("/users/23");
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  it("Несоответствие схеме для некорректного ответа получения пользователя", async () => {
    const response = await axiosInstance.get("/users/2");
    const invalidSchema = {
      type: "object",
      properties: {
        blah: {},
      },
      required: ["blah"],
    };
    const validate = ajv.compile(invalidSchema);
    const valid = validate(response.data);
    expect(valid).toBe(false);
  });
});
