import fastify from "fastify";
import { productsRoutes, stockRoutes, userRoutes } from "./routes/router.js";

const server = fastify({
  // logger: true,
});

server.register(productsRoutes, {
  prefix: "/products",
});
server.register(userRoutes, {
  prefix: "/users",
});

server.register(stockRoutes, {
  prefix: "/stock",
});

server.listen({ port: 3000, host: "localhost" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  console.log(`ouvindo na porta ${address}`);
});
