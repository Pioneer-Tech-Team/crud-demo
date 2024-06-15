import { FastifyInstance } from "fastify";
import { FastifyZodOpenApiTypeProvider } from "fastify-zod-openapi";
import { z } from "zod";

export async function companyGroupController(app: FastifyInstance) {
	app.withTypeProvider<FastifyZodOpenApiTypeProvider>().route({
		url: "/company-groups",
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

			prisma.companyGroup.create({
				data: {
					company_group_name: name,
					contact_person: contactPerson.name,
					email_id: contactPerson.email,
					phone: contactPerson.phone,
					entered_by: request.session.uid!,
				},
			});
		},
	});
}
