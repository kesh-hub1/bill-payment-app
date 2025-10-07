import { CheckCircle2, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Transaction } from '../App';

interface TransactionSuccessProps {
  transaction: Transaction;
  onBackToHome: () => void;
  isDarkMode: boolean;
}

export function TransactionSuccess({ transaction, onBackToHome, isDarkMode }: TransactionSuccessProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h2 className="mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-8">
          Your {transaction.service} payment has been processed successfully
        </p>

        <div className="bg-muted rounded-lg p-6 mb-6 space-y-3 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span>₦{transaction.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reference:</span>
            <span>{transaction.reference}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service:</span>
            <span className="capitalize">{transaction.service}</span>
          </div>
          {transaction.details.provider && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provider:</span>
              <span>{transaction.details.provider}</span>
            </div>
          )}
          {transaction.details.phoneNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone Number:</span>
              <span>{transaction.details.phoneNumber}</span>
            </div>
          )}
          {transaction.details.meterNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meter Number:</span>
              <span>{transaction.details.meterNumber}</span>
            </div>
          )}
          {transaction.details.accountNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account Number:</span>
              <span>{transaction.details.accountNumber}</span>
            </div>
          )}
          {transaction.details.package && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Package:</span>
              <span>{transaction.details.package.split(' - ')[0]}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className="text-green-600 dark:text-green-400 capitalize">{transaction.status}</span>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        <Button className="w-full" size="lg" onClick={onBackToHome}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}
