import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import NavigationMenu from '@/components/layout/NavigationMenu';
import SecurityChallengeModal from '@/components/SecurityChallengeModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Assuming Form component is from shadcn
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar'; // Assuming Calendar component is from shadcn
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // For conditional classes, if you have this util

const TSB_PRIMARY_COLOR = '#00A8E1';

const transferFormSchema = z.object({
  sourceAccount: z.string().min(1, "Please select a source account."),
  payee: z.string().min(1, "Please select a payee."),
  newPayeeName: z.string().optional(),
  newPayeeSortCode: z.string().optional(), // Add validation e.g. .regex(/^\d{2}-\d{2}-\d{2}$/, "Invalid sort code format (XX-XX-XX)")
  newPayeeAccountNumber: z.string().optional(), // Add validation e.g. .regex(/^\d{8}$/, "Invalid account number (8 digits)")
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive("Amount must be positive.")
  ),
  reference: z.string().max(50, "Reference is too long.").optional(),
  transferDate: z.date().optional(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

const TransferPage = () => {
  const [isAddingPayee, setIsAddingPayee] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState<TransferFormValues | null>(null);

  console.log('TransferPage loaded');

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      sourceAccount: '',
      payee: '',
      amount: 0,
      reference: '',
      transferDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<TransferFormValues> = (data) => {
    console.log('Transfer form submitted (review step):', data);
    setTransferDetails(data);
    setShowConfirmationDialog(true);
  };

  const handleConfirmTransfer = () => {
    setShowConfirmationDialog(false);
    setShowSecurityModal(true);
  };

  const handleVerifyOtp = async (otp: string): Promise<boolean> => {
    console.log('Verifying OTP:', otp, 'for transfer:', transferDetails);
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        if (otp === "123456") { // Mock successful OTP
          console.log("OTP Verified, transfer processed!");
          // Add toast notification for success here (e.g., using Sonner)
          form.reset();
          setIsAddingPayee(false);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const payees = [
    { id: 'payee1', name: 'John Doe - Savings' },
    { id: 'payee2', name: 'Electricity Bill' },
  ];
  const sourceAccounts = [
    { id: 'acc123', name: 'Current Account (Balance: £1,250.75)' },
    { id: 'acc456', name: 'Savings Pot (Balance: £5,800.00)' },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <NavigationMenu />
        <main className="flex-grow p-4 sm:ml-64 pb-20 sm:pb-4 space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-[--tsb-text]" style={{'--tsb-text': '#131B33'} as React.CSSProperties}>Make a Transfer</CardTitle>
              <CardDescription>Send money securely to existing or new payees.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="sourceAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sourceAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!isAddingPayee ? (
                    <FormField
                      control={form.control}
                      name="payee"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>To Payee</FormLabel>
                            <Button type="button" variant="link" size="sm" onClick={() => setIsAddingPayee(true)} className="text-[--tsb-primary]" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add New Payee
                            </Button>
                          </div>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a payee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {payees.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <Card className="p-4 border-dashed">
                      <h3 className="text-lg font-medium mb-2 text-gray-700">New Payee Details</h3>
                       <FormField
                          control={form.control}
                          name="newPayeeName"
                          render={({ field }) => (
                            <FormItem className="mb-2">
                              <FormLabel>Payee Name</FormLabel>
                              <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       <FormField
                          control={form.control}
                          name="newPayeeSortCode"
                          render={({ field }) => (
                            <FormItem className="mb-2">
                              <FormLabel>Sort Code</FormLabel>
                              <FormControl><Input placeholder="XX-XX-XX" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                       <FormField
                          control={form.control}
                          name="newPayeeAccountNumber"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel>Account Number</FormLabel>
                              <FormControl><Input placeholder="8 digits" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      <Button type="button" variant="ghost" onClick={() => setIsAddingPayee(false)}>Cancel Adding Payee</Button>
                    </Card>
                  )}

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (£)</FormLabel>
                        <FormControl><Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Birthday gift" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transferDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Transfer Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Default is today. Select a future date if needed.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>
                    Review Transfer
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>

      {transferDetails && (
        <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Transfer</AlertDialogTitle>
              <AlertDialogDescription>
                Please review the details below before confirming:
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  <li><strong>From:</strong> {sourceAccounts.find(sa => sa.id === transferDetails.sourceAccount)?.name.split(' (')[0]}</li>
                  <li><strong>To:</strong> {isAddingPayee ? transferDetails.newPayeeName : payees.find(p => p.id === transferDetails.payee)?.name}</li>
                  {isAddingPayee && <>
                    <li><strong>New Payee A/C:</strong> {transferDetails.newPayeeAccountNumber}</li>
                    <li><strong>New Payee Sort Code:</strong> {transferDetails.newPayeeSortCode}</li>
                  </>}
                  <li><strong>Amount:</strong> £{transferDetails.amount.toFixed(2)}</li>
                  <li><strong>Reference:</strong> {transferDetails.reference || 'N/A'}</li>
                  <li><strong>Date:</strong> {format(transferDetails.transferDate || new Date(), "PPP")}</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Edit Details</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmTransfer} className="bg-[--tsb-primary] hover:bg-[--tsb-primary]/90" style={{'--tsb-primary': TSB_PRIMARY_COLOR} as React.CSSProperties}>
                Proceed to Security Check
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <SecurityChallengeModal
        isOpen={showSecurityModal}
        onOpenChange={setShowSecurityModal}
        onVerify={handleVerifyOtp}
        title="Verify Transfer"
        description="Please enter the One-Time Password sent to your registered device to authorize this transfer."
      />
    </div>
  );
};

export default TransferPage;