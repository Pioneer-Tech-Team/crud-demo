import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import client from "./api/client";

export async function middleware(request: NextRequest) {
	const isUnauthorized = await client
		.GET("/api/auth/me", {
			// If headers are passed directly, "Host" might conflict with the
			// actual endpoint name, causing in certificate error. Pass only the
			// cookie instead which is needed to check auth status.
			headers: new Headers({ cookie: request.headers.get("cookie") ?? "" }),
		})
		.then(({ error }) => Boolean(error));

	if (isUnauthorized) return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
	matcher: ["/company", "/company-group"],
};
