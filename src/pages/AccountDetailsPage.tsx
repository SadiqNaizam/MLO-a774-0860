import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import NavigationMenu from '@/components/layout/NavigationMenu';
import TransactionListItem from '@/components/TransactionListItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Download, Search, Filter, FileText } from 'lucide-react';

// Mock data for account details and transactions
const mockAccount = {
  id: 'acc123',
  name: 'Current Account',
  type: 'Personal Current Account',
  number: '12345678',
  sortCode: '00-11-22',
  balance: 1250.75,
  availableBalance: 1200.50,
  currency: '£',
};

const mockTransactions = [
  { id: 'txn1', date: '25 Jul 2024', description: 'Tesco Superstore', amount: -45.67, type: 'debit' as 'debit' | 'credit', category: 'Groceries' },
  { id: 'txn2', date: '24 Jul 2024', description: 'Salary Payment', amount: 2500.00, type: 'credit' as 'debit' | 'credit', category: 'Income' },
  { id: 'txn3', date: '23 Jul 2024', description: 'Netflix Subscription', amount: -9.99, type: 'debit' as 'debit' | 'credit', category: 'Entertainment' },
  { id: 'txn4', date: '22 Jul 2024', description: 'Gym Membership', amount: -30.00, type: 'debit' as 'debit' | 'credit', category: 'Health' },
  { id: 'txn5', date: '20 Jul 2024', description: 'Refund from Amazon', amount: 15.99, type: 'credit' as 'debit' | 'credit', category: 'Refunds' },
  { id: 'txn6', date: '18 Jul 2024', description: 'Water Bill', amount: -55.00, type: 'debit' as 'debit' | 'credit', category: 'Bills' },
];


const AccountDetailsPage = () => {
  const { accountId } = useParams<{ accountId: string }>(); // Assuming route like /accounts/:accountId
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  console.log('AccountDetailsPage loaded for accountId:', accountId);
  // In a real app, fetch account details based on accountId

  const account = mockAccount; // Using mock data

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <NavigationMenu />
        <main className="flex-grow p-4 sm:ml-64 pb-20 sm:pb-4 space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/dashboard">Dashboard</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{account.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[--tsb-primary]" style={{ '--tsb-primary': '#00A8E1' } as React.CSSProperties}>{account.name}</CardTitle>
              <CardDescription>{account.type} - A/C No: {account.number}, Sort Code: {account.sortCode}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-2xl font-bold text-gray-800">{account.currency}{account.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-xl font-semibold text-gray-700">{account.currency}{account.availableBalance.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
                <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" /> View Statements
                </Button>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download Transactions
                </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="debit">Debits</SelectItem>
                    <SelectItem value="credit">Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                {filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="w-[100px] hidden md:table-cell">Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                         // Using TableRow and TableCell to structure items for better alignment with headers
                        <TableRow key={transaction.id} className="hover:bg-gray-100">
                            <TableCell className="font-medium hidden md:table-cell">{transaction.date}</TableCell>
                            <TableCell>
                                {transaction.description}
                                <p className="text-xs text-gray-500 block md:hidden">{transaction.date}</p>
                                {transaction.category && <p className="text-xs text-muted-foreground">{transaction.category}</p>}
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'credit' ? '+' : '-'}{account.currency}{Math.abs(transaction.amount).toFixed(2)}
                            </TableCell>
                            <TableCell className={`hidden sm:table-cell capitalize ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>{transaction.type}</TableCell>
                        </TableRow>
                        // Alternative: Directly use TransactionListItem if it fits better semantically or styling-wise
                        // <TransactionListItem key={transaction.id} {...transaction} currencySymbol={account.currency} />
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 py-4">No transactions found matching your criteria.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AccountDetailsPage;