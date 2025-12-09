export default function CurrentLocationField({
  name,
  val,
}: {
  name: string;
  val: string;
}) {
  return (
    <div>
      <p className="text-zinc-300 mb-1">{name}</p>
      <p className="text-lg">{val}</p>
    </div>
  );
}
