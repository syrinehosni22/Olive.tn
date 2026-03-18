import React from "react";
import { Provider } from "react-redux";
import store from "./store"; // Default import because you used 'export default'

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function Providers({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}