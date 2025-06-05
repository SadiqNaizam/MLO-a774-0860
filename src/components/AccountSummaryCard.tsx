import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// TSB Brand Colors
const TSB_PRIMARY_COLOR = '#00A8E1';
const TSB_TEXT_COLOR = '#131B33';

interface AccountSummaryCardProps {
  accountId: string;
  accountName: string;
  accountType: string; // e.g., "Current Account", "Savings Account"
  accountNumberSortCode: string; // e.g., "123456 / 00-11-22"
  balance: number;
  currencySymbol?: string;
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  accountId,
  accountName,
  accountType,
  accountNumberSortCode,
  balance,
  currencySymbol = '£',
}) => {
  console.log("Rendering AccountSummaryCard for:", accountName);

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold" style={{ color: TSB_TEXT_COLOR }}>
          {accountName}
        </CardTitle>
        <p className="text-sm text-gray-500">{accountType}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-gray-500">{accountNumberSortCode}</p>
        <div className="text-2xl font-bold" style={{ color: TSB_TEXT_COLOR }}>
          {currencySymbol}
          {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/accounts/${accountId}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-[--tsb-primary] text-[--tsb-primary] hover:bg-[--tsb-primary]/10 hover:text-[--tsb-primary]"
            style={
              {
                '--tsb-primary': TSB_PRIMARY_COLOR,
              } as React.CSSProperties
            }
          >
            View transactions <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AccountSummaryCard;