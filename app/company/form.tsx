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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/lib/swr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const companyFormSchema = z.object({
	name: z.string(),
	pan: z.string(),
	panName: z.string(),
	aadhar: z.string(),
	gstin: z.string(),
	companyGroup: z.coerce.number(),
});

interface Props {
	defaultValues: z.infer<typeof companyFormSchema>;
	handleSubmit: (data: z.infer<typeof companyFormSchema>) => void;
}

export function CompanyGroupForm({ defaultValues, handleSubmit }: Props) {
	const { data: groups, isLoading } = useApi("/api/company-groups", {
		method: "GET",
	});

	const form = useForm<z.infer<typeof companyFormSchema>>({
		resolver: zodResolver(companyFormSchema),
		defaultValues,
	});

	if (!isLoading)
		return (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-4 w-full"
				>
					<FormField
						control={form.control}
						name="name"
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
						name="pan"
						render={({ field }) => (
							<FormItem>
								<FormLabel>PAN</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="panName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>PAN Name</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="aadhar"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Aadhar</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="gstin"
						render={({ field }) => (
							<FormItem>
								<FormLabel>GSTIN</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="companyGroup"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Group</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a company group" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{groups.map(
												(group: {
													company_group_id: number;
													company_group_name: string;
												}) => (
													<SelectItem
														key={group.company_group_id}
														value={group.company_group_id}
													>
														{group.company_group_name}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Submit</Button>
				</form>
			</Form>
		);
	else return <p>Loading...</p>;
}
