import { useEffect, useState } from "react";

  
interface ModalProps {
  onClose: () => void;
}

export function Modal({ onClose }: ModalProps) {
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);

  // Fetch client IDs on mount
  useEffect(() => {
    async function fetchClientIds() {
      try {
        const response = await fetch("/api/getPatients");
        const data: string[] = await response.json();
        if (response.ok) {
          setClientIds(data);
          setSelectedClient(data[0] || ""); // Preselect the first client if available
        } else {
          console.error(data);
        }
      } catch (error) {
        console.error("Failed to fetch client IDs", error);
      }
    }

    fetchClientIds();
  }, []);

  const handleSubmit = async () => {
    if (!selectedClient) {
      alert("Please select a client.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/submitClientData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientNumber: selectedClient }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        alert("Failed to process client data");
        return;
      }

      const data = await response.json();
      const result = data["data"]["gpt_response"]["choices"][0]["message"]["content"];
      console.log(data);
      setResult(result); // Format result as JSON string for display
    } catch (error) {
      console.error("Failed to submit client result:", error);
      alert("Error submitting client data");
    } finally {
      setLoading(false);
    }
  };


  const modalStyle = result
  ? "bg-secondary rounded-lg p-6 shadow-lg w-[90%] max-w-[1000px] max-h-[80vh] overflow-y-auto"
  : "bg-secondary rounded-lg p-6 shadow-lg w-[90%] max-w-[400px] max-h-[80vh] overflow-y-auto";

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className={modalStyle}>
      <h2 className="text-lg font-bold mb-4">
        {result ? "Treatment Plan Result" : "Select a Client"}
      </h2>

      {result ? (
        result.map((item, index) => (
          <div key={index} className="flex flex-col mb-4">
            {item.split("\n").map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
          </div>
        ))
      ) : (
        <>
          <select
            className="border p-2 w-full rounded mb-4"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            disabled={loading}
          >
            {clientIds.map((id, index) => (
              <option key={index} value={id}>
                {id}
              </option>
            ))}
          </select>
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
