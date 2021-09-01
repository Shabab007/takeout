import React from 'react';
import NxtTxtApart from '../../basic/nxt-text-apart';
import IxCurrency from '../../basic/ix-currency';

const NxtCartSummary = ({ title, value }) => {
  return (
    <NxtTxtApart
      left={title}
      leftColor="textSecondary"
      rightColor="textSecondary"
      right={<IxCurrency value={value}></IxCurrency>}
    ></NxtTxtApart>
  );
};

export default NxtCartSummary;
