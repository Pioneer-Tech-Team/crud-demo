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
import {
  DragHandleDots2Icon,
  EyeOpenIcon,
  Pencil2Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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

const data = [
  {
    company_group: 'Tata',
    contact_person:'Subramanyan Swami',
    phone:'9876543210',
    email:'contact@tata.in'
  },
  {
    company_group: 'abc',
    contact_person:'Subramanyan ',
    phone:'9876543210',
    email:'contact@tata.in'
  },
  {
    company_group: 'xyz',
    contact_person:' Swami',
    phone:'9876543210',
    email:'contact@tata.in'
  },
]

export const columns = [
  {
    id: "name",
    accessorKey: "name",
    header: () => (<div >Company Group</div>),
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex items-center">
          <div>{data.company_group}</div>
        </div>
      )
    },
  },
  {
    id: "contact_person",
    accessorKey: "contact_person",
    header: () => (<div >Contact Person</div>),
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex items-center">
          <div>{data.contact_person}</div>
        </div>
      )
    },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: () => (<div >Phone</div>),
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex items-center">
          <div>{data.phone}</div>
        </div>
      )
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: () => (<div >Email</div>),
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className="flex items-center">
          <div>{data.email}</div>
        </div>
      )
    },
  },

  {
    id: "actions",
    accessorKey: "actions",
    header: () => (<div >Actions</div>),
    cell: ({ row }) => {


      const form = useForm<CompanyAddFormFields>({
        resolver: zodResolver(companyAddFormSchema),
        defaultValues: {
          name: "",
          'contact-person': "",
          phone: "",
          email: "",
        },
      });

      async function handleFormSubmit(data: CompanyAddFormFields) {
        const res = await client.POST("/api/group/edit", {
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
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger>
              <Button variant="default" className="h-8 w-8 p-0">
                <span className="sr-only">View</span>
                <EyeOpenIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>View Company Group</DialogTitle>
                <DialogDescription>
                  <table className="w-full mt-2 border-gray-950 table" border={1}>
                    {/* <thead className="bg-purple-300 p-3 text-center border-black text-black">
                Company
        </thead> */}
                    <tbody>
                      <tr>
                        <td className="bg-orange-200 p-3 text-center text-black">Company Group</td>
                        <td className="text-black p-3 text-center">Tata</td>
                      </tr>
                      <tr>
                        <td className="bg-orange-200 p-3 text-center text-black">Sales Person</td>
                        <td className="text-black p-3 text-center">Subramanyan Swami</td>
                      </tr>
                      <tr>
                        <td className="bg-orange-200 p-3 text-center text-black">Phone</td>
                        <td className="text-black p-3 text-center">9876543210</td>
                      </tr>
                      <tr>
                        <td className="bg-orange-200 p-3 text-center text-black">Email</td>
                        <td className="text-black p-3 text-center">contact@tata.in</td>
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
                                  <FormLabel>Company Group</FormLabel>
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
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-[70%] my-auto">
        <CardHeader>
          <CardTitle>View Companies</CardTitle>
        </CardHeader>
        <CardContent>

          <div className="w-full">

            <div className="flex justify-between py-4">
              <Input
              disabled
                placeholder="Filter data..."
                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("email")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <div className="flex gap-2">
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
                                  <FormLabel>Company Group</FormLabel>
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

                      <DragHandleDots2Icon className="ml-2 h-4 w-4" />
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
