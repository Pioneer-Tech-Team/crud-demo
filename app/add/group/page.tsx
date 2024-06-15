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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// company group name. comtact person. phone, email

const groupAddFormSchema = z.object({
	name: z.string(),
	"contact-person": z.string(),
    phone: z.string(),
    email: z.string(),
});
type groupAddFormFields = z.infer<typeof groupAddFormSchema>;

export default function Page() {
	const router = useRouter();
	const form = useForm<groupAddFormFields>({
		resolver: zodResolver(groupAddFormSchema),
		defaultValues: {
            name: "",
            "contact-person": "",
            phone: "",
            email: "",
		},
	});

	async function handleFormSubmit(data: groupAddFormFields) {
		const res = await client.POST("/api/group/add", {
			body: data,
		});

		if (res.data) {
			toast.success(res.data.message, {
				duration: 2000,
				onAutoClose: () => {
					window.location.pathname = "/view/group";
				},
			});
		}
		if (res.error) {
			toast.error(res.error.message);
		}
	}
	return (
		<section className="prose max-w-none grid place-items-center gap-4 p-4 w-full">
            <Card className="space-y-4 md:w-[60%] w-full">
            <CardHeader>
                <CardTitle>Add Company Group</CardTitle>
                {/* <CardDescription></CardDescription> */}
            </CardHeader>
            <Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleFormSubmit)}
					
				>
            <CardContent>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Group Name</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="contact-person"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Person</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
					

            </CardContent>
            <CardFooter className="flex gap-5">
            <Button type="reset" variant="secondary" onClick={form.reset}>Reset</Button>
            <Button type="submit">Submit</Button>
            </CardFooter>
				</form>
			</Form>
            </Card>
			{/* <h1 className="lead">Add Company Group</h1> */}
		
		</section>
	);
}
