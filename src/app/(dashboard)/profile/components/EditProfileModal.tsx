interface EditProfileModalProps {
    onClose: () => void;
}
export default function EditProfileModal({ onClose }: EditProfileModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="bg-bg2 border-border w-full max-w-md p-6 rounded-2xl shadow-2xl relative flex flex-col gap-4">


                                  <div className="flex gap-3">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[#5a6a7a]">First Name</label>
                            <input
                                name="firstName"
                                value=""
                                placeholder="First Name"
                                className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label htmlFor="lastName" className="text-xs font-medium text-[#5a6a7a]">Last Name</label>
                            <input
                                name="lastName"
                                value=""
                                placeholder="Last Name"
                                className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                            />
                        </div>
                    </div>
                <button
                    onClick={onClose} className="p-2 bg-red text-white border-border rounded-lg">
                    close
                </button>
            </div>

        </div>
    )
}