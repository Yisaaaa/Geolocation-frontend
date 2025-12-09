import type { GeoData } from "@/types/geo";
import CurrentLocationField from "./CurrentLocationField";
import CurrentLocationSkeleton from "./CurrentLocationSkeleton";

interface CurrentLocationCardProps {
  geoData: GeoData | null;
  isGeoLoading: boolean;
}

export default function CurrentLocationCard({
  geoData,
  isGeoLoading,
}: CurrentLocationCardProps) {
  if (isGeoLoading) {
    return <CurrentLocationSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <CurrentLocationField name="IP Address" val={geoData?.ip || ""} />
      <CurrentLocationField name="City" val={geoData?.city || ""} />
      <CurrentLocationField name="Region" val={geoData?.region || ""} />
      <CurrentLocationField name="Country" val={geoData?.country || ""} />
      <CurrentLocationField name="Coordinates" val={geoData?.loc || ""} />
      <CurrentLocationField name="Timezone" val={geoData?.timezone || ""} />
      <CurrentLocationField name="Organization" val={geoData?.org || ""} />
    </div>
  );
}
