import { Button } from "@/components/ui/button";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const companyGroupFormSchema = z.object({
	companyGroupName: z.string().max(50, "Should not exceed 50 characters"),
	contactPerson: z.string().max(50, "Should not exceed 50 characters"),
	phone: z.string().regex(/^[0-9]{10}/, "Invalid phone number"),
	email: z
		.string()
		.email("Invalid email")
		.max(100, "Should not exceed 100 characters"),
});

interface Props {
	defaultValues: z.infer<typeof companyGroupFormSchema>;
	handleSubmit: (data: z.infer<typeof companyGroupFormSchema>) => void;
}

export function CompanyGroupForm({ defaultValues, handleSubmit }: Props) {
	const form = useForm<z.infer<typeof companyGroupFormSchema>>({
		resolver: zodResolver(companyGroupFormSchema),
		defaultValues,
		mode: "onChange",
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4 w-full"
			>
				<FormField
					control={form.control}
					name="companyGroupName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input type="text" {...field} placeholder="Company Pvt. Ltd." />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contactPerson"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contact Person</FormLabel>
							<FormControl>
								<Input type="text" {...field} placeholder="John Doe" />
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
								<Input
									type="email"
									{...field}
									placeholder="contact@example.com"
								/>
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
								<Input type="tel" {...field} placeholder="9876543210" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
