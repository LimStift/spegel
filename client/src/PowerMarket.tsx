import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function PowerMarket(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <DisplayPowerMarket />
    </QueryClientProvider>
  );
}

export function DisplayPowerMarket(): JSX.Element {
  const price = useFetchPrice();

  return <>Pris: {price[0]} öre</>;
}

function useFetchPrice(): number[] {
  const { isLoading, error, data } = useQuery(
    ["powerMarket"],
    (): Promise<number[]> => {
      return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/api/powermarket`).then((res) => res.json());
    },
    { refetchInterval: 3600000 }
  );

  if (isLoading || error || data === undefined) {
    return [-1];
  }

  return data;
}
