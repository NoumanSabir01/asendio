/** @format */

"use client";

import { FeatureCard } from "./feature-card";
import { useState } from "react";
import { Modal } from "./modal";
import { Modal2 } from "./modal2";
import { useRouter } from "next/navigation";
import type { FeatureCardType } from "../types/index";

const featureCards: FeatureCardType[] = [
	{
		title: "R3 Recovery Index",
		image: "/images/R3_LOGO_RED.jpg",
		href: "/r3",
		type: "page",
	},
	{
		title: "EAI SOAP Note",
		image: "/images/EAISoapNote.jpg",
		href: "http://r3eai.asendio.me/EAI",
		type: "link",
	},
	{
		title: "SMART Goals",
		image: "/images/PersonalRP.jpg",
		href: "smartModal",
		type: "modal",
	},
	{
		title: "Personal Treatment Plan",
		image: "/images/PersonalTP.jpg",
		href: "treatmentPlan",
		type: "modal",
	},
	{
		title: "Reference Chat",
		image: "/images/Coaching.jpg",
		href: "/reference_chat",
		type: "page",
	},
	{
		title: "Self Assessment",
		image: "/images/SelfAssess.jpg",
		href: "https://www.google.com/",
		type: "cosmetic",
	},
	{
		title: "Competency Assessment",
		image: "/images/CompetencyAssess.jpg",
		href: "https://www.google.com/",
		type: "cosmetic",
	},
	{
		title: "Relevant Testing",
		image: "/images/RelevantTest.jpg",
		href: "https://www.google.com/",
		type: "cosmetic",
	},
	{
		title: "Co-occurring Identification",
		image: "/images/Cooccur.jpg",
		href: "https://www.google.com/",
		type: "cosmetic",
	},
	{
		title: "Audit Compliance",
		image: "/images/AuditComply.jpg",
		href: "https://www.google.com/",
		type: "cosmetic",
	},
	{
		title: "Skill Development",
		image: "/images/Skill.jpg",
		href: "https://www.google.com/",
		type: "cosmetic",
	},
	{
		title: "Progress Note",
		image: "/images/ProgressNote.jpg",
		href: "https://www.google.com/",
		type: "cosmetic",
	},
];



export function CardGrid() {
	const [modalOpen, setModalOpen] = useState(false);
	const [smartModalOpen, setSmartModalOpen] = useState(false);

	const handleModalSubmit = async (clientNumber: string) => {
		try {
			const response = await fetch("/api/submitClientData", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ clientNumber }),
			});

			if (!response.ok) {
				throw new Error(`API Error: ${response.statusText}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Failed to submit client data:", error);
			throw error;
		}
	};

	function openModal(target: string) {
		if (target === "treatmentPlan") {
			setModalOpen(true);
		} else if (target === "smartModal") {
			setSmartModalOpen(true);
		} else {
			setModalOpen(true);
		}
	}

	return (
    <>
    	<h1 className='text-2xl font-bold ml-4 text-center mb-4'>Asendio Applications</h1>
		<div className='flex w-full justify-center'>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1000px] mx-auto'>
				{featureCards.map(({ title, image, href, type }, index) => {
          
					return (
						<FeatureCard
							key={index}
							title={title}
							// image={href==="https://www.google.com/" ? "/images/missing.jpg" : image}
              				image={image}
							imageAlt={title}
							href={href}
							type={type}
							openModal={openModal}
						/>
					);
				})}
			</div>

			{modalOpen && <Modal onClose={() => setModalOpen(false)} />}
			{smartModalOpen && <Modal2 onClose={() => setSmartModalOpen(false)} />}
		</div>
    </>
	);
}
