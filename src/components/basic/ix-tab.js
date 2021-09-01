import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
    flexGrow: 1,
    width: '100%',

    '& .Mui-selected': {
      color: '#000000',
      fontWeight: 700,
      fontSize: '1rem'
    },

    '& .MuiTab-wrapper': {
      fontSize: '1rem'
    },

    '& .MuiAppBar-root': {
      background: '#FFD900',
      boxShadow: 'none',
      // position: 'fixed'
    },
    '& .MuiBox-root': {
      padding: '1em .5em 0 0',
    },
  },
  indicator: {
    backgroundColor: '#000000',
    height: '0.2em',
    fontWeight: 600
  },
  tabInCategory: {
    padding: 0,
    margin: 0,
    flexGrow: 1,
    width: '100%',

    '& .Mui-selected': {
      color: '#000000',
      fontWeight: 700,
      fontSize: '1rem'
    },

    '& .MuiTab-wrapper': {
      fontSize: '1rem'
    },

    '& .MuiAppBar-root': {
      background: '#FFD900',
      boxShadow: 'none',
      position: 'absolute'
    },
    '& .MuiBox-root': {
      padding: '1em .5em 0 0',
    },
  },
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const makeTabId = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
};

const IxTab = ({
  itemList,
  initialOpenTab = 0,
  contentBetweenTabAndPanel,
  setCategoryIndex,
  resetCategoryIndex,
  categoryView
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(initialOpenTab);
  const [
    showContentBetweenTabAndPanel,
    setShowContentBetweenTabAndPanel,
  ] = useState(true);

  useEffect(() => {
    if (itemList && itemList.length) {
      setShowContentBetweenTabAndPanel(
        itemList[value]?.allowContentBetweenTabAndPanel,
      );
    }
  }, [value, itemList]);

  const handleChange = (event, newValue) => {
    typeof setCategoryIndex == 'function' &&
      setCategoryIndex(resetCategoryIndex ? 0 : newValue);
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    typeof setCategoryIndex == 'function' &&
      setCategoryIndex(resetCategoryIndex ? 0 : index);
    setValue(index);
  };

  if (!itemList || !itemList.length) {
    return <div></div>;
  }
  return (
    <div className={categoryView ? classes.tabInCategory : classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          //indicatorColor="primary"
          classes={{indicator: classes.indicator}}
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable tab"
        >
          {itemList.map((item, index) => {
            return <Tab key={index} label={item.label} {...makeTabId(index)} />;
          })}
        </Tabs>
      </AppBar>
      {showContentBetweenTabAndPanel && contentBetweenTabAndPanel}
      <SwipeableViews
        resistance
        index={value}
        onChangeIndex={handleChangeIndex}
        enableMouseEvents
      >
        {itemList.map((item, index) => {
          return (
            <TabPanel key={index} value={value} index={index}>
              {item.content}
            </TabPanel>
          );
        })}
      </SwipeableViews>
    </div>
  );
};

export default IxTab;
