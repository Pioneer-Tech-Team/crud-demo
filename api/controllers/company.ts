import { FastifyInstance } from "fastify";
import { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";

export async function companyGroupController(app: FastifyInstance) {
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company-group",
		method: "POST",
		schema: {
			body: z.object({
				name: z.string(),
				contactPerson: z.object({
					name: z.string(),
					email: z.string(),
					phone: z.string(),
				}),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { name, contactPerson } = request.body;

			try {
				const companyGroup = await prisma.companyGroup.create({
					data: {
						company_group_name: name,
						contact_person: contactPerson.name,
						email_id: contactPerson.email,
						phone: contactPerson.phone,
						entered_by: request.session.uid!,
					},
				});

				return reply
					.status(200)
					.send({ message: "Company group added successfully", companyGroup });
			} catch (err) {
				return reply
					.status(500)
					.send({ message: `Could not create company group: ${err}` });
			}
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company-group/:id",
		method: "GET",
		schema: {
			params: z.object({
				id: z.coerce.number(),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { id } = request.params;

			const companyGroup = await prisma.companyGroup.findFirst({
				where: { company_group_id: id },
			});

			if (companyGroup) return reply.status(200).send(companyGroup);
			else
				return reply.status(404).send({ message: "Company group not found" });
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company-groups",
		method: "GET",
		handler: async (request, reply) => {
			const { prisma } = app;

			const companyGroups = await prisma.companyGroup.findMany();

			return reply.status(200).send(companyGroups);
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company-group/:id",
		method: "PUT",
		schema: {
			params: z.object({
				id: z.coerce.number(),
			}),
			body: z.object({
				name: z.string(),
				contactPerson: z.object({
					name: z.string(),
					email: z.string(),
					phone: z.string(),
				}),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { id } = request.params;
			const { name, contactPerson } = request.body;

			try {
				await prisma.companyGroup.update({
					where: { company_group_id: id },
					data: {
						company_group_name: name,
						contact_person: contactPerson.name,
						email_id: contactPerson.email,
						phone: contactPerson.phone,
						entered_by: request.session.uid!,
					},
				});

				return reply
					.status(200)
					.send({ message: "Company group updated successfully" });
			} catch (err) {
				return reply
					.status(500)
					.send({ message: `Could not update company group: ${err}` });
			}
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company-group/:id",
		method: "DELETE",
		schema: {
			params: z.object({
				id: z.coerce.number(),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { id } = request.params;

			try {
				await prisma.companyGroup.delete({
					where: { company_group_id: id },
				});
				return reply
					.status(200)
					.send({ message: "Company group updated successfully" });
			} catch (err) {
				return reply
					.status(500)
					.send({ message: `Could not delete company group: ${err}` });
			}
		},
	});
}

export async function companyController(app: FastifyInstance) {
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company",
		method: "POST",
		schema: {
			body: z.object({
				aadhar: z.string(),
				gstin: z.string(),
				name: z.string(),
				pan: z.string(),
				panName: z.string(),
				groupId: z.number(),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const body = request.body;

			try {
				const company = await prisma.company.create({
					data: {
						aadhar: body.aadhar,
						gstin: body.gstin,
						name: body.name,
						pan: body.pan,
						panName: body.panName,
						companyGroup: body.groupId,
					},
				});

				return reply.status(200).send({
					message: "Company added successfully",
					companyGroup: company,
				});
			} catch (err) {
				return reply
					.status(500)
					.send({ message: `Could not create company: ${err}` });
			}
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company/:id",
		method: "GET",
		schema: {
			params: z.object({
				id: z.coerce.number(),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { id } = request.params;

			const company = await prisma.company.findFirst({
				where: { id },
			});

			if (company) return reply.status(200).send(company);
			else return reply.status(404).send({ message: "Company not found" });
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/companies",
		method: "GET",
		handler: async (request, reply) => {
			const { prisma } = app;

			const companies = await prisma.company.findMany();

			return reply.status(200).send(companies);
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company/:id",
		method: "PUT",
		schema: {
			params: z.object({
				id: z.coerce.number(),
			}),
			body: z.object({
				aadhar: z.string(),
				gstin: z.string(),
				name: z.string(),
				pan: z.string(),
				panName: z.string(),
				groupId: z.number(),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { id } = request.params;
			const body = request.body;

			try {
				await prisma.company.update({
					where: { id },
					data: {
						aadhar: body.aadhar,
						gstin: body.gstin,
						name: body.name,
						pan: body.pan,
						panName: body.panName,
						companyGroup: body.groupId,
					},
				});

				return reply
					.status(200)
					.send({ message: "Company updated successfully" });
			} catch (err) {
				return reply
					.status(500)
					.send({ message: `Could not update company: ${err}` });
			}
		},
	});
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company/:id",
		method: "DELETE",
		schema: {
			params: z.object({
				id: z.coerce.number(),
			}),
		},
		handler: async (request, reply) => {
			const { prisma } = app;
			const { id } = request.params;

			try {
				await prisma.company.delete({
					where: { id },
				});
				return reply
					.status(200)
					.send({ message: "Company updated successfully" });
			} catch (err) {
				return reply
					.status(500)
					.send({ message: `Could not delete company: ${err}` });
			}
		},
	});
}
