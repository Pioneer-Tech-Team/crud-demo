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
	companyGroupName: z.string(),
	contactPerson: z.string(),
	phone: z.string(),
	email: z.string(),
});

interface Props {
	defaultValues: z.infer<typeof companyGroupFormSchema>;
	handleSubmit: (data: z.infer<typeof companyGroupFormSchema>) => void;
}

export function CompanyGroupForm({ defaultValues, handleSubmit }: Props) {
	const form = useForm<z.infer<typeof companyGroupFormSchema>>({
		resolver: zodResolver(companyGroupFormSchema),
		defaultValues,
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
								<Input type="text" {...field} />
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
								<Input type="text" {...field} />
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
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input type="tel" {...field} />
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
