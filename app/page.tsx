"use client";

import client from "@/api/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserContext } from "@/lib/user-provider";
import { useContext } from "react";
import Link from "next/link";

export default function Home() {
	const { user, setUser } = useContext(UserContext);

	const logout = async () => {
		const res = await client.GET("/api/auth/logout");
		if (res.error) {
			toast.error(res.error.message);
		}
		setUser(null);
	};

	return (
		<main className="prose p-4 grid place-items-center max-w-none">
			{user ? (
				<>
					<p className="lead">Logged in as {user.name}</p>
					<Button onClick={logout} variant="destructive">
						Logout
					</Button>
				</>
			) : (
				<>
					<p className="lead">Not logged in</p>
					<div className="flex gap-4">
						<Button asChild>
							<Link href="/login">Login</Link>
						</Button>
						<Button asChild>
							<Link href="/register">Register</Link>
						</Button>
					</div>
				</>
			)}
		</main>
	);
}
