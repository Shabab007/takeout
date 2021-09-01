import React from 'react';
import { useTranslation } from 'react-i18next';

import { connect } from 'react-redux';
import {
  toggleCheckboxOption,
  updateFoodPackagePriceWithToppings,
  setSpecialInstruction,
} from '../../../actions/food-detail-actions';

import LanguageNamespaces from '../../../constants/language-namespaces';
import IxInput from '../../basic/ix-Input';
import IxCollapsePanel from '../../basic/ix-collapse-panel';
import IxCheckBoxSuffix from '../../basic/ix-check-box-suffix';
import { makeStyles } from '@material-ui/core';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import companyConfigEnum from '../../../constants/company-config-enum';

const mapDispatchToProps = (dispatch) => {
  return {
    handleUpdateCheckBox: (payload) => {
      dispatch(toggleCheckboxOption(payload));
      dispatch(updateFoodPackagePriceWithToppings());
    },
    handleSpecialInstructionChange: (text) => {
      dispatch(setSpecialInstruction(text));
    },
  };
};

const mapStateToProps = (state) => {
  const { appState, foodDetail } = state;
  return {
    companyConfigData: appState.companyConfig.data,
    choicesCategories: foodDetail.choicesCategories,
    specialInstruction: foodDetail.specialInstruction,
    takeOut: foodDetail.takeOut,
  };
};

const useStyles = makeStyles((theme) => ({
  collapsedContentWrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  suffix: {
    minWidth: theme.spacing(6.4),
    textAlign: 'right',
  },
  priceDisplayClassName: {
    fontSize: '.9rem',
  },
  priceDisplaySuffixClassName: {
    fontSize: '.7rem',
  },
}));
const NxtFoodCustomization = ({
  companyConfigData,
  choicesCategories,
  handleUpdateCheckBox,
  specialInstruction,
  handleSpecialInstructionChange,
  takeOut,
}) => {
  const classes = useStyles();
  // const [expandedPanelId, setExpandedPanelId] = useState();
  const specialInstructionInputRow = 3;
  const [t] = useTranslation([LanguageNamespaces.menus]);

  let takeAwayTax, diningTax;

  try {
    takeAwayTax = +companyConfigData[companyConfigEnum.TAKE_AWAY_TAX];
    diningTax = +companyConfigData[companyConfigEnum.EAT_IN_TAX];
  } catch (e) {
    console.warn(e);
  }

  const handleExpansionPanelChange = (id) => (event, isExpanded) => {
    // setExpandedPanelId(isExpanded ? id : false);
  };

  const choiceItemPricePrefix = '+';

  const handleChoiceItemsChange = (event, categoryId, choiceId) => {
    handleUpdateCheckBox({ categoryId, choiceId });
  };

  if (!choicesCategories) {
    return '';
  }
  return (
    <div>
      {choicesCategories.map((category, index) => {
        const { id, name, isRequired, choicesItems } = category;
        let subTitle, subTitleColor;
        if (isRequired) {
          subTitleColor = 'primary';
          subTitle = t('Required');
        } else {
          subTitle = t('Optional');
        }
        return (
          <IxCollapsePanel
            key={index}
            id={id}
            name={name}
            subTitle={subTitle}
            subTitleColor={subTitleColor}
            onChange={handleExpansionPanelChange}
            // expanded={id === expandedPanelId}
            defaultExpanded={true}
          >
            <div className={classes.collapsedContentWrapper}>
              {/* CheckBoxes */}
              {choicesItems.map((choiceItem) => {
                const {
                  id,
                  name,
                  checked,
                  price,
                  // priceIncludingTax,
                } = choiceItem;
                return (
                  <IxCheckBoxSuffix
                    key={id}
                    name={name}
                    value={price}
                    label={name}
                    checked={checked}
                    handleChange={(event) =>
                      handleChoiceItemsChange(event, category.id, id)
                    }
                    // suffix={<IxCurrency value={price} prefix={choiceItemPricePrefix} />}
                    suffix={
                      <NxtPriceDisplay
                        price={price}
                        priceIncludingTax={
                          price +
                          (price * (takeOut ? takeAwayTax : diningTax)) / 100
                        }
                        shouldApplyCompanyConfigPriceRounding={false}
                        option={
                          companyConfigData &&
                          companyConfigData[
                            companyConfigEnum.PRICE_DISPLAY_OPTION
                          ]
                        }
                        prefix={choiceItemPricePrefix}
                        className={classes.priceDisplayClassName}
                        suffixClassName={classes.priceDisplaySuffixClassName}
                      ></NxtPriceDisplay>
                    }
                    suffixClassName={classes.suffix}
                  ></IxCheckBoxSuffix>
                );
              })}
            </div>
          </IxCollapsePanel>
        );
      })}

      <IxInput
        label={t('Special Instruction')}
        defaultValue={specialInstruction}
        value={specialInstruction}
        onChangeTextField={(text) => handleSpecialInstructionChange(text)}
        multiline={true}
        rows={specialInstructionInputRow}
        adornment={null}
      ></IxInput>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NxtFoodCustomization);
