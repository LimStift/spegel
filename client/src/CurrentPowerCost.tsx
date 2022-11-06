import { useGlobalState } from "./hooks/GlobalStateContext";

export function CurrentPowerCost(): JSX.Element {
  const context = useGlobalState();
  return (
    <p>
      Elkostnad: {Math.round(context.state.currentPowerUsage * context.state.currentPowerPrice) / 100} kr/h
    </p>
  );
}
