import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Toaster, toast } from 'sonner';



interface CardInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCardAdded: (card: CardInfo) => void;
  amount: number;
}

export interface CardInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  lastFour: string;
}

export function CardInfoDialog({ open, onOpenChange, onCardAdded, amount }: CardInfoDialogProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cardNumber.length !== 16) {
      toast.error('Invalid card number');
      return;
    }

    if (expiryDate.length !== 4) {
      toast.error('Invalid expiry date');
      return;
    }

    if (cvv.length !== 3) {
      toast.error('Invalid CVV');
      return;
    }

    const card: CardInfo = {
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      lastFour: cardNumber.slice(-4),
    };

    onCardAdded(card);
    
    // Reset form
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Card Details</DialogTitle>
        </DialogHeader>
        
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Lock className="w-4 h-4" />
            <p className="text-sm">
              Your card information is encrypted and secure
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-holder">Card Holder Name</Label>
            <Input
              id="card-holder"
              type="text"
              placeholder="JOHN DOE"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input
                id="expiry-date"
                type="text"
                placeholder="MM/YY"
                value={formatExpiryDate(expiryDate)}
                onChange={handleExpiryChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount to Add</span>
              <span className="text-lg">₦{amount.toLocaleString()}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Add ₦{amount.toLocaleString()} to Wallet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
