"use client";

import { useApi } from "@/lib/swr";
import { useEffect, useState } from "react";
import { DataTable } from "../../components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CompanyGroup } from "@prisma/client";
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
import { CompanyGroupForm, companyGroupFormSchema } from "./form";
import client from "@/api/client";
import { toast } from "sonner";

export default function CompanyGroupPage() {
	const {
		data: groups,
		isLoading,
		mutate,
	} = useApi("/api/company-groups", { method: "GET" });

	const [addDialog, setAddDialog] = useState(false);
	const [displayDialog, setDisplayDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState(false);

	const [activeGroup, setActiveGroup] = useState<CompanyGroup | null>(null);

	useEffect(() => {
		console.log(groups);
	}, [groups]);

	const columns: ColumnDef<CompanyGroup>[] = [
		{
			accessorKey: "company_group_id",
			header: "ID",
		},
		{
			accessorKey: "company_group_name",
			header: "Company Group",
		},
		{
			accessorKey: "contact_person",
			header: "Contact Person",
		},
		{
			accessorKey: "phone",
			header: "Phone",
		},
		{
			accessorKey: "email_id",
			header: "Email",
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
									setActiveGroup(companyGroup);
								}}
							>
								Display
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setEditDialog(true);
									setActiveGroup(companyGroup);
								}}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setDeleteDialog(true);
									setActiveGroup(companyGroup);
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

	async function handleAdd(data: z.infer<typeof companyGroupFormSchema>) {
		const { data: resp, error } = await client.POST("/api/company-group", {
			body: {
				name: data.companyGroupName,
				contactPerson: {
					name: data.contactPerson,
					email: data.email,
					phone: data.phone,
				},
			},
		});

		setAddDialog(false);
		mutate("api");

		if (resp) {
			toast.success("Successfully added company group");
		} else if (error) {
			toast.error("Error adding company group");
		}
	}

	async function handleEdit(data: z.infer<typeof companyGroupFormSchema>) {
		if (!activeGroup) return;

		const { data: resp, error } = await client.PUT("/api/company-group/{id}", {
			params: { path: { id: activeGroup!.company_group_id } },
			body: {
				name: data.companyGroupName,
				contactPerson: {
					name: data.contactPerson,
					email: data.email,
					phone: data.phone,
				},
			},
		});

		setEditDialog(false);
		mutate("api");

		if (resp) {
			toast.success("Successfully edited company group");
		} else if (error) {
			toast.error("Error editing company group");
		}
	}

	async function handleDelete() {
		if (!activeGroup) return;

		const { data: resp, error } = await client.DELETE(
			"/api/company-group/{id}",
			{
				params: { path: { id: activeGroup!.company_group_id } },
			}
		);

		setDeleteDialog(false);
		mutate("api");

		if (resp) {
			toast.success("Successfully deleted company group");
		} else if (error) {
			toast.error("Error deleting company group");
		}
	}

	return (
		<section className="prose max-w-none grid place-items-center gap-4 p-4 w-full">
			<h1 className="lead">Company Group</h1>
			{!isLoading && (
				<>
					<Button onClick={() => setAddDialog(true)}>Add Group</Button>
					<DataTable columns={columns} data={groups} />

					<Dialog open={displayDialog} onOpenChange={setDisplayDialog}>
						<DialogContent>
							<DialogTitle>{activeGroup?.company_group_name}</DialogTitle>
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
									companyGroupName: "",
									contactPerson: "",
									email: "",
									phone: "",
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
									companyGroupName: activeGroup?.company_group_name ?? "",
									contactPerson: activeGroup?.contact_person ?? "",
									email: activeGroup?.email_id ?? "",
									phone: activeGroup?.phone ?? "",
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
									<b>{activeGroup?.company_group_name}</b>?
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
