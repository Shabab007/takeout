import React from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

function PayslipFooter({ refNo, footer }) {
  const { t } = useTranslation(['orderr']);
  const { note } = footer;

  return (
    <Grid className="footer" container>
      {refNo && (
        <Grid className="footerRefNo" container direction="row">
          <p className="refText">
            {t('paymentslipRef')} {refNo}
          </p>
        </Grid>
      )}

      <Grid justify="center" className="footerSign" container direction="row">
        <pre className="signText">{note}</pre>
      </Grid>
    </Grid>
  );
}

export default PayslipFooter;
