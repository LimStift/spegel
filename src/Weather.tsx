import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
    fetch(
      "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.9081/lat/55.8557/data.json"
    ).then((res) => res.json())
  );

  if (isLoading || error) {
    return null;
  }

  return data;
}

function DisplayWeather(): JSX.Element {
  const [weather, setWeather] = useState<null | WeatherData>(null);

  const weatherData = useFetchWeather();
  if (weather === null && weatherData !== null) {
    setWeather(weatherData);
  }

  return <>Väder: {weather?.timeSeries[0].parameters.find((p) => p.name === "t")?.values[0]}c</>;
}
