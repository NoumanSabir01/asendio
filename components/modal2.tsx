import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Modal2Props {
  onClose: () => void;
}

export function Modal2({ onClose }: Modal2Props) {
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validate input
    if (!textValue.trim()) {
      alert("Please enter up to 300 characters.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/getSmartGoals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textValue }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        alert("Failed to process text input");
        return;
      }

      const data = await response.json();
      const result = data["data"]["gpt_response"]["choices"][0]["message"]["content"];
      console.log(data);
      setResult(result);
    } catch (error) {
      console.error("Failed to submit text input:", error);
      alert("Error submitting text input");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically choose a width based on whether result is present
  const modalStyle = result
    ? "bg-secondary rounded-lg p-6 shadow-lg w-[90%] max-w-[1000px]"
    : "bg-secondary rounded-lg p-6 shadow-lg w-[90%] max-w-[400px]";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={modalStyle}>
        <h2 className="text-lg font-bold mb-4">
          {result ? "SMART goal result" : "Enter Client Problem"}
        </h2>

        {result ? (
          // Display the result similarly as in your original modal
            <ReactMarkdown
                // className='markdown'
                components={{
                    ul: ({ children }) => <ul className='list-disc pl-5'>{children}</ul>,
                    ol: ({ children }) => <ol className='list-decimal pl-5'>{children}</ol>,
                    li: ({ children }) => <li className='my-1'>{children}</li>,
                }}>
                {result}
			</ReactMarkdown>
          
        ) : (
          <>
            <textarea
              className="border p-2 w-full rounded mb-4"
              rows={4}
              maxLength={300}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              disabled={loading}
              placeholder="e.g. client has difficulty obtaining housing"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </>
        )}

        {loading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <br/>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded w-full"
          onClick={onClose}
          disabled={loading}
        >
          Close
        </button>
      </div>
    </div>
  );
}
