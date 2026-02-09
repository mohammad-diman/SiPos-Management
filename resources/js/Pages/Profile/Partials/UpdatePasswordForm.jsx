import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-5">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Keamanan Password
                </h2>

                <p className="mt-0.5 text-xs font-medium text-slate-500">
                    Pastikan akun Anda menggunakan password yang panjang dan acak.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Password Saat Ini"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="w-full rounded-2xl border-none bg-slate-50 py-2.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password Baru" className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full rounded-2xl border-none bg-slate-50 py-2.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password Baru"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="w-full rounded-2xl border-none bg-slate-50 py-2.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-seafoam-500/10 transition-all"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton 
                        disabled={processing}
                        className="rounded-2xl px-6 py-3 bg-seafoam-600 hover:bg-seafoam-700 shadow-xl shadow-seafoam-100 border-none font-bold normal-case text-xs"
                    >
                        Perbarui Password
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-500"
                        enterFrom="opacity-0 translate-x-4"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-500"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-black text-seafoam-600">
                            ✓ Password diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
