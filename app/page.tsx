/** @format */

"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { CardGrid } from "@/components/card-grid";
import { ChatInput } from "@/components/chat-input";
import { ThemeToggle } from "@/components/theme-provider";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Messages from "@/components/messages";
import { ask, rawAsk } from "@/lib/requests";
import type { ChatMessage } from "../types/index.d.ts";
import { useRouter } from "next/navigation";




export default function Home() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const handleSendMessage = async (message: string) => {
		router.push(`/chat?message=${encodeURIComponent(message)}`)
	};

	return (
		<>
			<main className='flex-1 overflow-auto w-full p-6'>
				<CardGrid />
			</main>
			<ChatInput onSendMessage={handleSendMessage} />
		</>


	);
}

