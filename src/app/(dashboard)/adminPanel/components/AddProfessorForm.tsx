"use client"
import { useState, useEffect } from "react";

export default function AddProfessorForm() {
  return (
        <div className="min-h-screen bg-[#f2f5f7] flex flex-col items-center">
          {/* Header */}

    
          {/* Main card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,60,120,0.08)] mx-5 mb-10 px-7 py-8 flex flex-col gap-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-[#1a2a3a]">Create Account</h1>
              <p className="text-sm text-[#5a6a7a] mt-1.5">
                Sign up with your TSU email to get started
              </p>
              <div className="w-10 h-[3px] rounded-full bg-[#e6b800] mt-3" />
            </div>
    
            {/* TSU email notice */}
            <div className="flex items-center gap-3 bg-[#e8f1fa] border border-[#c8ddf0] rounded-2xl p-4">
              <div className="w-10 h-10 rounded-xl bg-[#0060a9] flex items-center justify-center flex-shrink-0">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2a3a]">
                  TSU Email required
                </p>
                <p className="text-xs text-[#5a6a7a] mt-0.5">
                  Only @hum.tsu.edu.ge and @ens.tsu.edu.ge are accepted
                </p>
              </div>
            </div>
    
            {/* Form */}
            <div className="flex flex-col gap-4">
              {/* First name and last name */}
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#5a6a7a]">
                    First Name
                  </label>
                  <input
                    name="firstName"
 
                    placeholder="First Name"
                    className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-xs font-medium text-[#5a6a7a]"
                  >
                    Last Name
                  </label>
                  <input
                    name="lastName"
        
 
                    placeholder="Last Name"
                    className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                  />
                </div>
              </div>
    
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-[#5a6a7a]"
                >
                  Email
                </label>
                <input
                  name="email"
 
                  placeholder="name.surname@hum.tsu.edu.ge"
                  className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                />
                <p className="text-xs text-[#8a97a4] px-1">
                  A verification code will be sent to this address
                </p>
              </div>
    
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#5a6a7a]"
                >
                  Password
                </label>
                <input
                  name="password"
                  type="password"
 
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] placeholder:text-[#a0acb8] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all"
                />
              </div>
    
              {/* Faculty */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#5a6a7a]">
                  Faculty
                </label>
 
                <p className="text-xs text-[#0060a9] pt-0.5 font-medium">
                  ✓ Professors from your faculty will be shown first
                </p>
              </div>
    
              {/* Study year */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#5a6a7a]">
                  Study Year
                </label>
                <select
                  name="studyYear"
 
                  className="w-full bg-[#f8fafb] border border-[#d8dfe6] rounded-xl px-4 py-3 text-sm text-[#1a2a3a] outline-none focus:border-[#0060a9] focus:ring-1 focus:ring-[#0060a9]/20 transition-all cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    Select your study year...
                  </option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                  <option value="5+">5+ Year</option>
                  <option value="graduate">Graduate</option>
                </select>
              </div>
            </div>
    
            {/* Error */}
            {/* {error && (
              <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3">
                <p className="text-xs text-[#dc2626] font-medium">{error}</p>
              </div>
            )} */}
    
            {/* Success */}
            {/* {success && (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
                <p className="text-xs text-[#16a34a] font-medium">{success}</p>
              </div>
            )} */}
{/*     
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 bg-[#0060a9] rounded-xl text-sm font-semibold text-white hover:bg-[#004d8a] transition-colors cursor-pointer shadow-[0_2px_12px_rgba(0,96,169,0.25)]
                            ${
                              loading
                                ? "bg-primary/50 text-bg cursor-not-allowed"
                                : "bg-primary text-bg hover:opacity-90"
                            }`}
            >
              {loading ? "Creating account..." : "Send verification code →"}
            </button> */}
          </div>
        </div>
  )
}
