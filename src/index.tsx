import { createContext, render } from 'preact';
import { createState } from "./state";
import App from "./App";
import './style.css';

const state = createState();
const AppState = createContext(state);

render(
  <AppState.Provider value={state}>
    <App />,
  </AppState.Provider>,
  document.getElementById('app')
);
