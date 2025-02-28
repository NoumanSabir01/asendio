/** @format */

import ReactMarkdown from "react-markdown";
import type {ChatMessage } from "../types/index";

export default function Messages({ messages, isLoading }: { messages: ChatMessage[]; isLoading: boolean }) {
	return (
		<div className='space-y-4'>
			{messages.map((msg) => (
				<div key={msg.id} className={`${msg.sender === "user" ? "text-right" : "text-left"}`}>
					<div
						className={`inline-block px-4 py-2 rounded-lg max-w-[1000px] mx-a ${
							msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
						}`}>
						<ReactMarkdown
							// className='markdown'
							components={{
								ul: ({ children }) => <ul className='list-disc pl-5'>{children}</ul>,
								ol: ({ children }) => <ol className='list-decimal pl-5'>{children}</ol>,
								li: ({ children }) => <li className='my-1'>{children}</li>,
							}}>
							{msg.text}
						</ReactMarkdown>
					</div>
				</div>
			))}
			{isLoading && (
				<div className='flex justify-center'>
					<div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500'></div>
				</div>
			)}
		</div>
	);
}
