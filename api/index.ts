import { fastifyAuth } from "@fastify/auth";
import { fastifyCookie } from "@fastify/cookie";
import fastifyEnv from "@fastify/env";
import fastifyNextjs from "@fastify/nextjs";
import { fastifySession } from "@fastify/session";
import fastify from "fastify";
import {
	fastifyZodOpenApiPlugin,
	fastifyZodOpenApiTransform,
	fastifyZodOpenApiTransformObject,
	serializerCompiler,
	validatorCompiler,
} from "fastify-zod-openapi";
import { z } from "zod";
import { createDocument, extendZodWithOpenApi } from "zod-openapi";
import { zodToJsonSchema } from "zod-to-json-schema";
import prismaPlugin from "./plugins/prisma";
import { router } from "./router";
import { User } from "@prisma/client";
import { PrismaSessionStore } from "./util/session-store";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

extendZodWithOpenApi(z);
const isDev = process.env.NODE_ENV !== "production";

const envSchema = z.object({
	DATABASE_URL: z.string(),
	SESSION_SECRET: z.string().min(128),
});

declare module "fastify" {
	interface FastifyInstance {
		config: z.infer<typeof envSchema>;
		user: User;
	}
	interface Session {
		uid?: string;
		authenticated: boolean;
	}
}

export async function createApp() {
	const app = fastify({
		pluginTimeout: isDev ? 120_000 : undefined,
		logger: isDev
			? {
					transport: {
						target: "pino-pretty",
					},
			  }
			: true,
	});

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	await app.register(fastifyEnv, {
		schema: zodToJsonSchema(envSchema),
		confKey: "config",
	});

	await app.register(fastifyAuth);
	await app.register(prismaPlugin);

	await app.register(fastifyZodOpenApiPlugin, {
		openapi: "3.1.0",
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "sessionId",
				},
			},
		},
	});

	await app.register(fastifySwagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				version: "1.0.0",
				title: "Nextjs starter",
			},
		},
		transform: fastifyZodOpenApiTransform,
		transformObject: fastifyZodOpenApiTransformObject,
	});
	await app.register(fastifySwaggerUi, {
		routePrefix: "/api/swagger",
	});

	await app.register(fastifyCookie);
	await app.register(fastifySession, {
		cookie: {
			secure: !isDev,
			maxAge: 24 * 60 * 60 * 1000,
		},
		secret: app.config.SESSION_SECRET,
		store: new PrismaSessionStore(app.prisma),
	});

	await app.register(router);
	app
		.register(fastifyNextjs, { dev: isDev, logLevel: "silent" })
		.after(() => app.next("*"));

	app.get("/.well-known/openapi", async (request, reply) => {
		const openapi = app.swagger();

		if (openapi.paths) {
			delete openapi.paths["/_next/{*}"];
			delete openapi.paths["{*}"];
		}

		reply.header("content-type", "application/vnd.oai.openapi+json");

		return JSON.stringify(openapi, null, 2);
	});

	await app.ready();

	return app;
}
