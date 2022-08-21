import { InternalPower } from "./InternalPower";
import { Time } from "./Time";
import { Travel } from "./Travel";
import { Weather } from "./Weather";

export function App(): JSX.Element {
  return (
    <>
      <Time /> <br />
      <Weather /> <br />
      <Travel /> <br />
      <InternalPower />
    </>
  );
}
