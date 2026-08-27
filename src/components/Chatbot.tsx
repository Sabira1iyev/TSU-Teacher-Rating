"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import path from "path";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
    const [inputText, setInputText] = useState("");
    const { user } = useUser();
    const messagesRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        messagesRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const pathName = usePathname();
    const isLandingPage = pathName === "/" || pathName === "/en" || pathName === "/az" || pathName === "/ka";
    
    if (
        pathName.includes("/login") ||
        pathName.includes("/register") ||
        pathName.includes("/onboarding") ||
        isLandingPage
    ) {
        return null;
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value)
    }

    const handleSendMessage = async () => {
        if (!inputText) return;

        const newMessages = [...messages, { role: "user", text: inputText }];
        setMessages(newMessages);
        setInputText("");
        setIsTyping(true);
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                history: newMessages.slice(-10),
                user: user
            })
        })
        const data = await response.json();
        setMessages([...newMessages, { role: "bot", text: data.reply }])
        setIsTyping(false);
    }


    return (
        <>
            {
                isOpen && (
                    <div className=" animate-modal fixed flex flex-col bottom-33 right-4 w-[350px] h-[400px] bg-bg2 border border-border rounded-xl shadow-2xl
     p-4 z-50">
                        <h3 className="font-bold text-blue-600">Prof AI (in development)</h3>
                        <p className="text-sm mt-2 text-text2">How can I help you?</p>
                        <div className="flex-1 overflow-y-auto w-full my-2">
                            {messages.map((msg, idx) => (
                                <div className={`animate_message p-2 my-1 rounded-lg w-max max-w-[80%] text-sm ${msg.role === "user" ? "bg-blue-600 text-white ml-auto shadow-sm" : "bg-bg3 border border-border2 text-text shadow-sm"}`}
                                    key={idx}>
                                    <div className="space-y-4 font-medium max-w-full overflow-hidden break-words">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-bg3 border border-border2 text-text3 rounded-2xl px-4 py-2 text-sm max-w-[80%] rounded-tl-none animate-pulse">
                                        Prof Ai is thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesRef} />
                        </div>
                        <div className="mt-auto w-full flex items-center justify-center">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="w-full flex items-center gap-2 bottom-2 border border-border bg-bg3 rounded-xl px-2 py-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={handleChange}
                                    placeholder="Ask AI"
                                    className="w-full h-8 md:text-base bg-transparent outline-none text-sm rounded-lg text-text"
                                />
                                <button className="bg-blue w-max ml-auto p-1 text-white hover:text-gray-100 rounded-lg hover:shadow-lg transition-transform focus:outline-none focus:scale-95 px-2"
                                    type="submit"
                                >
                                    <Send size={15} className="cursor-pointer"/>
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-18 right-6 z-50 w-14 h-14 bg-bg-ai hover:bg-bg-ai text-text-ai rounded-full flex justify-center items-center shadow-lg transition-transform cursor-pointer"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </>
    )
}