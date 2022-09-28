import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
const queryClient = new QueryClient();

export function Weather(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <DisplayWeather />
    </QueryClientProvider>
  );
}

interface WeatherData {
  timeSeries: Array<Time>;
}

interface Time {
  validTime: Date;
  parameters: Array<Parameter>;
}

interface Parameter {
  name: string;
  levelType: string;
  level: number;
  unit: string;
  values: Array<number>;
}

function useFetchWeather(): null | WeatherData {
  const { isLoading, error, data } = useQuery(["timeData"], () =>
    fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/api/weather`).then((res) => res.json())
  );

  if (isLoading || error) {
    return null;
  }

  return data;
}

function DisplayWeather(): JSX.Element {
  const weatherData = useFetchWeather();

  return <>Väder: {weatherData?.timeSeries[0].parameters.find((p) => p.name === "t")?.values[0]}c</>;
}
