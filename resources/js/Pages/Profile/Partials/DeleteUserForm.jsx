import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <header>
                <h2 className="text-lg font-black text-rose-600 tracking-tight">
                    Hapus Akun
                </h2>

                <p className="mt-0.5 text-xs font-medium text-slate-500 leading-relaxed">
                    Data Anda akan dihapus secara permanen.
                </p>
            </header>

            <DangerButton 
                onClick={confirmUserDeletion}
                className="rounded-2xl px-6 py-3 bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-100 border-none font-bold normal-case text-white text-xs"
            >
                Hapus Akun Permanen
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="xl">
                <form onSubmit={deleteUser} className="flex flex-col max-h-[90vh]">
                    <div className="shrink-0 px-10 pt-10 pb-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                            Konfirmasi Hapus Akun
                        </h2>
                        <p className="text-sm font-medium text-slate-500">
                            Tindakan ini tidak dapat dibatalkan. Mohon masukkan password untuk melanjutkan.
                        </p>
                    </div>

                    <div className="flex-1 px-10 py-4">
                        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 mb-8">
                            <p className="text-sm font-bold text-rose-800 leading-relaxed text-center italic">
                                "Semua data pemeriksaan dan informasi profil akan hilang selamanya dari database."
                            </p>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password Konfirmasi"
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2"
                            />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full rounded-2xl border-none bg-slate-50 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all"
                                isFocused
                                placeholder="Masukkan password Anda"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="shrink-0 px-10 py-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30 mt-8">
                        <SecondaryButton type="button" onClick={closeModal} className="rounded-2xl px-8 py-4 border-none bg-slate-100 text-slate-600 font-bold normal-case">
                            Batal
                        </SecondaryButton>

                        <PrimaryButton 
                            className="rounded-2xl px-8 py-4 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 border-none font-bold normal-case text-white" 
                            disabled={processing}
                        >
                            Ya, Hapus Sekarang
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
