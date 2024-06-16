import { SessionStore } from "@fastify/session";
import { PrismaClient } from "@prisma/client";
import { Session } from "fastify";

export class PrismaSessionStore implements SessionStore {
	constructor(private prisma: PrismaClient) {}
	set(
		sessionId: string,
		session: Session,
		callback: (err?: any) => void
	): void {
		this.prisma.session
			.upsert({
				where: { sid: sessionId },
				update: { data: session as any, uid: session.uid },
				create: {
					sid: sessionId,
					data: session as any,
					uid: session.uid,
				},
			})
			.then(() => callback(null))
			.catch(callback);
	}
	get(
		sessionId: string,
		callback: (err: any, result?: Session | null | undefined) => void
	): void {
		this.prisma.session
			.findUnique({
				where: { sid: sessionId },
			})
			.then((session) =>
				session?.data
					? callback(null, {
							uid: session.uid,
							...(session.data as any),
					  } as unknown as Session)
					: callback(null)
			)
			.catch(callback);
	}
	destroy(sessionId: string, callback: (err?: any) => void): void {
		this.prisma.session
			.delete({
				where: { sid: sessionId },
			})
			.then(() => callback())
			.catch(callback);
	}
}
