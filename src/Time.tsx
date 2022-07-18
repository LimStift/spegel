import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

export function Time(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <DisplayTime />
    </QueryClientProvider>
  );
}

interface WorldTime {
  datetime: string;
}

function useFetchTime(): Date {
  const { isLoading, error, data } = useQuery(
    ["timeData"],
    (): Promise<WorldTime> =>
      fetch("http://worldtimeapi.org/api/timezone/Europe/Stockholm").then((res) => res.json())
  );

  if (isLoading || error) {
    return new Date();
  }

  return new Date(data.datetime);
}

function DisplayTime(): JSX.Element {
  const [internalTime, setInternalTime] = useState<Date | null>(null);
  const [displayedTime, setDisplayedTime] = useState<Date | null>(null);
  const time = useFetchTime();
  if (internalTime === null || time.getSeconds() !== internalTime.getSeconds()) {
    setInternalTime(time);
    setDisplayedTime(time);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (displayedTime !== null) {
        setDisplayedTime(new Date(displayedTime.getTime() + 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [internalTime, displayedTime]);

  return <>{displayedTime?.toLocaleTimeString() ?? "Ingen data"}</>;
}
