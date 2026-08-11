import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SEO } from '../../components/SEO';
import { Eye, EyeOff } from 'lucide-react';
import { AccountDashboard } from './AccountDashboard';
import { FirebaseError } from 'firebase/app';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Invalid phone number" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function Login() {
  const user = useAuthStore((state: any) => state.user);
  const isAdmin = useAuthStore((state: any) => state.isAdmin);
  const userRole = useAuthStore((state: any) => state.userRole);
  const isStaff = userRole && ['admin', 'super_admin', 'store_owner', 'inventory_manager', 'order_manager', 'marketing_manager', 'customer_support'].includes(userRole);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors, isSubmitting: isLoginSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors, isSubmitting: isSignupSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      await authService.signInWithEmail(data.email, data.password);
    } catch (error: any) {
      console.error("Login error:", error);
      const code = error?.code || "";
      const message = error?.message || "An unknown error occurred";
      
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password' || 
          message.includes('auth/invalid-credential') || message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
        setAuthError("Password or Email Incorrect");
      } else {
        const cleanMessage = message.replace("Firebase: ", "");
        setAuthError(cleanMessage);
      }
    }
  };

  const onSignupSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    try {
      await authService.registerWithEmail(data.email, data.password, data.name, data.phone);
    } catch (error: any) {
      console.error("Signup error:", error);
      const code = error?.code || "";
      const message = error?.message || "An unknown error occurred";
      
      if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use') || message.includes('email-already-in-use')) {
        setAuthError("User already exists. Sign in?");
      } else {
        const cleanMessage = message.replace("Firebase: ", "");
        setAuthError(cleanMessage);
      }
    }
  };

  if (user) {
    return (
      <>
        <SEO title="Account | Jo Accessories" />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-serif mb-4">Welcome back, {user.displayName || user.email}</h1>
          <div className="flex items-center justify-center gap-4 mt-8">
            {isStaff && (
              <button 
                onClick={() => navigate('/admin')}
                className="bg-ash text-white px-6 py-2 text-sm uppercase tracking-widest hover:bg-ash/90 transition-colors"
              >
                Admin Dashboard
              </button>
            )}
            <button 
              onClick={() => authService.logout()}
              className="border border-ash text-ash px-6 py-2 text-sm uppercase tracking-widest hover:bg-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={isLogin ? "Sign In | Jo Accessories" : "Sign Up | Jo Accessories"} />
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-full max-w-md bg-white p-8 border border-ash-light shadow-sm">
          <h1 className="text-2xl font-serif uppercase tracking-widest text-center mb-8">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-100">
              {authError}
              {authError === "User already exists. Sign in?" && (
                <button 
                  onClick={() => {
                    setIsLogin(true);
                    setAuthError(null);
                  }}
                  className="ml-2 font-semibold underline"
                >
                  Switch to Sign In
                </button>
              )}
            </div>
          )}

          <button 
            onClick={() => authService.signInWithGoogle()}
            className="w-full border border-ash-light py-3 mb-6 flex items-center justify-center gap-3 hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ash-light"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-ash-muted uppercase tracking-widest">Or</span>
            </div>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-ash-muted mb-2">Email</label>
                <input 
                  type="email"
                  {...registerLogin("email")}
                  className={`w-full border-b ${loginErrors.email ? 'border-red-500' : 'border-ash-light'} px-1 py-3 bg-transparent text-sm focus:outline-none focus:border-ash transition-colors`}
                  placeholder="Email address"
                />
                {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ash-muted mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...registerLogin("password")}
                    className={`w-full border-b ${loginErrors.password ? 'border-red-500' : 'border-ash-light'} px-1 py-3 bg-transparent pr-10 text-sm focus:outline-none focus:border-ash transition-colors`}
                    placeholder="Password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ash-muted hover:text-ash-muted"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>}
              </div>
              <button 
                type="submit" 
                disabled={isLoginSubmitting}
                className="w-full bg-ash text-white py-4 uppercase tracking-widest text-xs font-semibold hover:bg-ash/90 transition-colors mt-6 disabled:opacity-50"
              >
                {isLoginSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-ash-muted mb-2">Full Name</label>
                <input 
                  type="text"
                  {...registerSignup("name")}
                  className={`w-full border-b ${signupErrors.name ? 'border-red-500' : 'border-ash-light'} px-1 py-3 bg-transparent text-sm focus:outline-none focus:border-ash transition-colors`}
                  placeholder="Jane Doe"
                />
                {signupErrors.name && <p className="text-red-500 text-xs mt-1">{signupErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ash-muted mb-2">Email</label>
                <input 
                  type="email"
                  {...registerSignup("email")}
                  className={`w-full border-b ${signupErrors.email ? 'border-red-500' : 'border-ash-light'} px-1 py-3 bg-transparent text-sm focus:outline-none focus:border-ash transition-colors`}
                  placeholder="Email address"
                />
                {signupErrors.email && <p className="text-red-500 text-xs mt-1">{signupErrors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ash-muted mb-2">Phone Number</label>
                <input 
                  type="tel"
                  {...registerSignup("phone")}
                  className={`w-full border-b ${signupErrors.phone ? 'border-red-500' : 'border-ash-light'} px-1 py-3 bg-transparent text-sm focus:outline-none focus:border-ash transition-colors`}
                  placeholder="+1 (555) 000-0000"
                />
                {signupErrors.phone && <p className="text-red-500 text-xs mt-1">{signupErrors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ash-muted mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...registerSignup("password")}
                    className={`w-full border-b ${signupErrors.password ? 'border-red-500' : 'border-ash-light'} px-1 py-3 bg-transparent pr-10 text-sm focus:outline-none focus:border-ash transition-colors`}
                    placeholder="Password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ash-muted hover:text-ash-muted"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signupErrors.password && <p className="text-red-500 text-xs mt-1">{signupErrors.password.message}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-ash-muted mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...registerSignup("confirmPassword")}
                    className={`w-full border-b ${signupErrors.confirmPassword ? 'border-red-500' : 'border-ash-light'} px-1 py-3 bg-transparent pr-10 text-sm focus:outline-none focus:border-ash transition-colors`}
                    placeholder="Repeat password"
                  />
                </div>
                {signupErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{signupErrors.confirmPassword.message}</p>}
              </div>
              <button 
                type="submit" 
                disabled={isSignupSubmitting}
                className="w-full bg-ash text-white py-4 uppercase tracking-widest text-xs font-semibold hover:bg-ash/90 transition-colors mt-6 disabled:opacity-50"
              >
                {isSignupSubmitting ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-ash-muted">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => {
                    setIsLogin(false);
                    setAuthError(null);
                  }} 
                  className="font-semibold text-ash underline hover:text-ash"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    setIsLogin(true);
                    setAuthError(null);
                  }} 
                  className="font-semibold text-ash underline hover:text-ash"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
