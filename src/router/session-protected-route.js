import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SessionProtectedRoute({ component: Component, ...rest }) {
  const { session, restaurantTable, companyConfig } = useSelector((state) => state.appState);

  return (
    <Route
      {...rest}
      render={(props) =>
        session.data && restaurantTable.data && companyConfig.data ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/home/for-table-book/' }} />
          // state: { referer: props.location }
        )
      }
    />
  );
}
export default SessionProtectedRoute;
