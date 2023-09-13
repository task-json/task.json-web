import { render } from 'preact';
import App from "./App";
import "@fontsource/roboto";
import './style.css';
import "virtual:uno.css";

render(
  <App />,
  document.getElementById('app')
);
