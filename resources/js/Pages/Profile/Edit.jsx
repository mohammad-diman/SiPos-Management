import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header="Pengaturan Profil"
        >
            <Head title="Profile" />

            <div className="space-y-3">
                {/* Profile Quick Info - Compact Header Replacement */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Informasi Akun</h3>
                        <p className="text-[10px] font-black text-seafoam-600 uppercase tracking-widest mt-0.5">Kelola data diri & keamanan</p>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-seafoam-50 flex items-center justify-center text-seafoam-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>

                {/* Grid Layout: Profile Info and Password Update Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* Danger Zone - More Compact */}
                <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                    <div className="max-w-xl">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
