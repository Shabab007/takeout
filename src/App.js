import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import { serializeError } from 'serialize-error';
import { ThemeProvider } from '@material-ui/core/styles';
import store, { history } from './store/configure-store';
import axios from './utils/axios';

import { AppRoute } from './router/app-route';
// import ErrorNotification from './components/composite/ix-error-notification';

import { theme } from './utils/themes';
import NxtSnackbar from './components/composite/nxt-snackbar';

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme}>
          {/* <ErrorNotification /> */}
          <SnackbarProvider
            maxSnack={3}
            dense={true}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            content={(key, settings) => (
              <NxtSnackbar id={key} settings={settings} />
            )}
          >
            <AppRoute />
          </SnackbarProvider>
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
};

const UNAUTHORIZED = 401;

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let isSerializationNeeded;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status } = error.response;
      if (status === UNAUTHORIZED) {
        // TODO: reset store, redirect to root page
        // store.dispatch({ type: 'unauthorized' });
        // history.replace('/home/for-table-book');
        console.warn('unauthorized');
        sessionStorage.clear();
        window.location.href = `/home/for-table-book`;
        return Promise.reject(error);
      } else {
        // store.dispatch({ type: 'error message' });
      }
    } else if (error.request) {
      isSerializationNeeded = true;
      // The request was made but no response was received
      console.log(error.request);
    } else {
      isSerializationNeeded = true;
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    if (isSerializationNeeded) {
      return Promise.reject(serializeError(error));
    }

    return Promise.reject(error);
  },
);

export default App;
