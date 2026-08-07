import { StoredFitCheck } from "@/components/fit-check/stored-fit-check";

export default function StoredFitCheckPage({ params }: { params: { id: string } }) {
  return <StoredFitCheck fitCheckId={params.id} />;
}
