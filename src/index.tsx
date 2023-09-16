import { render } from 'preact';
import App from "./App";
import "@fontsource/roboto";
import './style.css';

// Ag Grid css
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

render(
  <App />,
  document.getElementById('app')
);
