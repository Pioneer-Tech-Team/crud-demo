"use client";

import { useApi } from "@/lib/swr";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Company, CompanyGroup } from "@prisma/client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { CompanyGroupForm, companyFormSchema } from "./form";
import client from "@/api/client";
import { toast } from "sonner";

export default function CompanyPage() {
	const {
		data: companies,
		isLoading,
		mutate,
	} = useApi("/api/companies", { method: "GET" });

	const [addDialog, setAddDialog] = useState(false);
	const [displayDialog, setDisplayDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState(false);

	const [activeCompany, setActiveCompany] = useState<Company | null>(null);

	useEffect(() => {
		console.log(companies);
	}, [companies]);

	const columns: ColumnDef<Company>[] = [
		{
			accessorKey: "id",
			header: "ID",
		},
		{
			accessorKey: "name",
			header: "Company",
		},
		{
			accessorKey: "group.company_group_name",
			header: "Company Group",
		},
		{
			accessorKey: "pan",
			header: "PAN",
		},
		{
			accessorKey: "aadhar",
			header: "Aadhar",
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const companyGroup = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>...</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									setDisplayDialog(true);
									setActiveCompany(companyGroup);
								}}
							>
								Display
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setEditDialog(true);
									setActiveCompany(companyGroup);
								}}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setDeleteDialog(true);
									setActiveCompany(companyGroup);
								}}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
			header: "Actions",
		},
	];

	async function handleAdd(data: z.infer<typeof companyFormSchema>) {
		const { data: resp, error } = await client.POST("/api/company", {
			body: {
				aadhar: data.aadhar,
				groupId: data.companyGroup,
				gstin: data.gstin,
				name: data.name,
				pan: data.pan,
				panName: data.panName,
			},
		});

		setAddDialog(false);
		mutate("api");

		if (resp) {
			toast.success("Successfully added company");
		} else if (error) {
			toast.error("Error adding company");
		}
	}

	async function handleEdit(data: z.infer<typeof companyFormSchema>) {
		if (!activeCompany) return;

		const { data: resp, error } = await client.PUT("/api/company/{id}", {
			params: { path: { id: activeCompany!.id } },
			body: {
				aadhar: data.aadhar,
				groupId: data.companyGroup,
				gstin: data.gstin,
				name: data.name,
				pan: data.pan,
				panName: data.panName,
			},
		});

		setEditDialog(false);
		mutate("api");

		if (resp) {
			toast.success("Successfully edited company");
		} else if (error) {
			toast.error("Error editing company");
		}
	}

	async function handleDelete() {
		if (!activeCompany) return;

		const { data: resp, error } = await client.DELETE("/api/company/{id}", {
			params: { path: { id: activeCompany!.id } },
		});

		setDeleteDialog(false);
		mutate("api");

		if (resp) {
			toast.success("Successfully deleted company");
		} else if (error) {
			toast.error("Error deleting company");
		}
	}

	return (
		<section className="prose max-w-none grid place-items-center gap-4 p-4 w-full">
			<h1 className="lead">Company</h1>
			{!isLoading && (
				<>
					<Button onClick={() => setAddDialog(true)}>Add Group</Button>
					<DataTable columns={columns} data={companies} />

					<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
						<DialogContent>
							<DialogTitle>{activeCompany?.name}</DialogTitle>
						</DialogContent>
					</Dialog>

					<Dialog open={addDialog} onOpenChange={setAddDialog}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Company Group</DialogTitle>
							</DialogHeader>
							<CompanyGroupForm
								handleSubmit={handleAdd}
								defaultValues={{
									aadhar: "",
									companyGroup: 0,
									gstin: "",
									name: "",
									pan: "",
									panName: "",
								}}
							/>
						</DialogContent>
					</Dialog>

					<Dialog open={editDialog} onOpenChange={setEditDialog}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit</DialogTitle>
							</DialogHeader>
							<CompanyGroupForm
								handleSubmit={handleEdit}
								defaultValues={{
									aadhar: activeCompany?.aadhar ?? "",
									companyGroup: activeCompany?.companyGroup ?? 0,
									gstin: activeCompany?.gstin ?? "",
									name: activeCompany?.name ?? "",
									pan: activeCompany?.pan ?? "",
									panName: activeCompany?.panName ?? "",
								}}
							/>
						</DialogContent>
					</Dialog>

					<Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete</DialogTitle>
								<DialogDescription>
									Do you want to delete the company group{" "}
									<b>{activeCompany?.name}</b>?
								</DialogDescription>
							</DialogHeader>

							<Button variant="destructive" onClick={handleDelete}>
								Yes, Delete
							</Button>
						</DialogContent>
					</Dialog>
				</>
			)}
		</section>
	);
}
