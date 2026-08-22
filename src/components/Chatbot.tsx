"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
    const [inputText, setInputText] = useState("");
    const { user } = useUser();
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const pathName = usePathname();
    if (pathName.includes("/login") ||
        pathName.includes("/register") ||
        pathName.includes("/onboarding")
    ) return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value)
    }

    const handleSendMessage = async () => {
        if (!inputText) return;

        const newMessages = [...messages, { role: "user", text: inputText }];
        setMessages(newMessages);
        setInputText("");
        const response = await fetch("https://profrate-backend.onrender.com/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                history: newMessages,
                user: user
            })
        })
        const data = await response.json();
        setMessages([...newMessages, { role: "bot", text: data.reply }])
    }


    return (
        <>
            {
                isOpen && (
                    <div className=" animate-modal fixed flex flex-col bottom-33 right-4 w-[350px] h-[400px] bg-white border border-gray-200 rounded-xl shadow-2xl
     p-4 z-50 dark:bg-gray-900 dark:border-gray-800
     ">
                        <h3 className="font-bold text-blue-600">Prof AI (in development)</h3>
                        <p className="text-sm mt-2 text-text2">How can I help you?</p>
                        <div className="flex-1 overflow-y-auto w-full my-2">
                            {messages.map((msg, idx) => (
                                <div className={`p-2 my-1 rounded-lg w-max max-w-[80%] text-sm ${msg.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-black"}`}
                                    key={idx}>
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={messagesRef} />
                        </div>
                        <div className="mt-auto w-full flex items-center justify-center">
                            <div className="w-full flex items-center gap-2 bottom-2 border-border rounded-xl px-2 py-2 border-1">
                                <input type="text" value={inputText}
                                    onChange={handleChange}
                                    placeholder="Ask AI"
                                    className="w-full outline-none text-sm rounded-lg"
                                />
                                <button className="text-blue-600 hover:text-blue-700 bg-gray-100 p-1.5 rounded-lg"
                                    onClick={() => handleSendMessage()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-18 right-6 z-50 w-14 h-14 bg-bg-ai hover:bg-blue-700 text-text-ai rounded-full flex justify-center items-center shadow-lg transition-transform"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>

        </>
    )
}