import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

export function generateStaticParams() {
  return [
    { id: "95c6eaba-fda4-44c0-8d8e-d13d9211808e" },
    { id: "d9cde304-cad5-4d9c-ab22-2a169e3846d2" },
    { id: "f1e8c218-bf30-44ed-84d4-6a129b12d99d" },
    { id: "demo" },
  ];
}

export default function BookingConfirmPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold">Loading confirmation...</div>}>
      <ConfirmClient bookingId={params.id} />
    </Suspense>
  );
}
