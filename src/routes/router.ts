import { FastifyInstance, FastifyRequest } from "fastify";
import { Product, UpdateProduct } from "../interfaces/products.js";
import { CreateUser, ModifyUser, UpdateUser } from "../interfaces/users.js";
import { UserService } from "../services/users.js";
import { Decimal } from "@prisma/client/runtime/library";
import { ProductService } from "../services/products.js";
import { AuthMiddleware } from "../middlewares/auth.js";
import { StockMovementService } from "../services/stock.js";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const productsRoutes = async (fastify: FastifyInstance) => {
  const productService = new ProductService();
  fastify.addHook("onRequest", AuthMiddleware);

  fastify.post<{
    Body: {
      name: string;
      description?: string;
      price: Decimal;
      stock?: number;
    };
  }>("/", async (req, reply) => {
    if (!req.userId)
      return reply.code(401).send({ error: "usuário não autenticado" });

    const ownerId = req.userId;
    const { name, description, price, stock } = req.body;
    const data = { name, description, price, stock, ownerId };

    const result = await productService.create(data);

    if (!result) return reply.code(400).send({ error: "produto já existe" });

    return reply
      .code(201)
      .send({ message: "produto criado com sucesso", product: result });
  });

  fastify.get("/", async (req, reply) => {
    if (!req.userId)
      return reply.code(401).send({ error: "usuário não autenticado" });
    const result = await productService.getAll({ ownerId: req.userId });

    if (!result)
      return reply.code(404).send({ error: "nenhum produto encontrado" });

    return reply.code(200).send(result);
  });

  fastify.get<{ Params: { name: string } }>("/:name", async (req, reply) => {
    if (!req.userId)
      return reply.code(401).send({ error: "usuário não autenticado" });
    const result = await productService.getProduct({
      ownerId: req.userId,
      name: req.params.name,
    });

    if (!result)
      return reply.code(404).send({ error: "nenhum produto encontrado" });

    return reply
      .code(200)
      .send({ message: "produto encontrado", product: result });
  });

  fastify.get<{ Params: { productId: string } }>(
    "/getById/:productId",
    async (req, reply) => {
      if (!req.userId)
        return reply.code(401).send({ error: "usuário não autenticado" });
      const result = await productService.getProduct({
        id: req.params.productId,
      });

      if (!result)
        return reply.code(404).send({ error: "nenhum produto encontrado" });

      return reply
        .code(200)
        .send({ message: "produto encontrado", product: result });
    }
  );

  fastify.put<{
    Params: { productId: string };
    Body: {
      column: "name" | "description" | "price";
      value: string | Decimal;
    };
  }>("/:productId", async (req, reply) => {
    if (!req.userId)
      return reply.code(401).send({ error: "usuário não autenticado" });
    const data: UpdateProduct = {
      id: req.params.productId,
      modify: {
        column: req.body.column,
        value: req.body.value,
      },
    };
    const result = await productService.update(data);

    if (!result)
      return reply.code(404).send({ error: "produto não encontrado" });

    if (result === "falha ao realizar atualização")
      return reply
        .code(400)
        .send({ error: "ocorreu um erro ao tentar atualizar dados" });

    return reply
      .code(200)
      .send({ message: "dados atualizados com sucesso", product: result });
  });

  fastify.delete<{ Params: { productId: string } }>(
    "/:productId",
    async (req, reply) => {
      if (!req.userId)
        return reply.code(401).send({ error: "usuário não autenticado" });
      const result = await productService.delete({ id: req.params.productId });

      if (!result)
        return reply.code(404).send({ error: "produto não encontrado" });

      return reply
        .code(200)
        .send({ message: "produto deletado com sucesso", product: result });
    }
  );
};

