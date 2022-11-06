import React from "react";

type Action =
  | { type: "setUsage"; currentPowerUsage: number }
  | { type: "setPrice"; currentPowerPrice: number };
type Dispatch = (action: Action) => void;
type State = {
  currentPowerUsage: number;
  currentPowerPrice: number;
};
type GlobalStateProviderProps = { children: React.ReactNode };

const initialState = {
  currentPowerUsage: -1,
  currentPowerPrice: -1,
};

const GlobalStateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function globalStateReducer(state: State, action: Action) {
  switch (action.type) {
    case "setUsage": {
      return { ...state, currentPowerUsage: action.currentPowerUsage };
    }
    case "setPrice": {
      return { ...state, currentPowerPrice: action.currentPowerPrice };
    }
    default: {
      throw new Error(`Unknown action type: ${action}`);
    }
  }
}

function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [state, dispatch] = React.useReducer(globalStateReducer, initialState);
  const value = { state, dispatch };

  return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
}

function useGlobalState() {
  const context = React.useContext(GlobalStateContext);

  if (!context) {
    throw new Error(`useGlobalState must be used within a GlobalStateProvider`);
  }

  return context;
}

export { GlobalStateProvider, useGlobalState };
