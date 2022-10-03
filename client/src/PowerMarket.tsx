import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

const queryClient = new QueryClient();

export function PowerMarket(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <DisplayPowerMarket />
    </QueryClientProvider>
  );
}

export function DisplayPowerMarket(): JSX.Element {
  const prices = useFetchPrice();

  if (prices.length <= 0) {
    return <p>Ingen data.</p>;
  }

  const currentHour = new Date().getUTCHours();

  return (
    <>
      <p>Elpris:</p>
      <BarChart width={800} height={200} data={prices[0].concat(prices[1])}>
        <Bar dataKey="value" fill="#c00">
          {prices[0]
            .map((p, i) => (
              <Cell
                fill={new Date(p.date).getUTCHours() === currentHour ? "#700" : "#c00"}
                key={`cell-0${i}`}
              />
            ))
            .concat(prices[1].map((_, i) => <Cell fill={"#ccc"} key={`cell-1${i}`} />))}
        </Bar>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
        <XAxis
          dataKey="date"
          interval={1}
          tickFormatter={(v) => new Date(v).toLocaleTimeString("sv", { hour: "2-digit" })}
        />
        <YAxis scale="sequential" label="öre" />
      </BarChart>
    </>
  );
}

interface PowerPrice {
  value: number;
  date: Date;
}

function useFetchPrice(): PowerPrice[][] {
  const { isLoading, error, data } = useQuery(
    ["powerMarket"],
    (): Promise<PowerPrice[][]> => {
      return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/api/powermarket`).then((res) => res.json());
    },
    { refetchInterval: 3600000 }
  );

  if (isLoading || error || data === undefined) {
    return [];
  }

  return data;
}
