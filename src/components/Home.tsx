import { 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  Globe, 
  Droplet,
  History,
  Wallet,
  TrendingUp,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ServiceType } from '../App';
import { AddMoneyDialog } from './AddMoneyDialog';
import { CardInfo } from './CardInfoDialog';

interface HomeProps {
  onServiceSelect: (service: ServiceType) => void;
  onViewHistory: () => void;
  onViewSettings: () => void;
  transactionCount: number;
  walletBalance: number;
  onAddMoney: (amount: number, card: CardInfo) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const services = [
  {
    id: 'airtime' as ServiceType,
    name: 'Airtime',
    icon: Smartphone,
    color: 'bg-blue-500',
    description: 'Top up airtime'
  },
  {
    id: 'data' as ServiceType,
    name: 'Data',
    icon: Wifi,
    color: 'bg-purple-500',
    description: 'Buy data bundles'
  },
  {
    id: 'electricity' as ServiceType,
    name: 'Electricity',
    icon: Zap,
    color: 'bg-yellow-500',
    description: 'Pay electricity bills'
  },
  {
    id: 'tv' as ServiceType,
    name: 'Cable TV',
    icon: Tv,
    color: 'bg-red-500',
    description: 'Renew subscriptions'
  },
  {
    id: 'internet' as ServiceType,
    name: 'Internet',
    icon: Globe,
    color: 'bg-green-500',
    description: 'Pay internet bills'
  },
  {
    id: 'water' as ServiceType,
    name: 'Water',
    icon: Droplet,
    color: 'bg-cyan-500',
    description: 'Pay water bills'
  }
];

export function Home({ onServiceSelect, onViewHistory, onViewSettings, transactionCount, walletBalance, onAddMoney, isDarkMode, onToggleTheme }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1>PayBills</h1>
                <p className="text-muted-foreground text-sm">Pay all your bills in one place</p>
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
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onViewSettings}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={onViewHistory}
                className="gap-2"
              >
                <History className="w-4 h-4" />
                History
                {transactionCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs">
                    {transactionCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 text-white p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Wallet Balance</p>
              <h2 className="text-white text-3xl">₦{walletBalance.toLocaleString()}</h2>
            </div>
            <AddMoneyDialog onAddMoney={onAddMoney} />
          </div>
          <div className="mt-6 flex items-center gap-2 text-blue-100 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>You've saved ₦2,340 this month</span>
          </div>
        </Card>

        {/* Services Grid */}
        <div>
          <h3 className="mb-4">Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-700"
                onClick={() => onServiceSelect(service.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`${service.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{service.name}</h4>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-muted-foreground text-sm mb-1">This Month</p>
            <p className="text-2xl">₦12,450</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm mb-1">Total Transactions</p>
            <p className="text-2xl">{transactionCount}</p>
          </Card>
          <Card className="p-4">
            <p className="text-muted-foreground text-sm mb-1">Saved This Year</p>
            <p className="text-2xl">₦28,900</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
