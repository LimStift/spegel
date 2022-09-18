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

  return <>Pris: {price[0]}</>;
}

function useFetchPrice(): number[] {
  const { isLoading, error, data } = useQuery(["powerMarket"], () => {
    const url = new URL("https://web-api.tp.entsoe.eu/api");
    const params = [
      ["securityToken", import.meta.env.VITE_ENTSOE_TOKEN],
      ["documentType", "A44"],
      ["in_Domain", "10Y1001A1001A47J"],
      ["out_Domain", "10Y1001A1001A47J"],
      ["periodStart", "202209100000"],
      ["periodEnd", "202209110000"],
    ];
    url.search = new URLSearchParams(params).toString();
    return fetch(url).then((res) => res.text());
  });

  if (isLoading || error || data === undefined) {
    return [-1];
  }

  return [0];
}
