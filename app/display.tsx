"use client";

import { useSearchParams } from "next/navigation";

export default function DisplayPage() {
  const searchParams = useSearchParams();
  const responseData = searchParams.get("data");

  if (!responseData) {
    return <p>No data to display</p>;
  }

  const parsedData = JSON.parse(responseData);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Client Data</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(parsedData, null, 2)}</pre>
    </div>
  );
}
