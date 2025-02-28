'use client'
import Messages from "@/components/messages";
import { ChatMessage } from "@/types";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import { ChatInput } from "@/components/chat-input";


function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Next.js App Router hook to grab query parameters (search params)
    const searchParams = useSearchParams()
    const initialMessage = searchParams.get('message') // the typed message from the user


    useEffect(() => {
        // If there's a query param "message", handle it once on mount
        console.log("outside")
        if (initialMessage && messages.length == 0) {
            console.log("call me once")
            void sendMessageToServer(initialMessage, true)
            router.replace('/chat')
        }
    }, [initialMessage])

    async function sendMessageToServer(message: string, initial = false) {
        if (initial && messages.length > 0) return

        setIsLoading(true)

        // Display user’s message immediately (optional)
        const userMessage: ChatMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
        }


        setMessages((prev) => [...prev, userMessage])

        try {
            // Example call to your /api/sendMessage
            const response = await fetch('/api/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })

            const data = await response.json()
            if (data.error) {
                throw new Error(data.error)
            }

            const aiMessage: ChatMessage = {
                id: Date.now() + 1,
                text: data.reply || 'No response received.',
                sender: 'ai',
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error('Failed to send message:', error)
            const errorMessage: ChatMessage = {
                id: Date.now() + 1,
                text: 'Server Error: Unable to process the request.',
                sender: 'ai',
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <main className='flex-1 overflow-auto w-full p-6'>
                <h1 className="text-2xl font-bold text-center mb-4">Asendio Chat</h1>
                <Messages isLoading={isLoading} messages={messages} />
            </main>
            <ChatInput onSendMessage={sendMessageToServer} /></>
    )
}

export default function ChatPage() {

    return (
        <Suspense><Chat /></Suspense>
    )

}
