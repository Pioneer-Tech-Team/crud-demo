import { FastifyInstance } from "fastify";
import { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { checkSession } from "../middleware/auth";
import { Prisma } from "@prisma/client";
import { UserModel } from "@/prisma/models";

export async function authController(app: FastifyInstance) {
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/auth/register",
		method: "POST",
		schema: {
			body: z
				.object({
					name: z.string().openapi({ description: "User name" }),
					email: z.string().email().openapi({ description: "User email" }),
					password: z.string().openapi({ description: "User password" }),
				})
				.openapi({
					description: "User details",
				}),
			response: {
				200: z.object({ message: z.string() }).openapi({ description: "OK" }),
				400: z
					.object({ message: z.string() })
					.openapi({ description: "Bad Request" }),
			},
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { email, password, name } = request.body;

			try {
				const user = await prisma.user.create({
					data: {
						password: bcrypt.hashSync(password),
						name,
						email,
					},
				});

				request.session.uid = user.id;
				request.session.authenticated = true;

				return reply.code(200).send({ message: "Registeration successful" });
			} catch (err) {
				app.log.error(err);
				if (err instanceof Prisma.PrismaClientKnownRequestError) {
					return reply
						.code(400)
						.send({ message: "User with details already exists" });
				} else {
					return reply.code(400).send({ message: "Failed to register user" });
				}
			}
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/auth/me",
		method: "GET",
		preHandler: app.auth([checkSession]),
		schema: {
			response: {
				200: z.object({
					message: z.string(),
					user: UserModel.openapi({ description: "The current in user." }).omit(
						{ password: true }
					),
				}),
				default: z.object({
					message: z.string(),
				}),
			},
		},
		handler: async (request, reply) => {
			const {
				password: {},
				...user
			} = await app.prisma.user.findUniqueOrThrow({
				where: { id: request.session.uid! },
			});

			return reply.code(200).send({ message: "OK", user });
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/auth/logout",
		method: "GET",
		schema: {
			response: {
				default: z.object({
					message: z.string(),
				}),
			},
		},
		preHandler: app.auth([checkSession]),
		handler: async (request, reply) => {
			await request.session.destroy();
			return reply.code(200).send({ message: "Logged out successfully" });
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/auth/login",
		method: "POST",
		schema: {
			body: z
				.object({
					email: z.string().email().openapi({ description: "User email" }),
					password: z.string().openapi({ description: "User password" }),
				})
				.openapi({
					description: "User credentials",
				}),
			response: {
				200: z.object({ message: z.string() }).openapi({ description: "OK" }),
				400: z
					.object({ message: z.string() })
					.openapi({ description: "Bad Request" }),
			},
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { email, password } = request.body;

			const user = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!user || !bcrypt.compareSync(password, user.password))
				return reply.code(400).send({ message: "Incorrect email or password" });

			request.session.uid = user.id;
			request.session.authenticated = true;

			return reply.code(200).send({ message: "Login successful" });
		},
	});
}
