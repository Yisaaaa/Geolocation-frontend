import { useAuthStore } from "@/store/authStore";
import { Globe, LogOut, MapPin, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import CurrentLocationCard from "@/components/CurrentLocationCard";
import type { GeoData, SearchHistoryItem } from "@/types/geo";
import axios from "axios";
import { toast } from "sonner";
import { isValidIp } from "@/utils/ipValidator";
import { api } from "@/lib/api";
import LocationMap from "@/components/LocationMap";
import SearchHistory from "@/components/SearchHistory";

export default function HomePage() {
  const username = useAuthStore((state) => state.user?.name);
  const logout = useAuthStore((state) => state.logout);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[] | []>([]);
  const [isGeoLoading, setIsGeoLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<
    SearchHistoryItem[] | []
  >([]);
  const [ipInput, setIpInput] = useState("");
  const [isCurrentLocation, setIsCurrentLocation] = useState(true);
  const [searchedIp, setSearchedIp] = useState("");

  useEffect(() => {
    fetchCurrentLocation();
    fetchHistory();
  }, []);

  console.log(isHistoryLoading);

  const fetchCurrentLocation = async () => {
    console.log("fetching current location");
    try {
      const response = await axios.get("https://ipinfo.io/json");
      const data = response.data;
      setGeoData(data);
    } catch (error) {
      console.error("Failed to fetch current location: ", error);
      toast.error("Failed to detect your location");
    } finally {
      setIsGeoLoading(false);
    }
  };

  const fetchHistory = async () => {
    console.log("fetching history");
    try {
      setIsHistoryLoading(true);
      const response = await api.get("/history");
      setHistory(response.data.history);
    } catch (error) {
      console.error("Failed to fetch history: ", error);
      toast.error("Failed to fetch history");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    const trimmedIp = ipInput.trim();

    if (!trimmedIp) {
      toast.error("Please enter an IP address");
      return;
    }

    if (!isValidIp(trimmedIp)) {
      toast.error("Invalid IP address format");
      return;
    }

    try {
      setIsGeoLoading(true);
      const response = await api.get(`/geo/${trimmedIp}`);
      setGeoData(response.data);
      setIsCurrentLocation(false);
      setSearchedIp(trimmedIp);
      fetchHistory();
      toast.success("Location found!");
    } catch (error: any) {
      console.error("Failed to search IP: ", error);
      const message =
        error.response?.data?.message || "Failed to fetch location";
      toast.error(message);
    } finally {
      setIsGeoLoading(false);
    }
  };

  const handleClear = () => {
    setIpInput("");
    setIsCurrentLocation(true);
    setSearchedIp("");
    fetchCurrentLocation();
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex justify-between items-start mb-12">
        <div>
          <h1 className="font-semibold text-4xl mb-1">
            IP Geolocation Dashboard
          </h1>
          <p className="text-muted-foreground text-base">
            Welcome back, {username || "User"}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center mt-0.5 font-medium gap-2 px-3 py-2 text-sm hover:bg-zinc-800 transition-all rounded-md border-2 border-color-border bg-color-card hover:cursor-pointer"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          <p>Logout</p>
        </button>
      </header>
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="bg-color-card border-2 border-color-border p-7 rounded-md">
          <label htmlFor="search" className="text-zinc-300">
            Search IP Address
          </label>
          <div className="flex gap-3 mt-3">
            <input
              id="search"
              type="text"
              value={ipInput}
              onKeyDown={handleKeydown}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              className="bg-zinc-950 flex-1 rounded-md border-2 border-border focus:border-transparent focus:outline-none px-3 py-2 focus:ring-2 focus:ring-accent-color transition-all"
            />
            <button
              onClick={handleSearch}
              className="px-5 transition-all rounded-md bg-accent-color hover:bg-accent-color-hover hover:cursor-pointer"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              disabled={isCurrentLocation}
              className="px-5 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 hover:cursor-pointer rounded-md text-muted-foreground"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Search loc info */}
        <div className="bg-color-card border-2 border-color-border p-7 rounded-md">
          <div className="flex gap-2 items-center mb-4">
            <Globe className="text-accent-color w-6 h-6" />
            <p className="text-2xl font-medium">
              {!isCurrentLocation && searchedIp
                ? searchedIp
                : "Your current location"}
            </p>
          </div>
          <CurrentLocationCard geoData={geoData} isGeoLoading={isGeoLoading} />
        </div>

        {/* Leaflet  */}
        <div className="bg-color-card border-2 border-color-border p-7 rounded-md">
          <div className="flex gap-2 items-center mb-4">
            <MapPin className="text-accent-color w-6 h-6" />
            <p className="text-2xl font-medium">Location Map</p>
          </div>
          <LocationMap geoData={geoData} />
        </div>

        {/* Search History */}
        <div className="bg-color-card border-2 border-color-border p-7 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center ">
              <RefreshCcw className="text-accent-color w-6 h-6" />
              <p className="text-2xl font-medium">Search History</p>
            </div>
            <p className="text-muted-foreground">
              {history?.length || "0"} items
            </p>
          </div>

          <SearchHistory
            history={history}
            selected={selectedHistory}
            setSelected={setSelectedHistory}
            fetchHistory={fetchHistory}
          />
        </div>
      </div>
    </div>
  );
}
