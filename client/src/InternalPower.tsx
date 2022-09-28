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

  return <p>Använd el: {powerUsage[powerUsage.length - 1].state}kWh</p>;
}

interface SensorValue {
  entity_id: string;
  state: number;
  last_changed: Date;
}

function useFetchPowerUsage() {
  const { isLoading, error, data } = useQuery(
    ["powerUsage"],
    (): Promise<Array<Array<SensorValue>>> =>
      fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/api/internalpower`).then((res) => res.json())
  );

  if (isLoading || error || data === undefined) {
    return [{ state: 0 }];
  }

  return data[0];
}
