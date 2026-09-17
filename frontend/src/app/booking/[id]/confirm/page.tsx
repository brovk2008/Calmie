import { Suspense } from "react";
import BookingConfirmClient from "./ConfirmClient";

export function generateStaticParams() {
  return [
    { id: "demo" },
    { id: "demo_booking_1" }
  ];
}

export default function BookingConfirmPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading confirmation...</div>}>
      <BookingConfirmClient params={params} />
    </Suspense>
  );
}
