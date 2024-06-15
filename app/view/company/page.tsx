"use client"

import * as React from "react"
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
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    ChevronDownIcon,
    EyeOpenIcon,
    Pencil2Icon,
    PlusIcon,
    TrashIcon,
  } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data= [
  {
    name:'Tata Motors Ltd',
    company_group_name:'Tata',
    pan:'ADGCF2896J',
    aadhar:'256987452369',
  },
  {
    name:'Tata Motors Ltd',
    company_group_name:'Tata',
    pan:'ADGCF2896J',
    aadhar:'256987452369',
  },
  {
    name:'Tata Motors Ltd',
    company_group_name:'Tata',
    pan:'ADGCF2896J',
    aadhar:'256987452369',
  },
]

export const columns = [
  {
    id: "name",
    accessorKey:"name",
    header: () => (<div >Company Name</div>),
    cell: ({ row }) => {
      const payment = row.original

      return (
        <div className="flex items-center">
          <div>{payment.name}</div>
        </div>
      )
    },
  },
  {
    id: "company_group_name",
    accessorKey:"company_group_name",
    header: () => (<div >Company Group Name</div>),
    cell: ({ row }) => {
      const payment = row.original

      return (
        <div className="flex items-center">
          <div>{payment.company_group_name}</div>
        </div>
      )
    },
  },
  {
    id: "pan",
    accessorKey:"pan",
    header: () => (<div >PAN</div>),
    cell: ({ row }) => {
      const payment = row.original

      return (
        <div className="flex items-center">
          <div>{payment.pan}</div>
        </div>
      )
    },
  },
  {
    id: "aadhar",
    accessorKey:"aadhar",
    header: () => (<div >Aadhar</div>),
    cell: ({ row }) => {
      const payment = row.original

      return (
        <div className="flex items-center">
          <div>{payment.aadhar}</div>
        </div>
      )
    },
  },
 
  {
    id: "actions",
    accessorKey:"actions",
    header: () => (<div >Actions</div>),
    cell: ({ row }) => {


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
        <div className="flex gap-3">
          <Dialog className="w-full">
            <DialogTrigger>
              <Button variant="default" className="h-8 w-8 p-0">
                  <span className="sr-only">View</span>
                  <EyeOpenIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>View Company</DialogTitle>
                <DialogDescription>
                <table className="w-full m-4 border-gray-950" border={1}>
        {/* <thead className="bg-purple-300 p-3 text-center border-black text-black">
                Company
        </thead> */}
        <tbody>
            <tr>
                <td className="bg-orange-200 p-3 text-center border-black text-black">Company</td>
                <td className="text-black border-black p-3 text-center">Tata Motors Ltd</td>
            </tr>
            <tr>
                <td className="bg-orange-200 p-3 text-center border-black text-black">PAN</td>
                <td className="text-black border-black p-3 text-center">ADGCF2896J</td>
            </tr>
            <tr>
                <td className="bg-orange-200 p-3 text-center border-black text-black">PAN Name</td>
                <td className="text-black border-black p-3 text-center">Tata Motors Ltd</td>
            </tr>
            <tr>
                <td className="bg-orange-200 p-3 text-center border-black text-black">Aadhar</td>
                <td className="text-black border-black p-3 text-center">256987452369</td>
            </tr>
            <tr>
                <td className="bg-orange-200 p-3 text-center border-black text-black">GSTIN</td>
                <td className="text-black border-black p-3 text-center">27ADGCF2896J1ZL</td>
            </tr>
            <tr>
                <td className="bg-orange-200 p-3 text-center border-black text-black">Company Group</td>
                <td className="text-black border-black p-3 text-center">Tata</td>
            </tr>
        </tbody>
    </table>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
            <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Edit</span>
                <Pencil2Icon />
            </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Company</DialogTitle>
                <DialogDescription>
                <Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleFormSubmit)}
					
				>
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

<div className="flex gap-3 mt-4">
                        <Button type="reset" variant="secondary" onClick={form.reset}>Reset</Button>
                        <Button type="submit">Submit</Button>
</div>
                    
				</form>
			</Form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>              
            <Button variant="destructive" className="h-8 w-8 p-0">
                <span className="sr-only">Delete</span>
                <TrashIcon />
            </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete this company
                  and remove data.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" >Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

            
        </div>
      )
    },
  },
]

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


  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

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
		const res = await client.POST("/api/company/add", {
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
    <div className="w-full h-full flex justify-center items-center">
    <Card className="w-[70%] my-auto">
    <CardHeader>
        <CardTitle>View Companies</CardTitle>
    </CardHeader>
    <CardContent>

    <div className="w-full">
       
       <div className="flex justify-between py-4">
         <Input
           placeholder="Filter data..."
           value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
           onChange={(event) =>
             table.getColumn("email")?.setFilterValue(event.target.value)
           }
           className="max-w-sm"
         />
         <div>
          <Dialog>
            <DialogTrigger>
              <Button
                variant="outline"
                className="ml-auto"
              >
                <PlusIcon className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Company</DialogTitle>
                <DialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    
                  >
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
                              <div className="flex gap-3 mt-4">
                        <Button type="reset" variant="secondary" onClick={form.reset}>Reset</Button>
                        <Button type="submit">Submit</Button>
</div>
                        </form>
                      </Form>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>



         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="outline" className="ml-auto">
                 
                 <ChevronDownIcon className="ml-2 h-4 w-4" />
               {/* Columns <ChevronDown className="ml-2 h-4 w-4" /> */}
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
             {table
               .getAllColumns()
               .filter((column) => column.getCanHide())
               .map((column) => {
                 return (
                   <DropdownMenuCheckboxItem
                     key={column.id}
                     className="capitalize"
                     checked={column.getIsVisible()}
                     onCheckedChange={(value) =>
                       column.toggleVisibility(!!value)
                     }
                   >
                     {column.id}
                   </DropdownMenuCheckboxItem>
                 )
               })}
           </DropdownMenuContent>
         </DropdownMenu>

         </div>
       </div>
       <div className="rounded-md border">
         <Table>
           <TableHeader>
             {table.getHeaderGroups().map((headerGroup) => (
               <TableRow key={headerGroup.id}>
                 {headerGroup.headers.map((header) => {
                   return (
                     <TableHead key={header.id}>
                       {header.isPlaceholder
                         ? null
                         : flexRender(
                             header.column.columnDef.header,
                             header.getContext()
                           )}
                     </TableHead>
                   )
                 })}
               </TableRow>
             ))}
           </TableHeader>
           <TableBody>
             {table.getRowModel().rows?.length ? (
               table.getRowModel().rows.map((row) => (
                 <TableRow
                   key={row.id}
                   data-state={row.getIsSelected() && "selected"}
                 >
                   {row.getVisibleCells().map((cell) => (
                     <TableCell key={cell.id}>
                       {flexRender(
                         cell.column.columnDef.cell,
                         cell.getContext()
                       )}
                     </TableCell>
                   ))}
                 </TableRow>
               ))
             ) : (
               <TableRow>
                 <TableCell
                   colSpan={columns.length}
                   className="h-24 text-center"
                 >
                   No results.
                 </TableCell>
               </TableRow>
             )}
           </TableBody>
         </Table>
       </div>
       <div className="flex items-center justify-end space-x-2 py-4">
         <div className="flex-1 text-sm text-muted-foreground">
           {table.getFilteredSelectedRowModel().rows.length} of{" "}
           {table.getFilteredRowModel().rows.length} row(s) selected.
         </div>
         <div className="space-x-2">
           <Button
             variant="outline"
             size="sm"
             onClick={() => table.previousPage()}
             disabled={!table.getCanPreviousPage()}
           >
             Previous
           </Button>
           <Button
             variant="outline"
             size="sm"
             onClick={() => table.nextPage()}
             disabled={!table.getCanNextPage()}
           >
             Next
           </Button>
         </div>
       </div>
     </div>
    </CardContent>
</Card>
</div>

  )
}
