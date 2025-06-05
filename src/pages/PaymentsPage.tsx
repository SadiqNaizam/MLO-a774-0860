import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

const TSB_PRIMARY_COLOR = '#00A8E1';

const billPaymentSchema = z.object({
  payeeName: z.string().min(1, "Payee name is required"),
  reference: z.string().min(1, "Reference is required"),
  amount: z.preprocess(val => parseFloat(String(val)), z.number().positive("Amount must be positive")),
  paymentDate: z.string().min(1, "Payment date is required"), // Simple string for now
});
type BillPaymentFormValues = z.infer<typeof billPaymentSchema>;

const standingOrderSchema = z.object({
  payeeName: z.string().min(1, "Payee name is required"),
  sortCode: z.string().regex(/^\d{2}-\d{2}-\d{2}$/, "Invalid sort code (XX-XX-XX)"),
  accountNumber: z.string().regex(/^\d{8}$/, "Invalid account number (8 digits)"),
  amount: z.preprocess(val => parseFloat(String(val)), z.number().positive("Amount must be positive")),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().min(1, "Start date is required"),
  reference: z.string().optional(),
});
type StandingOrderFormValues = z.infer<typeof standingOrderSchema>;

const PaymentsPage = () => {
  console.log('PaymentsPage loaded');
  const [isBillPaymentDialogOpen, setIsBillPaymentDialogOpen] = useState(false);
  const [isStandingOrderDialogOpen, setIsStandingOrderDialogOpen] = useState(false);

  const billPaymentForm = useForm<BillPaymentFormValues>({ resolver: zodResolver(billPaymentSchema) });
  const standingOrderForm = useForm<StandingOrderFormValues>({ resolver: zodResolver(standingOrderSchema) });

  const onBillPaymentSubmit = (data: BillPaymentFormValues) => {
    console.log("New Bill Payment:", data);
    // Add logic to save bill payment
    setIsBillPaymentDialogOpen(false);
    billPaymentForm.reset();
  };

  const onStandingOrderSubmit = (data: StandingOrderFormValues) => {
    console.log("New Standing Order:", data);
    // Add logic to save standing order
    setIsStandingOrderDialogOpen(false);
    standingOrderForm.reset();
  };

  const mockBillPayees = [
    { id: 'bp1', name: 'EDF Energy', lastPaid: '£75.00 on 15 Jul 2024', nextDue: '15 Aug 2024' },
    { id: 'bp2', name: 'Council Tax', lastPaid: '£150.00 on 01 Jul 2024', nextDue: '01 Aug 2024' },
  ];
  const mockStandingOrders = [
    { id: 'so1', payee: 'Landlord Rent', amount: '£800.00', frequency: 'Monthly', nextDate: '01 Aug 2024' },
    { id: 'so2', payee: 'Charity Donation', amount: '£20.00', frequency: 'Monthly', nextDate: '10 Aug 2024' },
  ];
  const mockDirectDebits = [
    { id: 'dd1', originator: 'Netflix', amount: '£9.99', frequency: 'Monthly', lastCollected: '23 Jul 2024' },
    { id: 'dd2', originator: 'O2 Mobile', amount: '£35.00', frequency: 'Monthly', lastCollected: '10 Jul 2024' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <NavigationMenu />
        <main className="flex-grow p-4 sm:ml-64 pb-20 sm:pb-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[--tsb-text]" style={{'--tsb-text': '#131B33'} as React.CSSProperties}>Manage Payments</CardTitle>
              <CardDescription>Oversee your bill payments, standing orders, and direct debits.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bill-payments">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bill-payments">Bill Payments</TabsTrigger>
                  <TabsTrigger value="standing-orders">Standing Orders</TabsTrigger>
                  <TabsTrigger value="direct-debits">Direct Debits</TabsTrigger>
                </TabsList>

                <TabsContent value="bill-payments" className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Your Bill Payees</h3>
                    <Dialog open={isBillPaymentDialogOpen} onOpenChange={setIsBillPaymentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Bill Payment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Add New Bill Payment</DialogTitle></DialogHeader>
                        <Form {...billPaymentForm}>
                          <form onSubmit={billPaymentForm.handleSubmit(onBillPaymentSubmit)} className="space-y-4">
                            {/* Form fields for bill payment */}
                            <FormField control={billPaymentForm.control} name="payeeName" render={({ field }) => (<FormItem><FormLabel>Payee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={billPaymentForm.control} name="reference" render={({ field }) => (<FormItem><FormLabel>Payment Reference</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={billPaymentForm.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount (£)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={billPaymentForm.control} name="paymentDate" render={({ field }) => (<FormItem><FormLabel>Payment Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsBillPaymentDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>Save Payment</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader><TableRow><TableHead>Payee</TableHead><TableHead>Last Paid / Next Due</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {mockBillPayees.map(p => (
                        <TableRow key={p.id}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>Paid: {p.lastPaid}<br/>Due: {p.nextDue}</TableCell>
                          <TableCell className="space-x-1"><Button variant="ghost" size="icon"><Edit3 className="h-4 w-4"/></Button><Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4"/></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="standing-orders" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Your Standing Orders</h3>
                    <Dialog open={isStandingOrderDialogOpen} onOpenChange={setIsStandingOrderDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Set Up Standing Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader><DialogTitle>Set Up New Standing Order</DialogTitle></DialogHeader>
                        <Form {...standingOrderForm}>
                          <form onSubmit={standingOrderForm.handleSubmit(onStandingOrderSubmit)} className="space-y-3">
                             <FormField control={standingOrderForm.control} name="payeeName" render={({ field }) => (<FormItem><FormLabel>Payee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <div className="grid grid-cols-2 gap-3">
                                <FormField control={standingOrderForm.control} name="sortCode" render={({ field }) => (<FormItem><FormLabel>Sort Code</FormLabel><FormControl><Input placeholder="XX-XX-XX" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={standingOrderForm.control} name="accountNumber" render={({ field }) => (<FormItem><FormLabel>Account Number</FormLabel><FormControl><Input placeholder="8 digits" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             </div>
                             <FormField control={standingOrderForm.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount (£)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={standingOrderForm.control} name="frequency" render={({ field }) => (<FormItem><FormLabel>Frequency</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="annually">Annually</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                             <FormField control={standingOrderForm.control} name="startDate" render={({ field }) => (<FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <FormField control={standingOrderForm.control} name="reference" render={({ field }) => (<FormItem><FormLabel>Reference (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsStandingOrderDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>Save Order</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader><TableRow><TableHead>Payee</TableHead><TableHead>Amount</TableHead><TableHead>Frequency</TableHead><TableHead>Next Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {mockStandingOrders.map(so => (
                        <TableRow key={so.id}>
                          <TableCell>{so.payee}</TableCell><TableCell>{so.amount}</TableCell><TableCell>{so.frequency}</TableCell><TableCell>{so.nextDate}</TableCell>
                          <TableCell className="space-x-1"><Button variant="ghost" size="icon"><Edit3 className="h-4 w-4"/></Button><Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4"/></Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="direct-debits" className="mt-4">
                  <h3 className="text-lg font-medium mb-4">Active Direct Debits</h3>
                  <Table>
                    <TableHeader><TableRow><TableHead>Originator</TableHead><TableHead>Amount</TableHead><TableHead>Frequency</TableHead><TableHead>Last Collected</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {mockDirectDebits.map(dd => (
                        <TableRow key={dd.id}>
                          <TableCell>{dd.originator}</TableCell><TableCell>{dd.amount}</TableCell><TableCell>{dd.frequency}</TableCell><TableCell>{dd.lastCollected}</TableCell>
                          <TableCell><Button variant="link" size="sm" className="text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>Cancel</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PaymentsPage;