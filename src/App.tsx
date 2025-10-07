import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Home } from './components/Home';
import { ServiceForm } from './components/ServiceForm';
import { TransactionSuccess } from './components/TransactionSuccess';
import { TransactionHistory } from './components/TransactionHistory';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Toaster } from './components/ui/sonner';
import { CardInfo } from './components/CardInfoDialog';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

export type ServiceType = 'airtime' | 'data' | 'electricity' | 'tv' | 'internet' | 'water';

export interface Transaction {
  id: string;
  service: ServiceType;
  amount: number;
  reference: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  details: {
    provider?: string;
    phoneNumber?: string;
    meterNumber?: string;
    accountNumber?: string;
    package?: string;
  };
}

type Screen = 'auth' | 'home' | 'service' | 'success' | 'history' | 'profile' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [walletBalance, setWalletBalance] = useState(25430);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && userId && accessToken) {
      fetchUserData();
    }
  }, [isAuthenticated, userId, accessToken]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.access_token && session?.user?.id) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setAccessToken(session.access_token);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('auth');
      }
    } catch (error) {
      console.error('Session check error:', error);
      setCurrentScreen('auth');
    } finally {
      setIsLoadingSession(false);
    }
  };

  const fetchUserData = async () => {
    if (!accessToken) return;

    try {
      // Fetch wallet balance
      const walletResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12ba995f/wallet`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        if (walletData.wallet?.balance !== undefined) {
          setWalletBalance(walletData.wallet.balance);
        }
      }

      // Fetch transactions
      const transactionsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12ba995f/transactions`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        if (transactionsData.transactions) {
          setTransactions(transactionsData.transactions);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateWalletBalance = async (newBalance: number) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12ba995f/wallet`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ balance: newBalance }),
        }
      );

      if (response.ok) {
        setWalletBalance(newBalance);
      }
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12ba995f/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(transaction),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.transactions) {
          setTransactions(data.transactions);
        }
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const saveCard = async (card: CardInfo) => {
    if (!accessToken) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12ba995f/cards`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            lastFour: card.lastFour,
            cardHolder: card.cardHolder,
          }),
        }
      );
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleAuthSuccess = (uid: string, token: string) => {
    setIsAuthenticated(true);
    setUserId(uid);
    setAccessToken(token);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setAccessToken(null);
    setCurrentScreen('auth');
    setTransactions([]);
    setWalletBalance(25430);
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setCurrentScreen('service');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedService(null);
  };

  const handleTransactionComplete = (transaction: Transaction) => {
    const newBalance = walletBalance - transaction.amount;
    setLastTransaction(transaction);
    updateWalletBalance(newBalance);
    addTransaction(transaction);
    setCurrentScreen('success');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedService(null);
    setLastTransaction(null);
  };

  const handleViewHistory = () => {
    setCurrentScreen('history');
  };

  const handleViewProfile = () => {
    setCurrentScreen('profile');
  };

  const handleViewSettings = () => {
    setCurrentScreen('settings');
  };

  const handleAddMoney = (amount: number, card: CardInfo) => {
    const newBalance = walletBalance + amount;
    updateWalletBalance(newBalance);
    saveCard(card);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated && currentScreen === 'auth' && (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
      
      {isAuthenticated && currentScreen === 'home' && (
        <Home 
          onServiceSelect={handleServiceSelect}
          onViewHistory={handleViewHistory}
          onViewSettings={handleViewSettings}
          transactionCount={transactions.length}
          walletBalance={walletBalance}
          onAddMoney={handleAddMoney}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}
      
      {isAuthenticated && currentScreen === 'service' && selectedService && (
        <ServiceForm
          service={selectedService}
          onBack={handleBack}
          onComplete={handleTransactionComplete}
          walletBalance={walletBalance}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}
      
      {isAuthenticated && currentScreen === 'success' && lastTransaction && (
        <TransactionSuccess
          transaction={lastTransaction}
          onBackToHome={handleBackToHome}
          isDarkMode={isDarkMode}
        />
      )}
      
      {isAuthenticated && currentScreen === 'history' && (
        <TransactionHistory
          transactions={transactions}
          onBack={handleBack}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}

      {isAuthenticated && currentScreen === 'profile' && userId && accessToken && (
        <Profile
          onBack={handleBack}
          accessToken={accessToken}
          userId={userId}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}

      {isAuthenticated && currentScreen === 'settings' && (
        <Settings
          onBack={handleBack}
          onViewProfile={handleViewProfile}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}
      
      <Toaster />
    </div>
  );
}
