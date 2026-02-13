import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface LoginViewProps {
    authMode: 'login' | 'register';
    setAuthMode: (mode: 'login' | 'register') => void;
    handleAuth: (e: React.FormEvent) => void;
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
    authMode,
    setAuthMode,
    handleAuth,
    email,
    setEmail,
    password,
    setPassword
}) => {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center font-display vet-pattern">
            <div className="w-full max-w-md px-6 py-12">
                {/* Branding Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 text-primary mb-4">
                        <span className="material-icons text-4xl">pets</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Patitas Felices</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Professional Veterinary Management</p>
                </div>

                {/* Main Login Card */}
                <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-200 dark:border-slate-800 p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {authMode === 'login'
                                ? 'Log in to manage owners, pets, and appointments.'
                                : 'Register your clinic to start managing your patients.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            icon="alternate_email"
                            placeholder="clinic.admin@vets.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            icon="lock"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {authMode === 'login' && (
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                                    type="checkbox"
                                />
                                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">
                                    Stay signed in
                                </label>
                            </div>
                        )}

                        <Button type="submit" className="w-full py-3" icon="login">
                            {authMode === 'login' ? 'Sign In to Dashboard' : 'Register Clinic'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">Secure Access</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button className="flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-800/50 cursor-not-allowed opacity-50 grayscale pointer-events-none">
                            <img
                                alt="Google"
                                className="w-4 h-4 mr-2 opacity-40 grayscale"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbU-pRePMMC_uPZzfAwlLMRFo9kTZeeU6ytxMFKbJlImdDdeMWjko2YVYVeage_Ka5pF0b5oTTudUhZwRTMIWi3f8xt4n6S96c7_WeTnOGOoHKTMSV9-BwpHSMjGfpsa0ekDjYpj8n-saiwErS1AE2UR_G5MJ35Iv8IEh56_S2W9iUrgvhLnJSadKK5aIQQVXNLNBy6qgMo4v2JLsDaheQwiD5u2S1Wi0jScIiGAD7v-LUfoSHCfIE6-o6QZl233rhXEy-7kOWV4Y"
                            />
                            Corporate SSO (Unavailable)
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="font-bold text-primary hover:underline decoration-2 underline-offset-4"
                    >
                        {authMode === 'login' ? 'Register Clinic' : 'Log In'}
                    </button>
                </p>

                {/* Aesthetic Floating Image (Desktop Only) */}
                <div className="hidden lg:block fixed bottom-0 right-0 p-12 opacity-40 select-none pointer-events-none">
                    <img
                        alt="Golden Retriever"
                        className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-xl rotate-12"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAdddj66wgwlwYKiONP8Gek2Llyvm32j-eYpVMIEp0QhVEWSCP7zeIFRh4ssQrS_36BXnMqIWZcDE3dRjq-eXZ6GXNZT_EcD2He3o2eBOI7KVV2GHQQcqyya4sCHqc_D7_CyJk-RMsqwKMS5D73MpfJtEdnT2ZIOk62gwjF9Y7QEmoQYZmivI-5mQ0iyWBym5UWDVI4E1sIMZOcVevDRnCeNOMDl1FX99xWFBvBpyanSy7uvua2VfAkVn3zT_C3eR2ULZeGj7Uq1Q"
                    />
                </div>
                <div className="hidden lg:block fixed top-0 left-0 p-12 opacity-30 select-none pointer-events-none">
                    <div className="w-32 h-32 rounded-3xl bg-primary/20 blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};
