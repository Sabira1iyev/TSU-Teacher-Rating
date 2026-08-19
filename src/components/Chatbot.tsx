"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";


export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {
                isOpen && (
                    <div className=" animate-modal fixed bottom-33 right-4 w-[350px] h-[400px] bg-white border border-gray-200 rounded-xl shadow-2xl
     p-4 z-50 dark:bg-gray-900 dark:border-gray-800
     ">
                        <h3 className="font-bold text-blue-600">ProfRate AI</h3>
                        <p className="text-sm mt-2 text-text2">How can I help you today?</p>
                    </div>
                )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-18 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-text rounded-full flex justify-center items-center shadow-lg transition-transform"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>

        </>
    )
}