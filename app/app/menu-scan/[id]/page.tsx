import { MenuScanView } from "@/components/menu-scan/menu-scan-view";

export default function MenuScanResultPage({ params }: { params: { id: string } }) {
  return <MenuScanView menuScanId={params.id} />;
}
