import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function InternalPower(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <DisplayPowerUsage />
    </QueryClientProvider>
  );
}

export function DisplayPowerUsage(): JSX.Element {
  const powerUsage = useFetchPowerUsage();

  const currentUsage = powerUsage[powerUsage.length - 1];

  return <p>Använd el just nu: {currentUsage?.value ?? -1}kWh</p>;
}

interface SensorValue {
  value: number;
  date: Date;
}

function useFetchPowerUsage() {
  const { isLoading, error, data } = useQuery(
    ["powerUsage"],
    (): Promise<SensorValue[]> =>
      fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/api/internalpower`).then((res) => res.json()),
    { refetchInterval: 10000 }
  );

  if (isLoading || error || data === undefined) {
    return [];
  }

  return data;
}
