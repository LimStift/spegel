import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

  if (powerUsage.length <= 0) {
    return <p>Ingen data.</p>;
  }

  const currentUsage = powerUsage[powerUsage.length - 1];

  return (
    <>
      <p>Använd el just nu: {currentUsage?.value ?? -1}kWh</p>
      <AreaChart width={400} height={200} data={powerUsage}>
        <Area dataKey="value" isAnimationActive={false}></Area>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis
          dataKey="date"
          interval={12}
          tickFormatter={(v) => new Date(v).toLocaleTimeString("sv", { minute: "2-digit", hour: "2-digit" })}
        />
        <YAxis scale="sequential" label="kWh" domain={[0, (dataMax: number) => Math.max(1, dataMax)]} />
      </AreaChart>
    </>
  );
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
