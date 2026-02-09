import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-seafoam-950 p-6 font-sans">
            <Head title="Log in" />

            <div className="flex w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10">
                {/* Left Side: Seafoam Branding */}
                <div className="hidden w-[40%] flex-col items-center justify-center bg-seafoam-900 p-12 text-white md:flex relative overflow-hidden">
                    {/* Decorative Abstract Background Element */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-seafoam-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-seafoam-400/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10 mb-8 rounded-[2rem] bg-white/10 p-6 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <ApplicationLogo className="h-16 w-20 fill-current text-white" />
                    </div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
                            SiPos
                        </h1>
                        <p className="mt-1.5 text-seafoam-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            Management System
                        </p>
                        <p className="mt-6 text-seafoam-100/70 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                            Solusi digital cerdas untuk <br /> pemantauan kesehatan terpadu.
                        </p>
                    </div>
                    <div className="relative z-10 mt-auto pt-10 text-seafoam-500 font-bold text-[9px] uppercase tracking-widest">
                        &copy; 2026 Posyandu & Posbindu
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex w-full flex-col justify-center p-8 md:w-[60%] lg:p-14 relative bg-white">
                    {/* Mobile Logo Branding */}
                    <div className="mb-10 md:hidden flex flex-col items-center">
                        <div className="rounded-2xl bg-seafoam-50 p-3 border border-seafoam-100">
                            <ApplicationLogo className="h-8 w-10 fill-current text-seafoam-600" />
                        </div>
                        <h1 className="mt-3 text-xl font-black text-slate-900 tracking-tighter uppercase">SiPos</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Selamat Datang</h2>
                        <p className="mt-1.5 text-slate-500 text-sm font-medium">Masukkan kredensial Anda untuk mengakses panel.</p>
                    </div>

                    {status && (
                        <div className="mb-6 rounded-2xl bg-seafoam-50 p-4 text-sm font-bold text-seafoam-700 border border-seafoam-100">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Alamat Email" className="text-slate-700 font-black text-[11px] uppercase tracking-wider mb-2 ml-1" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-seafoam-500/10 focus:border-seafoam-500 rounded-2xl py-3 transition-all duration-200 font-bold text-sm text-slate-700 placeholder:text-slate-300"
                                placeholder="admin@epos.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-xs font-bold text-rose-500" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <InputLabel htmlFor="password" value="Kata Sandi" className="text-slate-700 font-black text-[11px] uppercase tracking-wider" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[10px] font-black text-seafoam-600 hover:text-seafoam-700 uppercase tracking-widest"
                                    >
                                        Lupa?
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-seafoam-500/10 focus:border-seafoam-500 rounded-2xl py-3 transition-all duration-200 font-bold text-sm text-slate-700 placeholder:text-slate-300"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-xs font-bold text-rose-500" />
                        </div>

                        <div className="flex items-center ml-1">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                className="rounded-lg border-slate-300 text-seafoam-600 shadow-sm focus:ring-seafoam-500"
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-3 text-xs font-bold text-slate-500">Ingat Saya</span>
                        </div>

                        <div className="pt-6">
                            <PrimaryButton 
                                className="w-full justify-center rounded-2xl bg-seafoam-600 hover:bg-seafoam-700 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-seafoam-200/50 active:scale-[0.98] border-none" 
                                disabled={processing}
                            >
                                Masuk ke Sistem
                            </PrimaryButton>
                        </div>
                    </form>

                                        <div className="mt-8 text-center border-t border-slate-50 pt-6">

                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">

                                                Posyandu & Posbindu Terintegrasi

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        );

                    }

                    
