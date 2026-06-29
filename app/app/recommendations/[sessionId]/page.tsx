import { SessionView } from "@/components/recommendations/session-view";

export default function RecommendationSessionPage({ params }: { params: { sessionId: string } }) {
  return <SessionView sessionId={params.sessionId} />;
}
