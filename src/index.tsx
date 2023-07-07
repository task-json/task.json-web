import { render } from 'preact';
import { StateContext, createState } from "./state";
import App from "./App";
import "@fontsource/roboto";
import './style.css';

render(
  <StateContext.Provider value={createState()}>
    <App />,
  </StateContext.Provider>,
  document.getElementById('app')
);
