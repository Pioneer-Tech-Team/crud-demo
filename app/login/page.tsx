"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import client from "@/api/client";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
	email: z.string(),
	password: z.string(),
});
type LoginFormFields = z.infer<typeof loginFormSchema>;

export default function Page() {
	const router = useRouter();
	const form = useForm<LoginFormFields>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function handleLogin(data: LoginFormFields) {
		const res = await client.POST("/api/auth/login", {
			body: data,
		});

		if (res.data) {
			toast.success(res.data.message, {
				duration: 2000,
				onAutoClose: () => {
					window.location.pathname = "/";
				},
			});
		}
		if (res.error) {
			toast.error(res.error.message);
		}
	}

	return (
		<section className="prose max-w-none grid place-items-center gap-4 p-4 w-full">
			<h1 className="lead">Login</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleLogin)}
					className="space-y-4 md:w-[60%] w-full"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</section>
	);
}
