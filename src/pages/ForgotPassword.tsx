import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    if (!selectedCountry || !phoneNumber) {
      toast.error('Please select country and enter phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setOtp('');
      setStep('otp');
      setIsSubmitting(false);
      toast.success('OTP sent to your phone number');
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('OTP verified! You can now reset your password');
      // Here you would typically redirect to password reset page
      navigate('/auth');
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2"
            >
              <img src="/logo.jpg" alt="Lexora Logo" className="h-12 w-auto" />
            </button>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {step === 'phone'
                ? 'Enter your phone number to receive an OTP'
                : 'Enter the 6-digit OTP sent to your phone'
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBackToLogin}
            className="flex items-center gap-2 p-0 h-auto text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>

          {step === 'phone' ? (
            // Phone Number Step
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">🇺🇸 United States (+1)</SelectItem>
                    <SelectItem value="+44">🇬🇧 United Kingdom (+44)</SelectItem>
                    <SelectItem value="+91">🇮🇳 India (+91)</SelectItem>
                    <SelectItem value="+977">🇳🇵 Nepal (+977)</SelectItem>
                    <SelectItem value="+61">🇦🇺 Australia (+61)</SelectItem>
                    <SelectItem value="+86">🇨🇳 China (+86)</SelectItem>
                    <SelectItem value="+81">🇯🇵 Japan (+81)</SelectItem>
                    <SelectItem value="+82">🇰🇷 South Korea (+82)</SelectItem>
                    <SelectItem value="+65">🇸🇬 Singapore (+65)</SelectItem>
                    <SelectItem value="+60">🇲🇾 Malaysia (+60)</SelectItem>
                    <SelectItem value="+66">🇹🇭 Thailand (+66)</SelectItem>
                    <SelectItem value="+84">🇻🇳 Vietnam (+84)</SelectItem>
                    <SelectItem value="+63">🇵🇭 Philippines (+63)</SelectItem>
                    <SelectItem value="+62">🇮🇩 Indonesia (+62)</SelectItem>
                    <SelectItem value="+852">🇭🇰 Hong Kong (+852)</SelectItem>
                    <SelectItem value="+886">🇹🇼 Taiwan (+886)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-2 border border-input bg-background rounded-md text-sm text-muted-foreground">
                    {selectedCountry || '+XX'}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1"
                    maxLength={15}
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                className="w-full"
                disabled={isSubmitting || !selectedCountry || !phoneNumber}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>
          ) : (
            // OTP Verification Step
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">
                  OTP sent to {selectedCountry} {phoneNumber}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full"
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleSendOTP}
                className="w-full"
                disabled={isSubmitting}
              >
                Resend OTP
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}