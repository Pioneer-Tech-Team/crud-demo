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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
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

// company name. pan. pan name, aadhar, gstin, company group name

const companyAddFormSchema = z.object({
	name: z.string(),
	pan: z.string(),
    "pan-name": z.string(),
    aadhar: z.string(),
    gstin: z.string(),
    "company-group-name": z.string(),
});
type CompanyAddFormFields = z.infer<typeof companyAddFormSchema>;

export default function Page() {
	const router = useRouter();
	const form = useForm<CompanyAddFormFields>({
		resolver: zodResolver(companyAddFormSchema),
		defaultValues: {
            name: "",
            pan: "",
            "pan-name": "",
            aadhar: "",
            gstin: "",
            "company-group-name": "",
		},
	});

	async function handleFormSubmit(data: CompanyAddFormFields) {
		const res = await client.POST("/api/company/edit", {
			body: data,
		});

		if (res.data) {
			toast.success(res.data.message, {
				duration: 2000,
				onAutoClose: () => {
					window.location.pathname = "/view/company";
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
                <CardTitle>Edit Company</CardTitle>
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
								<FormLabel>Company Name</FormLabel>
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
						name="pan-name"
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
									<Input type="number" {...field} />
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
                        <div className="mt-5"></div>
                    <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Company Group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Company Groups</SelectLabel>
                        <SelectItem value="tata">Tata</SelectItem>
                        <SelectItem value="reliance">Reliance</SelectItem>
                        <SelectItem value="bajaj">Bajaj</SelectItem>
                        <SelectItem value="godrej">Godrej</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>

                    </CardContent>
                    <CardFooter className="gap-5">
                        <Button type="reset" variant="secondary" onClick={form.reset}>Reset</Button>
                        <Button type="submit">Submit</Button>
                    </CardFooter>
				</form>
			</Form>
            </Card>
		</section>
	);
}
