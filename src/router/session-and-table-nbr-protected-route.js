import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SessionAndTableNbrProtectedRoute({ component: Component, ...rest }) {
  const appState = useSelector((state) => state.appState);
  const { session, securityCode } = appState;

  return (
    <Route
      {...rest}
      render={(props) =>
        session.data && session.data.token && securityCode.data && securityCode.data.tableBookingNbr ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/home/for-table-book/' }} />
        )
      }
    />
  );
}
export default SessionAndTableNbrProtectedRoute;
// '/scan-qr-code'
