import { connect } from 'react-redux';
import NxtOrderDetail from './nxt-order-detail-home';

import { cancelOrderToProps } from '../../../actions/nxt-order-action';
import { setDisplayOrder, setOrder, setCart } from '../../../actions/cart';

const mapDispatchToProps = {
  cancelOrderToProps,
  setDisplayOrder,
  setOrder,
  setCart,
};

const mapStateToProps = (state) => {
  const { cart, appState } = state;
  return {
    order: cart.order,
    appState: appState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NxtOrderDetail);
