"use clint";

import ResultsComponent from "@/components/test/resultsComponent";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId");

  return (
    <div>
      <ResultsComponent questionId={questionId ? parseInt(questionId) : 0} />
    </div>
  );
}   