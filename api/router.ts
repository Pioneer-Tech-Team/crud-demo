import { FastifyInstance } from "fastify";
import { authController } from "./controllers/auth";

export async function router(app: FastifyInstance) {
	app.register(authController, { prefix: "/api" });
}
