import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import ErrorBoundary from '../components/composite/ix-error-boundary';
import SessionProtectedRoute from './session-protected-route';
import SessionAndTableNbrProtectedRoute from './session-and-table-nbr-protected-route';

import NxtBookRestaurantTable from '../components/business/home/nxt-book-restaurant-table';
import TableBookErrorView from '../components/business/home/nxt-restaurant-table-book-unsuccessful';

import NxtLanguageSelector from '../components/business/language-selector/nxt-language-selector';
import NxtGuide from '../components/business/guide/nxt-guide';

import NxtQrReader from '../components/business/qr-reader/nxt-qr-reader';
import NxtRestaurantHome from '../components/business/home/nxt-restaurant-home';
import GuestConfiguration from '../components/business/guest-configuration/nxt-guest-configuration';

import NxtMenuHome from '../components/business/menu/nxt-menu-container';
import NxtRecommendedMenu from '../components/business/menu/nxt-recommended-menu-container';

import NxtMenuDetail from '../components/business/menu/menu-detail/nxt-menu-details-container';
import SearchFoodItems from '../components/business/menu/search-food-item/nxt-search-container';

import NxtFoodItemDetail from '../components/business/food-item-detail/nxt-food-item-detail-container';

import NxtCart from '../components/business/cart/nxt-cart-container';

import UrlNotFound from '../components/business/404/404';
import TableHome from '../components/business/order/nxt-table-home';

import OrderHome from '../components/business/order/nxt-order-home-container';
import NxtOrderDetailContainer from '../components/business/cart/nxt-order-detail-container';
import NxtOrderResult from '../components/business/order/nxt-order-result';

import PackageMenuTimer from '../components/business/order/nxt-order-timer/nxt-packege-menu-timer';

import PaymentHome from '../components/business/payment/nxt-payment-container';
import TipHome from '../components/business/payment/nxt-tip-container';
import ConfirmPayment from '../components/business/payment/nxt-confirm-payment';
import NxtCreditCardDetail from '../components/business/payment/nxt-credit-card-detail';
import TestSocket from '../components/business/test/test-socket';
import AppUtility from '../components/business/app-utility/app-utility';
import ScrollToTop from '../components/composite/scroll-to-top';

export const AppRoute = () => (
  <BrowserRouter>
    <ScrollToTop>
      <AppUtility />
      <Switch>
        {/* <Route exact path="/">
        <Redirect to="/home/for-table-book/" />
      </Route> */}

        <Route
          exact
          path="/home/for-table-book/"
          render={(props) => (
            <ErrorBoundary>
              <UrlNotFound {...props} />
            </ErrorBoundary>
          )}
        />

        <Route
          exact
          path="/home/table/error"
          render={(props) => (
            <ErrorBoundary>
              <TableBookErrorView {...props} />
            </ErrorBoundary>
          )}
        />

        <Route
          exact
          path="/home/for-table-book/:tableCode"
          render={(props) => (
            <ErrorBoundary>
              <NxtBookRestaurantTable {...props} />
            </ErrorBoundary>
          )}
        />

        <Route exact path="/language-selection" component={NxtLanguageSelector} />

        <Route exact path="/guide" component={NxtGuide} />
        {/* {session Protected routes} */}
        <SessionProtectedRoute exact path="/scan-qr-code" component={NxtQrReader} />

        {/* {session and qr Protected routes} */}

        <SessionAndTableNbrProtectedRoute exact path="/restaurant-home" component={NxtRestaurantHome} />

        <SessionAndTableNbrProtectedRoute exact path="/recommended" component={NxtRecommendedMenu} />


        <SessionAndTableNbrProtectedRoute exact path="/menus" component={NxtMenuHome} />

        <SessionAndTableNbrProtectedRoute exact path="/menus/:id" component={NxtMenuDetail} />

        <SessionAndTableNbrProtectedRoute exact path="/menu-remaining-time" component={PackageMenuTimer} />

        <SessionAndTableNbrProtectedRoute exact path="/table-home" component={TableHome} />

        <SessionAndTableNbrProtectedRoute exact path="/guest-configuration" component={GuestConfiguration} />

        <SessionAndTableNbrProtectedRoute exact path="/food-item-details" component={NxtFoodItemDetail} />

        <SessionAndTableNbrProtectedRoute exact path="/menu/search" component={SearchFoodItems} />

        <SessionAndTableNbrProtectedRoute exact path="/cart" component={NxtCart} />

        <SessionAndTableNbrProtectedRoute exact path="/order-detail" component={NxtOrderDetailContainer} />

        <SessionAndTableNbrProtectedRoute exact path="/order-home" component={OrderHome} />

        <SessionAndTableNbrProtectedRoute exact path="/order-result" component={NxtOrderResult} />

        <SessionAndTableNbrProtectedRoute exact path="/order/payment" component={PaymentHome} />

        <SessionAndTableNbrProtectedRoute exact path="/order/tips" component={TipHome} />

        <SessionAndTableNbrProtectedRoute exact path="/confirm-payment" component={ConfirmPayment} />

        <SessionAndTableNbrProtectedRoute
          exact
          path="/order/payment/credit-card-detail"
          component={NxtCreditCardDetail}
        />

        <SessionAndTableNbrProtectedRoute exact path="/order/payment-success" component={PaymentHome} />

        <Route
          exact
          path="/test-socket"
          render={(props) => (
            <ErrorBoundary>
              <TestSocket {...props} />
            </ErrorBoundary>
          )}
        />

        <Route path="*">
          <Redirect to="/home/for-table-book/" />
        </Route>
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);