export const userRoutes = async (fastify: FastifyInstance) => {
  const userService = new UserService();

  fastify.post<{ Body: CreateUser }>("/", async (req, reply) => {
    const result = await userService.create(req.body);

    if (!result) return reply.code(400).send({ error: "usuário já existe" });

    return reply
      .code(201)
      .send({ message: "Usuário criado com sucesso!", user: result });
  });

  fastify.post<{ Body: { username: string; password: string } }>(
    "/signIn",
    async (req, reply) => {
      const result = await userService.login(req.body);

      if (!result)
        return reply.code(404).send({ error: "usuário não encontrado" });

      if (result.message === "senha incorreta")
        return reply.code(401).send({ error: result });

      return reply.code(200).send({ message: result });
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/getById/:id",
    async (req, reply) => {
      const result = await userService.getUser({ id: req.params.id });

      if (!result)
        return reply.code(404).send({ error: "usuário não encontrado" });

      return reply
        .code(200)
        .send({ message: "usuário encontrado", user: result });
    }
  );

  fastify.get<{ Params: { username: string } }>(
    "/:username",
    async (req, reply) => {
      const result = await userService.getUser({
        username: req.params.username,
      });

      if (!result)
        return reply.code(404).send({ error: "usuário não encontrado" });

      return reply
        .code(200)
        .send({ message: "usuário encontrado", user: result });
    }
  );

  fastify.get("/", async (req, reply) => {
    const result = await userService.getAll();

    if (!result)
      return reply.code(404).send({ error: "dados não encontrados" });

    return reply.code(200).send(result);
  });

  fastify.put<{
    Params: { id: string };
    Body: { modify: ModifyUser };
  }>("/:id", async (req, reply) => {
    const data: UpdateUser = {
      id: req.params.id,
      modify: {
        column: req.body.modify.column,
        value: req.body.modify.value,
      },
    };

    const result = await userService.updateUser(data);

    if (!result)
      return reply.code(404).send({ error: "usuário não encontrado" });

    if (result === "erro ao realizar atualização")
      return reply
        .code(500)
        .send({ error: "ocorreu um erro ao tentar fazer atualização" });

    return reply
      .code(200)
      .send({ message: "atualização feita com sucesso", user: result });
  });

  fastify.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const result = await userService.delete(req.params);

    if (!result)
      return reply.code(404).send({ error: "usuário não encontrado" });

    return reply.code(200).send(result);
  });
};

export const stockRoutes = async (fastify: FastifyInstance) => {
  const stockMovementService = new StockMovementService();
  fastify.addHook("onRequest", AuthMiddleware);

  fastify.post<{ Body: { productId: string; type: string; quantity: number } }>(
    "/register",
    async (req, reply) => {
      if (!req.userId)
        return reply.code(401).send({ error: "usuário não autenticado" });
      const data = {
        userId: req.userId,
        productId: req.body.productId,
        type: req.body.type,
        quantity: req.body.quantity,
      };

      const result = await stockMovementService.register(data);

      if (!result)
        return reply
          .code(400)
          .send({ error: "o ocorreu um erro ao criar movimentação" });

      return reply
        .code(201)
        .send({ message: "movimentação registrada", stockMovement: result });
    }
  );

  fastify.get("/", async (req, reply) => {
    if (!req.userId)
      return reply.code(401).send({ error: "usuário não autenticado" });

    const result = await stockMovementService.getMovements({
      userId: req.userId,
    });

    if (!result)
      return reply.code(500).send({ error: "ocorreu algum erro interno" });

    if (result.length < 1)
      return reply
        .code(404)
        .send({ message: "nenhuma movimentação foi encontrada" });

    return reply
      .code(200)
      .send({ message: "movimentações do estoque", movements: result });
  });

  fastify.get<{ Params: { productId: string } }>(
    "/product/:productId",
    async (req, reply) => {
      if (!req.userId)
        return reply.code(401).send({ error: "usuário não autenticado" });

      const result = await stockMovementService.getMovementsOfProduct({
        userId: req.userId,
        productId: req.params.productId,
      });

      if (!result)
        return reply.code(500).send({ erro: "ocorreu um erro interno" });

      if (result.length < 1)
        return reply
          .code(404)
          .send({ message: "nenhuma movimentação encontrada" });

      return reply
        .code(200)
        .send({ message: "movimentações do estoque", movements: result });
    }
  );

  fastify.get<{ Params: { stockMovementId: string } }>(
    "/:stockMovementId",
    async (req, reply) => {
      if (!req.userId)
        return reply.code(401).send({ error: "usuário não autenticado" });

      const result = await stockMovementService.getById({
        userId: req.userId,
        stockMovementId: req.params.stockMovementId,
      });

      if (!result)
        return reply
          .code(404)
          .send({ message: "nenhuma movimentação encontrada" });

      return reply
        .code(200)
        .send({ message: "movimentação encontrada", movement: result });
    }
  );

  fastify.delete<{ Params: { stockMovementId: string } }>(
    "/:stockMovementId",
    async (req, reply) => {
      if (!req.userId)
        return reply.code(401).send({ error: "usuário não autenticado" });

      const result = await stockMovementService.delete({
        userId: req.userId,
        stockMovementId: req.params.stockMovementId,
      });

      if (!result)
        return reply.code(404).send({ erro: "movimentação não encontrada" });

      return reply
        .code(200)
        .send({ message: "movimentação removida", movement: result });
    }
  );
};
