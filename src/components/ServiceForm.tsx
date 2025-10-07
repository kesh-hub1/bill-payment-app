import { useState } from 'react';
import { ArrowLeft, Smartphone, Wifi, Zap, Tv, Globe, Droplet, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ServiceType, Transaction } from '../App';
import { toast } from 'sonner@2.0.3';

interface ServiceFormProps {
  service: ServiceType;
  onBack: () => void;
  onComplete: (transaction: Transaction) => void;
  walletBalance: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const serviceConfig = {
  airtime: {
    name: 'Airtime',
    icon: Smartphone,
    color: 'bg-blue-500',
    providers: ['MTN', 'Airtel', 'Glo', '9mobile']
  },
  data: {
    name: 'Data',
    icon: Wifi,
    color: 'bg-purple-500',
    providers: ['MTN', 'Airtel', 'Glo', '9mobile'],
    packages: {
      MTN: ['1GB - ₦500', '2GB - ₦1,000', '5GB - ₦2,000', '10GB - ₦3,500'],
      Airtel: ['1.5GB - ₦500', '3GB - ₦1,000', '6GB - ₦2,000', '12GB - ₦3,500'],
      Glo: ['1.25GB - ₦500', '2.5GB - ₦1,000', '5.8GB - ₦2,000', '10GB - ₦3,000'],
      '9mobile': ['1GB - ₦500', '2.5GB - ₦1,000', '5GB - ₦2,000', '11.5GB - ₦3,500']
    }
  },
  electricity: {
    name: 'Electricity',
    icon: Zap,
    color: 'bg-yellow-500',
    providers: ['EKEDC', 'IKEDC', 'AEDC', 'PHEDC', 'KAEDC']
  },
  tv: {
    name: 'Cable TV',
    icon: Tv,
    color: 'bg-red-500',
    providers: ['DSTV', 'GOTV', 'Startimes', 'Showmax'],
    packages: {
      DSTV: ['DStv Padi - ₦2,500', 'DStv Yanga - ₦3,500', 'DStv Confam - ₦6,200', 'DStv Compact - ₦10,500'],
      GOTV: ['GOtv Lite - ₦1,300', 'GOtv Value - ₦2,250', 'GOtv Plus - ₦3,600', 'GOtv Max - ₦5,700'],
      Startimes: ['Nova - ₦1,300', 'Basic - ₦2,100', 'Smart - ₦3,200', 'Classic - ₦4,200'],
      Showmax: ['Mobile - ₦1,450', 'Standard - ₦2,900', 'Pro - ₦6,300']
    }
  },
  internet: {
    name: 'Internet',
    icon: Globe,
    color: 'bg-green-500',
    providers: ['Spectranet', 'Smile', 'Swift', 'Coollink']
  },
  water: {
    name: 'Water',
    icon: Droplet,
    color: 'bg-cyan-500',
    providers: ['Lagos Water Corporation', 'Abuja Water Board', 'Rivers Water', 'Kaduna Water']
  }
};

export function ServiceForm({ service, onBack, onComplete, walletBalance, isDarkMode, onToggleTheme }: ServiceFormProps) {
  const config = serviceConfig[service];
  const [provider, setProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionAmount = parseFloat(amount) || parseFloat(selectedPackage.split('₦')[1]?.replace(',', '') || '0');
    
    // Check if wallet has sufficient balance
    if (transactionAmount > walletBalance) {
      toast.error('Insufficient wallet balance. Please add money to your wallet.');
      return;
    }
    
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const transaction: Transaction = {
        id: Math.random().toString(36).substring(7).toUpperCase(),
        service,
        amount: transactionAmount,
        reference: `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        date: new Date().toISOString(),
        status: 'completed',
        details: {
          provider,
          phoneNumber: phoneNumber || undefined,
          meterNumber: meterNumber || undefined,
          accountNumber: accountNumber || undefined,
          package: selectedPackage || undefined
        }
      };

      toast.success('Payment successful!');
      setLoading(false);
      onComplete(transaction);
    }, 2000);
  };

  const isDataOrTV = service === 'data' || service === 'tv';
  const packages = isDataOrTV && provider ? (serviceConfig[service] as any).packages?.[provider] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className={`${config.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1>{config.name}</h1>
                  <p className="text-muted-foreground text-sm">Complete your payment</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-muted-foreground text-xs">Wallet Balance</p>
                <p className="text-sm">₦{walletBalance.toLocaleString()}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onToggleTheme}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label>Select Provider</Label>
              <Select value={provider} onValueChange={setProvider} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a provider" />
                </SelectTrigger>
                <SelectContent>
                  {config.providers.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone Number for Airtime/Data */}
            {(service === 'airtime' || service === 'data') && (
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="08012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  pattern="[0-9]{11}"
                />
              </div>
            )}

            {/* Package Selection for Data/TV */}
            {isDataOrTV && provider && packages.length > 0 && (
              <div className="space-y-2">
                <Label>Select Package</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg: string) => (
                      <SelectItem key={pkg} value={pkg}>
                        {pkg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Meter Number for Electricity */}
            {service === 'electricity' && (
              <div className="space-y-2">
                <Label>Meter Number</Label>
                <Input
                  type="text"
                  placeholder="Enter meter number"
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Account Number for TV/Internet/Water */}
            {(service === 'tv' || service === 'internet' || service === 'water') && !isDataOrTV && (
              <div className="space-y-2">
                <Label>Account Number / Smart Card Number</Label>
                <Input
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
            )}

            {service === 'tv' && provider && (
              <div className="space-y-2">
                <Label>Smart Card Number</Label>
                <Input
                  type="text"
                  placeholder="Enter smart card number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Amount for services without packages */}
            {!isDataOrTV && (
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="100"
                  step="0.01"
                />
              </div>
            )}

            {service === 'airtime' && (
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="50"
                  step="0.01"
                />
              </div>
            )}

            {/* Summary */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Provider:</span>
                <span>{provider || '-'}</span>
              </div>
              {selectedPackage && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package:</span>
                  <span>{selectedPackage.split(' - ')[0]}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span>
                  ₦{selectedPackage 
                    ? selectedPackage.split('₦')[1] 
                    : amount 
                      ? parseFloat(amount).toLocaleString() 
                      : '0.00'}
                </span>
              </div>
              <div className="border-t border-blue-200 dark:border-blue-800 pt-2 mt-2">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>
                    ₦{selectedPackage 
                      ? selectedPackage.split('₦')[1] 
                      : amount 
                        ? parseFloat(amount).toLocaleString() 
                        : '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
