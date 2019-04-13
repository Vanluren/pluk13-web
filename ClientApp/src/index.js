import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme, GlobalStyle } from './util/theme';
import Routing from './Routing';
import registerServiceWorker from './registerServiceWorker';


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.Fragment>
    <BrowserRouter basename={baseUrl}>
      <ThemeProvider theme={theme} >
      <CssBaseline>
        <Routing />
      </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>,
    <GlobalStyle/>
  </React.Fragment>,
  rootElement);

registerServiceWorker();
