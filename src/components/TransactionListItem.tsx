import React from 'react';
import { TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react'; // Example icons

// TSB Brand Colors
const TSB_TEXT_COLOR = '#131B33';
const POSITIVE_COLOR = 'text-green-600'; // Standard positive color
const NEGATIVE_COLOR = 'text-red-600'; // Standard negative color

interface TransactionListItemProps {
  id: string;
  date: string; // Formatted date string, e.g., "20 Jul 2024"
  description: string;
  amount: number;
  currencySymbol?: string;
  type: 'credit' | 'debit' | 'info'; // To determine icon and styling
  category?: string; // Optional category
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({
  date,
  description,
  amount,
  currencySymbol = '£',
  type,
  category,
}) => {
  console.log("Rendering TransactionListItem:", description);

  const isCredit = type === 'credit';
  const amountColor = isCredit ? POSITIVE_COLOR : (type === 'debit' ? NEGATIVE_COLOR : 'text-gray-700');
  const Icon = isCredit ? TrendingUp : (type === 'debit' ? TrendingDown : CircleDollarSign);

  return (
    <div className="flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full bg-gray-100 ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: TSB_TEXT_COLOR }}>
            {description}
          </p>
          <p className="text-xs text-gray-500">
            {date} {category && `• ${category}`}
          </p>
        </div>
      </div>
      <div className={`text-sm font-semibold ${amountColor}`}>
        {isCredit ? '+' : (type === 'debit' ? '-' : '')}
        {currencySymbol}
        {Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default TransactionListItem;