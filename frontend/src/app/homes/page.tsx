import Link from "next/link";
import { Building2, MapPin, ArrowRight } from "lucide-react";

export default function HomesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b-3 border-black pb-8 space-y-4">
        <div className="inline-block bg-calmie-yellow border-2 border-black px-3 py-1 font-heading font-black text-xs uppercase tracking-wider shadow-brutal-sm">
          Partner Facilities
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-calmie-dark">
          Registered Old Age Homes
        </h1>
        <p className="text-gray-700 max-w-2xl font-medium">
          Verified elderly care homes integrated with Calmie Voice AI. Administrators manage
          resident life histories, communication schedules, and receive instant clinical alerts.
        </p>
      </div>

      {/* Homes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shanti Niwas Old Age Home Card */}
        <div className="card-brutal p-8 bg-white border-3 border-black space-y-6 shadow-brutal-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="badge-brutal bg-calmie-lime text-black text-xs mb-2">
                ● Pilot Facility Active
              </span>
              <h2 className="font-heading font-black text-3xl text-calmie-dark">
                Shanti Niwas Old Age Home
              </h2>
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-calmie-pink" />
                <span>Sector 21, Gurugram, Haryana · Pincode 122016</span>
              </p>
            </div>
            <div className="w-14 h-14 bg-calmie-yellow border-2 border-black flex items-center justify-center shadow-brutal-sm flex-shrink-0">
              <Building2 className="w-7 h-7 text-calmie-dark" />
            </div>
          </div>

          <div className="bg-[#fbf9f4] border-2 border-black p-4 space-y-2 text-xs">
            <p className="font-bold text-gray-500 uppercase tracking-wide">Facility Overview</p>
            <p className="text-gray-800 leading-relaxed font-medium">
              Established in 2014, Shanti Niwas provides dignified residential care, daily medical
              checkups, serene balcony gardens, and recreational libraries for senior citizens.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="border border-black p-3 bg-white">
              <p className="text-gray-500 font-bold">Enrolled Seniors</p>
              <p className="text-lg font-heading font-black text-calmie-dark">3 Residents</p>
            </div>
            <div className="border border-black p-3 bg-white">
              <p className="text-gray-500 font-bold">Verified Phone</p>
              <p className="text-sm font-mono-brutal font-bold text-emerald-700">+91 98214 00274</p>
            </div>
            <div className="border border-black p-3 bg-white col-span-2 sm:col-span-1">
              <p className="text-gray-500 font-bold">Coordinator</p>
              <p className="text-sm font-bold text-calmie-dark">Ramesh Sharma</p>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/dashboard/residents/new"
              className="btn-white text-xs py-2.5 px-4"
            >
              Enroll Resident Here
            </Link>
            <Link
              href="/residents"
              className="btn-pink text-xs py-2.5 px-5 flex items-center gap-1.5"
            >
              <span>View 3 Residents</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
