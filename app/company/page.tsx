"use client";

import { useApi } from "@/lib/swr";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { CompanyForm, companyFormSchema } from "./form";
import client from "@/api/client";
import { toast } from "sonner";
import { EyeOpenIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";

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
					<div className="flex gap-1">
						<Button
							onClick={() => {
								setDisplayDialog(true);
								setActiveCompany(companyGroup);
							}}
						>
							<EyeOpenIcon />
						</Button>

						<Button
							variant="secondary"
							onClick={() => {
								setEditDialog(true);
								setActiveCompany(companyGroup);
							}}
						>
							<Pencil2Icon />
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								setDeleteDialog(true);
								setActiveCompany(companyGroup);
							}}
						>
							<TrashIcon />
						</Button>
					</div>
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
			{!isLoading ? (
				<>
					<Button onClick={() => setAddDialog(true)}>Add Company</Button>
					<DataTable columns={columns} data={companies} />

					<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
						<DialogContent>
							<DialogTitle>{activeCompany?.name}</DialogTitle>
							<DialogDescription>
								<p>
									<span className="text-black mr-2 ">PAN</span>:{" "}
									{activeCompany?.pan}
								</p>
								<p>
									<span className="text-black mr-2 ">PAN Name</span>:{" "}
									{activeCompany?.panName}
								</p>
								<p>
									<span className="text-black mr-2 ">Aadhar</span>:{" "}
									{activeCompany?.aadhar}
								</p>
								<p>
									<span className="text-black mr-2 ">GSTIN</span>:{" "}
									{activeCompany?.gstin}
								</p>
							</DialogDescription>
						</DialogContent>
					</Dialog>

					<Dialog open={addDialog} onOpenChange={setAddDialog}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Company</DialogTitle>
							</DialogHeader>
							<CompanyForm
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
							<CompanyForm
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
									Do you want to delete the company{" "}
									<b>{activeCompany?.name}</b>?
								</DialogDescription>
							</DialogHeader>

							<Button variant="destructive" onClick={handleDelete}>
								Yes, Delete
							</Button>
						</DialogContent>
					</Dialog>
				</>
			) : (
				<p>Loading...</p>
			)}
		</section>
	);
}
