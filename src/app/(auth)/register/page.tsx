"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FACULTIES } from "@/lib/constants";


export default function RegisterPage() {
    const router = useRouter();

    const [formdata, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        faculty: "",
        studyYear: "",
    })

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        setSuccess("");
        if (!formdata.firstName || !formdata.lastName) {
            setError("Please enter your full name");
            return;
        }
        if (!formdata.email.endsWith("@hum.tsu.edu.ge") && !formdata.email.endsWith("@ens.tsu.edu.ge")) {
            setError("Please use your TSU email addres(@hum.tsu.edu.ge or @ens.tsu.edu.ge).");
            return;
        }
        if (formdata.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return
        }
        if (!formdata.faculty) {
            setError("Please select your faculty")
            return;
        }
        if (!formdata.studyYear) {
            setError("Please enter your study year");
            return;
        }
        setError("");
        setSuccess("Informations about student are correct.");
        
    }

    return (

        <div className="min-h-screen bg-bg flex-col px-5">

            {/*Header*/}
            <div className="flex items-center justify-between px-5 pt-8 pb-4">
                <button
                    onClick={() => router.back()}
                    className="text-text3 hover:text-text2 transition-colors cursor-pointer"
                >← Back
                </button>
                <span className="text-sm text-text3">
                    Already have an account?{" "}
                </span>
                <span
                    onClick={() => router.push("/login")}
                    className="text-primary cursor-pointer hover:opacity-80 transition-opacity"
                >
                    Sign in
                </span>
            </div>


            {/*content*/}
            <div className="flex-1 flex flex-col px-6 pb-8 gap-6">

                {/*title */}
                <div>
                    <h1 className="text-3xl font-bold text-text">
                        Create Account
                    </h1>
                    <p className="text-sm text-text3 mt-2">
                        Sign up with your TSU email to get started
                    </p>
                </div>

                {/*TSU email notice */}
                <div className="flex items-center gap-3 bg-bg2 border border-border2 rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-xl bg-primary-dim flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <div className="">
                        <p className="text-sm font-medium text-text">TSU Email required</p>
                        <p className="text-xs text-text3 mt-0.5">Only @hum.tsu.edu.ge and @ens.tsu.edu.ge are accepted</p>
                    </div>
                </div>

                {/*Form */}
                <div className="flex flex-col gap-4">
                    {/*first name and lastname */}
                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-xs text-text2">First Name</label>
                            <input
                                name="firstName"
                                value={formdata.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label htmlFor="lastName" className="text-xs text-text2">Last Name</label>
                            <input
                                name="lastName"
                                value={formdata.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/*email*/}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs text-text2">Email</label>
                        <input
                            name="email"
                            value={formdata.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary transition-colors"
                        />
                        <p className="text-xs text-text3 px-1">
                            A verification code will be sent to this address
                        </p>
                    </div>
                </div>

                {/*password*/}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-xs text-text2">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formdata.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text placeholder:text-text3 outline-none focus:border-primary transition-colors"
                    />
                </div>

                {/*Faculty*/}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text2">Faculty</label>
                    <select
                        name="faculty"
                        value={formdata.faculty}
                        onChange={handleChange}
                        className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                    >
                        <option value="" disabled>Select your faculty...</option>
                        {FACULTIES.filter((f) => f !== "All")
                            .map((faculty) => (
                                <option key={faculty}
                                    value={faculty}
                                >
                                    {faculty}
                                </option>
                            ))}
                    </select>
                    <p className="text-xs text-primary pt-1">
                        ✓ Professors from your faculty will be shown first
                    </p>
                </div>

                {/*Study year*/}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text2">Study Year</label>
                    <select
                        name="studyYear"
                        value={formdata.studyYear}
                        onChange={handleChange}
                        className="w-full bg-bg3 border border-border2 rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
                    >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                        <option value="5+">5+ Year</option>
                        <option value="graduate">Graduate</option>
                    </select>
                </div>

                {/*Error*/}
                {error && (
                    <div className="bg-red/10 border border-red/20 rounded-xl px-4 py-3">
                        <p className="text-xs text-red">{error}</p>
                    </div>
                )}

                {/*Success*/}
                {success && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
                        <p className="text-xs text-primary">{success}</p>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    className="w-full py-4 bg-primary rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-opacity cursor-pointer mt-2"
                >
                    Send verification code →
                </button>
            </div>
        </div>


    )


}