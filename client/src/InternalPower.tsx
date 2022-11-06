import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useGlobalState } from "./hooks/GlobalStateContext";

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
  const context = useGlobalState();
  useEffect(() => {
    if (powerUsage.length > 0) {
      context.dispatch({ type: "setUsage", currentPowerUsage: powerUsage[powerUsage.length - 1]?.value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [powerUsage]);

  if (powerUsage.length <= 0) {
    return <p>Ingen data.</p>;
  }

  return (
    <>
      <p>Använd el just nu: {context.state.currentPowerUsage ?? -1}kWh</p>
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
