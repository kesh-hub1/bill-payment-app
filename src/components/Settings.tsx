import { ArrowLeft, Moon, Sun, Bell, Shield, HelpCircle, LogOut, User as UserIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SettingsProps {
  onBack: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function Settings({ onBack, onViewProfile, onLogout, isDarkMode, onToggleTheme }: SettingsProps) {
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>Settings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Account Section */}
        <Card className="p-6">
          <h3 className="mb-4">Account</h3>
          <div className="space-y-4">
            <button
              onClick={onViewProfile}
              className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Profile</p>
                  <p className="text-sm text-muted-foreground">
                    View and edit your profile
                  </p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>
          </div>
        </Card>

        {/* Appearance Section */}
        <Card className="p-6">
          <h3 className="mb-4">Appearance</h3>
          <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p>Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                </p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={onToggleTheme} />
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6">
          <h3 className="mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Transaction Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about transactions
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Promotional Offers</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about offers
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="p-6">
          <h3 className="mb-4">Security</h3>
          <div className="space-y-4">
            <button
              onClick={() => toast.info('This feature is coming soon')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Change Password</p>
                  <p className="text-sm text-muted-foreground">
                    Update your password
                  </p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>

            <Separator />

            <button
              onClick={() => toast.info('This feature is coming soon')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>
          </div>
        </Card>

        {/* Help Section */}
        <Card className="p-6">
          <h3 className="mb-4">Help & Support</h3>
          <div className="space-y-4">
            <button
              onClick={() => toast.info('Opening help center...')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Help Center</p>
                  <p className="text-sm text-muted-foreground">
                    Get help and FAQs
                  </p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>

            <Separator />

            <button
              onClick={() => toast.info('Opening contact form...')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent rounded-lg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p>Contact Support</p>
                  <p className="text-sm text-muted-foreground">
                    Reach out to our team
                  </p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </button>
          </div>
        </Card>

        {/* Logout Section */}
        <Card className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <p>Logout</p>
          </button>
        </Card>

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground">
          <p>PayBills v1.0.0</p>
          <p className="mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
