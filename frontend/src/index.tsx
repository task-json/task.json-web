import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from "./store";
import "typeface-roboto";
import "./styles/app.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { green } from '@material-ui/core/colors';

const theme = createMuiTheme({
	palette: {
    secondary: {
      main: green[500],
      contrastText: "white"
    }
	}
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
