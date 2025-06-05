import React from 'react';
import Header from '@/components/layout/Header';
import NavigationMenu from '@/components/layout/NavigationMenu';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, ArrowRight, BellRing, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const placeholderTransactions = [
  { id: 'txn1', date: '25 Jul 2024', description: 'Tesco Superstore', amount: -45.67, type: 'debit' as 'debit' | 'credit' },
  { id: 'txn2', date: '24 Jul 2024', description: 'Salary Payment', amount: 2500.00, type: 'credit' as 'debit' | 'credit' },
  { id: 'txn3', date: '23 Jul 2024', description: 'Netflix Subscription', amount: -9.99, type: 'debit' as 'debit' | 'credit' },
  { id: 'txn4', date: '22 Jul 2024', description: 'Gym Membership', amount: -30.00, type: 'debit' as 'debit' | 'credit' },
];

const DashboardPage = () => {
  console.log('DashboardPage loaded');
  const userName = "Valued Customer"; // Placeholder

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <NavigationMenu />
        <main className="flex-grow p-4 sm:ml-64 pb-20 sm:pb-4 space-y-6">
          <section aria-labelledby="dashboard-greeting">
            <h1 id="dashboard-greeting" className="text-2xl font-semibold text-gray-800">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-600">Here's your financial overview.</p>
          </section>

          <section aria-labelledby="account-summaries">
            <h2 id="account-summaries" className="text-xl font-semibold text-gray-700 mb-4">Account Summaries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AccountSummaryCard
                accountId="acc123"
                accountName="Current Account"
                accountType="Personal Current Account"
                accountNumberSortCode="123456 / 00-11-22"
                balance={1250.75}
              />
              <AccountSummaryCard
                accountId="acc456"
                accountName="Savings Pot"
                accountType="Easy Access Saver"
                accountNumberSortCode="654321 / 00-22-33"
                balance={5800.00}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section aria-labelledby="quick-actions" className="lg:col-span-1 space-y-4">
              <h2 id="quick-actions" className="text-xl font-semibold text-gray-700">Quick Actions</h2>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Button asChild className="w-full justify-start bg-[--tsb-primary] hover:bg-[--tsb-primary]/90 text-white" style={{ '--tsb-primary': '#00A8E1' } as React.CSSProperties}>
                    <Link to="/transfer">
                      <ArrowRight className="mr-2 h-4 w-4 transform rotate-[-45deg]" /> Make a Transfer
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                     <Link to="/payments">
                        <TrendingUp className="mr-2 h-4 w-4" /> Manage Payments
                     </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section aria-labelledby="recent-transactions" className="lg:col-span-2">
              <h2 id="recent-transactions" className="text-xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>A quick look at your latest account movements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    {placeholderTransactions.length > 0 ? (
                      <ul className="space-y-3">
                        {placeholderTransactions.map((txn) => (
                          <li key={txn.id} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md">
                            <div>
                              <p className="font-medium text-sm text-gray-700">{txn.description}</p>
                              <p className="text-xs text-gray-500">{txn.date}</p>
                            </div>
                            <span className={`font-semibold text-sm ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                              {txn.type === 'credit' ? '+' : '-'}£{Math.abs(txn.amount).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No recent transactions to display.</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>
          </div>

          <section aria-labelledby="alerts-notifications">
             <h2 id="alerts-notifications" className="text-xl font-semibold text-gray-700 mb-4">Alerts & Notifications</h2>
             <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                    <BellRing className="h-6 w-6 text-[--tsb-primary]" style={{ '--tsb-primary': '#00A8E1' } as React.CSSProperties} />
                    <CardTitle className="text-lg text-[--tsb-primary]" style={{ '--tsb-primary': '#00A8E1' } as React.CSSProperties}>Important Update</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-700">
                        Your new contactless debit card has been dispatched. It should arrive within 5 working days.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm mt-2 text-[--tsb-primary]" style={{ '--tsb-primary': '#00A8E1' } as React.CSSProperties}>
                        Learn more <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                </CardContent>
             </Card>
          </section>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;