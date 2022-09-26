import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Travel(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <DisplayTravel />
    </QueryClientProvider>
  );
}

interface Journey {
  Departure: Departure[];
}

interface Departure {
  JourneyDetailRef: { ref: string };
  time: string;
  direction: string;
}

function useFetchTravel(type: string): Departure[] {
  const { isLoading, error, data } = useQuery(
    [type],
    (): Promise<Journey> =>
      fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/api/${type}`).then((res) => res.json())
  );

  if (isLoading || error || data === undefined) {
    return [];
  }

  return data.Departure ?? [];
}

function useFetchTravelByBus(): Departure[] {
  return useFetchTravel("travelbus");
}

function useFetchTravelByTrain(): Departure[] {
  return useFetchTravel("traveltrain");
}

function formatDepartureTime(time: string) {
  return time.split(":").slice(0, 2).join(":");
}

function DisplayTravel(): JSX.Element {
  const buses = useFetchTravelByBus();
  const trains = useFetchTravelByTrain();

  return (
    <>
      <h1>Kommande bussar (Rundelsvägen)</h1>
      {buses.slice(0, 4).map((bus) => (
        <p key={bus.JourneyDetailRef.ref}>{`${formatDepartureTime(bus.time)} mot ${bus.direction}`}</p>
      ))}
      <h1>Kommande tåg</h1>
      {trains.slice(0, 4).map((train) => (
        <p key={train.JourneyDetailRef.ref}>{`${formatDepartureTime(train.time)} mot ${train.direction}`}</p>
      ))}
    </>
  );
}
