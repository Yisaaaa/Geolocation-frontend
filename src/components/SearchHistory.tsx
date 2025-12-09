import type { SearchHistoryItem } from "@/types/geo";
import { RefreshCcw, Trash } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function SearchHistory({
  history,
  selected,
  setSelected,
  fetchHistory,
}: {
  history: SearchHistoryItem[];
  selected: SearchHistoryItem[];
  setSelected: Dispatch<SetStateAction<SearchHistoryItem[]>>;
  fetchHistory: any;
}) {
  console.log(selected);

  const handleDeleteMultiple = async () => {
    try {
      const response = await api.delete("/history", {
        data: { ids: selected.map((item) => item.id) },
      });
      setSelected([]);
      toast.success(`Deleted ${response.data.count} search succesfully`);
      await fetchHistory();
    } catch (error: any) {
      console.log("Failed to delete search histories");
      toast.error("Failed to delete search histories");
    }
  };

  const emptyHistoryComponent = (
    <div className="h-[300px] flex flex-col justify-center">
      <div className="text-center self-center flex flex-col items-center">
        <RefreshCcw className="w-20 h-20 text-zinc-700 mb-4" />
        <p className="text-zinc-400">No search history yet</p>
        <p className="text-sm text-zinc-600">
          Start by searching for an IP address
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {history.length === 0 ? (
        emptyHistoryComponent
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {history.map((item) => (
            <div
              className="hover:border-blue-950 transition-all border rounded-md bg-zinc-950 border-zinc-600 flex py-3 px-4 gap-3 items-start"
              key={item.id}
            >
              <Checkbox
                // checked={selected.some((i) => i.id === item.id)}
                checked={selected.some((i) => i.id === item.id)}
                onCheckedChange={(checked) => {
                  setSelected((prev) => {
                    if (checked) {
                      // add item if checked
                      return [...prev, item];
                    } else {
                      // remove item if unchecked
                      return prev.filter((i) => i.id !== item.id);
                    }
                  });
                }}
                id={item.id}
                className="mt-1 border border-zinc-400 font-medium dark:data-[state=checked]:bg-accent-color dark:data-[state=checked]:border-accent-color dark:data-[state=checked]:text-white"
              />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-lg">{item.ipAddress}</p>
                <p className="text-muted-foreground">{item.city}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        className="mt-auto disabled:opacity-20 hover:cursor-pointer hover:bg-red-500/30 transition-all bg-red-500/10 border border-red-900 rounded-md py-3 flex gap-2 justify-center items-center"
        disabled={history.length === 0}
        onClick={handleDeleteMultiple}
      >
        <Trash className="w-5 h-5 text-error" />
        <p>Delete Selected ({selected.length})</p>
      </button>
    </div>
  );
}
