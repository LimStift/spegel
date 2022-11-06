import React from "react";
import { GlobalStateProvider } from "./hooks/GlobalStateContext";
import { InternalPower } from "./InternalPower";
import { PowerMarket } from "./PowerMarket";
import { Time } from "./Time";
import { Travel } from "./Travel";
import { Weather } from "./Weather";

export function App(): JSX.Element {
  return (
    <GlobalStateProvider>
      <Time /> <br />
      <Weather /> <br />
      <Travel /> <br />
      <InternalPower /> <br />
      <PowerMarket />
    </GlobalStateProvider>
  );
}
