"use client";

import { useApi } from "@/lib/swr";
import { useEffect } from "react";

export default function CompanyGroupPage() {
	const { data: groups } = useApi("/api/company-groups", { method: "GET" });

	useEffect(() => {
		console.log(groups);
	}, [groups]);

	return (
		<section className="prose max-w-none grid place-items-center gap-4 p-4 w-full">
			<h1 className="lead">Company Group</h1>
		</section>
	);
}
