import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
  { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
];

type RecoveryMethod = 'phone' | 'email';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'method' | 'phone' | 'email' | 'otp'>('method');
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>('phone');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryCodeInput, setCountryCodeInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Auto-select country when country code is entered
  useEffect(() => {
    if (countryCodeInput) {
      const country = countries.find(c => c.code === countryCodeInput);
      if (country) {
        setSelectedCountry(country.code);
      } else {
        setSelectedCountry('');
      }
    } else {
      setSelectedCountry('');
    }
  }, [countryCodeInput]);

  // Update country code input when country is selected from dropdown
  useEffect(() => {
    if (selectedCountry && !countryCodeInput) {
      setCountryCodeInput(selectedCountry);
    }
  }, [selectedCountry, countryCodeInput]);

  const handleCountryCodeChange = (value: string) => {
    // Allow only + followed by digits
    const cleanValue = value.replace(/[^\+\d]/g, '');
    if (cleanValue === '' || cleanValue === '+') {
      setCountryCodeInput(cleanValue);
    } else if (cleanValue.startsWith('+') && cleanValue.length <= 5) {
      setCountryCodeInput(cleanValue);
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setCountryCodeInput(countryCode);
  };

  const handleMethodSelect = (method: RecoveryMethod) => {
    setRecoveryMethod(method);
    setStep(method);
  };

  const handleSendOTP = async () => {
    if (recoveryMethod === 'phone') {
      if (!selectedCountry || !phoneNumber) {
        toast.error('Please select country and enter phone number');
        return;
      }
      if (phoneNumber.length < 10) {
        toast.error('Please enter a valid phone number');
        return;
      }
    } else {
      if (!email || !email.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setOtp('');
      setStep('otp');
      setIsSubmitting(false);
      toast.success(`OTP sent to your ${recoveryMethod === 'phone' ? 'phone number' : 'email'}`);
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

  const handleBack = () => {
    if (step === 'otp') {
      setStep(recoveryMethod);
      setOtp('');
    } else if (step === 'phone' || step === 'email') {
      setStep('method');
      setPhoneNumber('');
      setEmail('');
      setSelectedCountry('');
      setCountryCodeInput('');
    } else {
      navigate('/auth');
    }
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
              {step === 'method' && 'Choose how you want to recover your password'}
              {step === 'phone' && 'Enter your phone number to receive an OTP'}
              {step === 'email' && 'Enter your email address to receive an OTP'}
              {step === 'otp' && `Enter the 6-digit OTP sent to your ${recoveryMethod === 'phone' ? 'phone' : 'email'}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 p-0 h-auto text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 'method' ? 'Back to Login' : 'Back'}
          </Button>

          {step === 'method' ? (
            // Method Selection Step
            <div className="space-y-4">
              <div className="space-y-3">
                <Button
                  onClick={() => handleMethodSelect('phone')}
                  variant="outline"
                  className="w-full h-16 flex items-center gap-3 justify-start"
                >
                  <Phone className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Phone Number</div>
                    <div className="text-sm text-muted-foreground">Receive OTP via SMS</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleMethodSelect('email')}
                  variant="outline"
                  className="w-full h-16 flex items-center gap-3 justify-start"
                >
                  <Mail className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Email Address</div>
                    <div className="text-sm text-muted-foreground">Receive OTP via email</div>
                  </div>
                </Button>
              </div>
            </div>
          ) : step === 'phone' ? (
            // Phone Number Step
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="countryCode">Country Code</Label>
                <Input
                  id="countryCode"
                  type="text"
                  placeholder="+1"
                  value={countryCodeInput}
                  onChange={(e) => handleCountryCodeChange(e.target.value)}
                  className="text-center font-mono"
                  maxLength={5}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your country code (e.g., +91) or select from dropdown below
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={handleCountrySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-2 border border-input bg-background rounded-md text-sm text-muted-foreground font-mono min-w-[60px] justify-center">
                    {countryCodeInput || '+XX'}
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
          ) : step === 'email' ? (
            // Email Step
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send a 6-digit OTP to this email address
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                className="w-full"
                disabled={isSubmitting || !email || !email.includes('@')}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
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
                  OTP sent to {recoveryMethod === 'phone'
                    ? `${selectedCountry} ${phoneNumber}`
                    : email
                  }
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