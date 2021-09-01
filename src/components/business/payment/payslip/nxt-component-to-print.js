/* eslint-disable max-len */
import React from 'react';
import Header from './nxt-payslip-header';
import PaidItems from './nxt-paid-items';
import PayslipFooter from './nxt-payslip-footer';

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0, PaymentResponse: {} };
  }

  componentDidMount() {
    this.setState({
      payResponse: this.props.payResponse,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.payResponse &&
      this.props.payResponse.orderId &&
      this.props.payResponse.orderId !== prevProps.payResponse.orderId
    ) {
      this.setState({
        payResponse: this.props.payResponse,
      });
    }
  }

  render() {
    let payResponse = null;
    if (this.state && this.state.payResponse) {
      payResponse = this.state.payResponse;
    }

    if (!payResponse) {
      return '';
    }

    return (
      <div
        style={{
          margin: '1em',
          textAlign: 'center',
          textTransform: 'uppercase',
          fontFamily: 'Oswald,sans-serif',
        }}
      >
        {payResponse !== null ? (
          <div>
            <Header logo={payResponse.logo} header={payResponse.header ? payResponse.header : {}}></Header>
            <PaidItems invoice={payResponse}></PaidItems>
            <PayslipFooter
              refNo={payResponse.paymentTransactionId}
              footer={payResponse.footer ? payResponse.footer : {}}
            ></PayslipFooter>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ComponentToPrint;
