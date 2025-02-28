'use client'

import { ChatInput } from "@/components/chat-input";
import Messages from "@/components/messages";
import { ask } from "@/lib/requests";
import { ChatMessage } from "@/types";
import { useState } from "react";


const options: Record<string, string> = {
    "Opioid Use Disorder": "OpioidUseDisorder",
    "Medications For Opioid Use Disorder": "MedicationsForOpioidUseDisorder",
    "Substance-Induced Disorders": "Substance-InducedDisorders",
    "Substance Intoxication Withdrawal": "SubstanceIntoxicationWithdrawal",
    "Substance UseDisorders": "SubstanceUseDisorders",
    "Adult-Child-Of-An-Alcoholic": "Adult-Child-Of-An-AlcoholicAcaTraits",
    Anger: "Anger",
    "Antisocial Behavior": "AntisocialBehavior",
    Anxiety: "Anxiety",
    "ADHD-Adolescent": "Attention-DeficitHyperactivityDisorderAdhd-Adolescent",
    "ADHD-Adult": "Attention-DeficitHyperactivityDisorderAdhd-Adult",
    "Bipolar Disorder": "BipolarDisorder",
    "Borderline Traits": "BorderlineTraits",
    "Childhood Trauma": "ChildhoodTrauma",
    "Chronic Pain": "ChronicPain",
    "Conduct Disorder/Delinquency": "ConductDisorderDelinquency",
    "Dangerousness/Lethality": "DangerousnessLethality",
    "Dependent Traits": "DependentTraits",
    "Depression-Unipolar": "Depression-Unipolar",
    "Eating Disorders And Obesity": "EatingDisordersAndObesity",
    "Family Conflicts": "FamilyConflicts",
    Gambling: "Gambling",
    "Grief/Loss Unresolved": "GriefLossUnresolved",
    Impulsivity: "Impulsivity",
    "Legal Problems": "LegalProblems",
    "Living Environment Deficiency": "LivingEnvironmentDeficiency",
    "Medical Issues": "MedicalIssues",
    "Narcissistic Traits": "NarcissisticTraits",
    "Nicotine Abuse/Dependence": "NicotineAbuseDependence",
    "Obsessive-Compulsive And Related Disorders": "Obsessive-CompulsiveAndRelatedDisorders",
    "Occupational Problems": "OccupationalProblems",
    "Oppositional DefiantBehavior": "OppositionalDefiantBehavior",
    "Panic Disorder/Agoraphobia": "PanicDisorderAgoraphobia",
    "Parent-Child Relational Problem": "Parent-ChildRelationalProblem",
    "Partner Relational Conflicts": "PartnerRelationalConflicts",
    "Peer Group Negativity": "PeerGroupNegativity",
    PTSD: "PosttraumaticStressDisorderPtsd",
    Psychosis: "Psychosis",
    "Readiness To Change": "ReadinessToChange",
    "Relapse Proneness": "RelapseProneness",
    "Self-Care Deficits-Primary": "Self-CareDeficits-Primary",
    "Self-Care Deficits-Secondary": "Self-CareDeficits-Secondary",
    "Self-Harm": "Self-Harm",
    "Sexual Abuse": "SexualAbuse",
    "Sexual Promiscuity": "SexualPromiscuity",
    "Sleep Disturbance": "SleepDisturbance",
    "Social Anxiety": "SocialAnxiety",
    "Spiritual Confusion": "SpiritualConfusion",
    "Suicidal Ideation": "SuicidalIdeation",
};

export default function ReferenceChat() {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [filters, setFilters] = useState<string[]>([
        "OpioidUseDisorder",
        "MedicationsForOpioidUseDisorder",
    ]);
    const [isSelectingFilters, setIsSelectingFilters] = useState(true);
    
    const handleSendMessage = async (message: string) => {
        const userMessage: ChatMessage = {
            id: messages.length + 1,
            text: message,
            sender: "user",
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setLoading(true);

        try {
            let chunksResponse: {};
            const askResponse = await ask(message, [...filters]);
            chunksResponse = { results: askResponse.results };
            const answer = askResponse.gpt_response.choices[0].message.content;
            const aiMessage: ChatMessage = {
                id: messages.length + 2,
                text: answer || "No response received.",
                sender: "ai",
            };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage: ChatMessage = {
                id: messages.length + 2,
                text: "Server Error: Unable to process the request.",
                sender: "ai",
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <main className='flex-1 overflow-auto w-full p-6'>
              
                {isSelectingFilters && (
                    <>
                        <h1 className='text-2xl font-bold ml-4 text-center mb-4'>Select Subjects</h1>
                        <FilterSelect
                            setFilters={setFilters}
                            filters={filters}
                            confirmFilters={()=>setIsSelectingFilters(false)}
                        />
                    </>
                )}
                {!isSelectingFilters && (
                    <>
                        <h1 className='text-2xl font-bold ml-4 text-center mb-4'>Counselor Reference</h1>
                        <Messages isLoading={loading} messages={messages} />
                    </>
                )}
            </main>
            {!isSelectingFilters && (<ChatInput onSendMessage={handleSendMessage} />)}
        </>
    )

}


function FilterSelect({
    setFilters,
    filters,
    confirmFilters,
}: {
    setFilters: React.Dispatch<React.SetStateAction<string[]>>;
    filters: string[];
    confirmFilters: () => void;
}) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(filters);
    const handleSelect = (option: string) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const handleConfirm = () => {
        const finalFilters = selectedOptions.length === 0 ? Object.values(options) : selectedOptions;
        setFilters(finalFilters);
        confirmFilters();
    };

    return (
        <div className='filter-select-container'>
            <div className='card-grid'>
                {Object.keys(options).map((displayName) => (
                    <div
                        key={displayName}
                        className={`card ${selectedOptions.includes(options[displayName]) ? "selected" : ""}`}
                        onClick={() => handleSelect(options[displayName])}>
                        <span className='card-title'>{displayName}</span>
                    </div>
                ))}
            </div>
            <div className='button-container'>
                <button className='confirm-button' onClick={handleConfirm}>
                    Next
                </button>
            </div>

            <style jsx>{`
				.filter-select-container {
					width: 100%;
					max-width: 600px;
					margin: 0 auto;
					padding: 20px;
					border-radius: 8px;
				}

				.card-grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
					gap: 20px;
					margin-bottom: 20px;
				}

				.card {
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 20px;
					border: 2px solid #ddd;
					border-radius: 8px;
					cursor: pointer;
					transition: transform 0.2s, border-color 0.2s;
					background-color: #fff;
				}

				.card.selected {
					border-color: #0070f3;
					transform: scale(1.05);
				}

				.card-title {
					font-size: 16px;
					font-weight: bold;
					color: #333;
				}

				.button-container {
					text-align: center;
				}

				.confirm-button {
					background-color: #0070f3;
					color: white;
					padding: 10px 20px;
					font-size: 16px;
					border: none;
					border-radius: 5px;
					cursor: pointer;
					transition: background-color 0.2s;
				}

				.confirm-button:hover {
					background-color: #005bb5;
				}
			`}</style>
        </div>
    );
}
