import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Toaster, toast } from 'sonner';

import { CardInfoDialog, CardInfo } from './CardInfoDialog';

interface AddMoneyDialogProps {
  onAddMoney: (amount: number, card: CardInfo) => void;
}

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

export function AddMoneyDialog({ onAddMoney }: AddMoneyDialogProps) {
  const [open, setOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    
    if (value > 0) {
      setSelectedAmount(value);
      setOpen(false);
      setCardDialogOpen(true);
    }
  };

  const handleCardAdded = (card: CardInfo) => {
    onAddMoney(selectedAmount, card);
    toast.success(`₦${selectedAmount.toLocaleString()} added to your wallet!`);
    setAmount('');
    setSelectedAmount(0);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            Add Money
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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

            <div className="space-y-2">
              <Label>Quick Add</Label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickAmount(value)}
                    className="w-full"
                  >
                    ₦{value.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Continue with ₦{amount ? parseFloat(amount).toLocaleString() : '0.00'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <CardInfoDialog
        open={cardDialogOpen}
        onOpenChange={setCardDialogOpen}
        onCardAdded={handleCardAdded}
        amount={selectedAmount}
      />
    </>
  );
}
