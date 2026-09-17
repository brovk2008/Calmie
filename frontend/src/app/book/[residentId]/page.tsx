import BookingClient from "./BookingClient";

export function generateStaticParams() {
  return [
    { residentId: "95c6eaba-fda4-44c0-8d8e-d13d9211808e" },
    { residentId: "d9cde304-cad5-4d9c-ab22-2a169e3846d2" },
    { residentId: "f1e8c218-bf30-44ed-84d4-6a129b12d99d" },
  ];
}

export default function BookingPage({ params }: { params: { residentId: string } }) {
  return <BookingClient residentId={params.residentId} />;
}
