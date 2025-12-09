import { Skeleton } from "./ui/skeleton";

const fields = [
  "IP Address",
  "City",
  "Region",
  "Country",
  "Coordinates",
  "Timezone",
  "Organization",
];
const skeletonFields = fields.map((fieldName) => (
  <div>
    <p className="text-zinc-300 text-base mb-2">{fieldName}</p>
    <Skeleton className="h-4 w-full" />
  </div>
));

export default function CurrentLocationSkeleton() {
  return <div className="grid grid-cols-2 gap-4">{...skeletonFields}</div>;
}
