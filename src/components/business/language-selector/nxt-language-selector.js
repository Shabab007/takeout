import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';

import NxtLayout from '../../composite/nxt-layout';
import IxTxtBox from '../../basic/ix-txt-box';
import IxButton from '../../basic/ix-button';
import IxIconButtonRadioGroup from '../../basic/ix-icon-btn-radio-group';

import { redirectToGuide } from '../../../services/utility';
import { fetchLanguages, selectLanguageCode } from './languagesSlice';
import useStyles from './styles';
import icons from '../../../assets/imgs/flags';
import NextLogo from '../../../assets/imgs/common/regiless-user-app-logo.png';

const NxtLanguageSelector = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const [selectedLanguageIndex, setSelectedLanguageIndex] = React.useState(-1);

  const languages = useSelector((state) => state.language.data);
  const languageListTranslated = languages.map((language) => ({ ...language, name: i18n.t(language.name) }));
  const selectedLanguageCode = useSelector((state) => state.language.code);

  React.useEffect(() => {
    if (!languages.length) {
      dispatch(fetchLanguages());
    }
  }, [languages, dispatch]);

  React.useEffect(() => {
    if (languageListTranslated && selectedLanguageCode) {
      // eslint-disable-next-line eqeqeq
      setSelectedLanguageIndex(languageListTranslated.findIndex((language) => language.value == selectedLanguageCode));
    }
  }, [selectedLanguageCode, languageListTranslated]);

  const handleLanguageChange = (index) => {
    const langCode = languageListTranslated[+index].value;
    i18n.changeLanguage(langCode);
    dispatch(selectLanguageCode(langCode));
  };

  const handleContinueBtnAction = () => {
    redirectToGuide(history);
  };

  return (
    <NxtLayout
      childrenCentered={true}
      footer={
        <IxButton
          variant="contained"
          fullWidth
          color="primary"
          className={classes.continueButton}
          onClick={handleContinueBtnAction}
        >
          {t('Continue')}
        </IxButton>
      }
    >
      <Grid className={classes.bodyWrapper} container direction="row" justify="center" alignItems="center">
        <div className={classes.logoWrapper}>
          <img src={NextLogo} alt="app logo" />

          <IxTxtBox className={classes.subtitle} secondary={t('greeting-subtext')}></IxTxtBox>
          {/* {selectedLanguageCode === 'ja-JP' ? <IxTxtBox secondary={'Please select a language'}></IxTxtBox> : ''} */}
        </div>

        <div className={classes.languageChoiceWrapper}>
          {languageListTranslated.length ? (
            <IxIconButtonRadioGroup
              fullWidth={true}
              items={languageListTranslated}
              icons={icons}
              selectedIndex={selectedLanguageIndex}
              itemChange={handleLanguageChange}
            ></IxIconButtonRadioGroup>
          ) : (
            ''
          )}
        </div>
      </Grid>
    </NxtLayout>
  );
};

export default NxtLanguageSelector;
