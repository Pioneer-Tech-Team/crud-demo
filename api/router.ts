import { FastifyInstance } from "fastify";
import { authController } from "./controllers/auth";
import {
	companyController,
	companyGroupController,
} from "./controllers/company";

export async function router(app: FastifyInstance) {
	app.register(authController, { prefix: "/api" });
	app.register(companyGroupController, { prefix: "/api" });
	app.register(companyController, { prefix: "/api" });
}
