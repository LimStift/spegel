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
  departures: Departure[];
}

interface Departure {
  JourneyDetailRef: { ref: string };
  time: string;
  direction: string;
}

function useFetchTravel(stopId: string): Departure[] {
  const { isLoading, error, data } = useQuery(
    [stopId],
    (): Promise<Journey> =>
      fetch(
        `https://api.resrobot.se/v2.1/departureBoard?id=${stopId}&duration=240&format=json&accessId=${
          import.meta.env.VITE_RESROBOT_ACCESS_ID
        }`
      ).then((res) => res.json())
  );

  if (isLoading || error) {
    return [];
  }

  return data.Departure ?? [];
}

function useFetchTravelByBus(): Departure[] {
  return useFetchTravel("740017393");
}

function useFetchTravelByTrain(): Departure[] {
  return useFetchTravel("740001547");
}

function formatDepartureTime(time: string) {
  return time.split(":").slice(0, 2).join(":");
}

function DisplayTravel(): JSX.Element {
  const buses = useFetchTravelByBus();
  const trains = useFetchTravelByTrain();

  return (
    <>
      <h1>Kommande bussar (rundelsvägen)</h1>
      {buses.slice(0, 4).map((bus) => (
        <p key={bus.JourneyDetailRef.ref}>{`${formatDepartureTime(bus.time)} mot ${bus.direction}`}</p>
      ))}
      <h1>Kommande Tåg</h1>
      {trains.slice(0, 4).map((train) => (
        <p key={train.JourneyDetailRef.ref}>{`${formatDepartureTime(train.time)} mot ${train.direction}`}</p>
      ))}
    </>
  );
}
