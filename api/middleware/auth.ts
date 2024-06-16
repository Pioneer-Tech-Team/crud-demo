import { FastifyAuthFunction } from "@fastify/auth";

export const checkSession: FastifyAuthFunction = async function (
	request,
	reply
) {
	const userId = request.session.uid;

	if (!request.session.authenticated || !userId) {
		request.session.authenticated = false;
		return reply.code(401).send({ message: "Unauthorized" });
	}

	const session = await this.prisma.session.findFirst({
		where: { uid: userId },
		select: { user: true },
	});
	if (!session || !session.user) {
		return reply.code(401).send({ message: "Unauthorized" }).redirect("/login");
	}

	this.user = session.user;
};
