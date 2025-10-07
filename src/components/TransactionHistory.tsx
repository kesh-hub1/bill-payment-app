import { ArrowLeft, CheckCircle2, XCircle, Clock, Filter, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Transaction } from '../App';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function TransactionHistory({ transactions, onBack, isDarkMode, onToggleTheme }: TransactionHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1>Transaction History</h1>
                <p className="text-muted-foreground text-sm">{transactions.length} transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onToggleTheme}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {transactions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Clock className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="mb-2">No transactions yet</h3>
            <p className="text-muted-foreground">Your transaction history will appear here</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="capitalize mb-1">
                            {transaction.service}
                            {transaction.details.provider && (
                              <span className="text-muted-foreground"> • {transaction.details.provider}</span>
                            )}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>₦{transaction.amount.toLocaleString()}</p>
                          <Badge 
                            variant="secondary" 
                            className={`mt-1 ${getStatusColor(transaction.status)}`}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mt-3">
                        <span>Ref: {transaction.reference}</span>
                        {transaction.details.phoneNumber && (
                          <span>• {transaction.details.phoneNumber}</span>
                        )}
                        {transaction.details.meterNumber && (
                          <span>• Meter: {transaction.details.meterNumber}</span>
                        )}
                        {transaction.details.accountNumber && (
                          <span>• Acc: {transaction.details.accountNumber}</span>
                        )}
                        {transaction.details.package && (
                          <span>• {transaction.details.package.split(' - ')[0]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
