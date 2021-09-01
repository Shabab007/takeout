import React from 'react';
import clsx from 'clsx';
import { Box, makeStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IxButtonSuffix from './ix-button-suffix';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  iconOnlyRoot: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonRoot: {
    position: 'relative',
    justifyContent: 'left',
    marginBottom: theme.spacing(1),
    border: `2px solid ${theme.palette.border.main}`,
  },
  iconOnlyButtonRoot: {
    position: 'relative',
    justifyContent: 'left',
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    border: `2px solid ${theme.palette.border.main}`,
  },
  label: { textAlign: 'left', position: 'relative' },
  iconImg: {
    marginRight: '1em',
    marginTop: '0.8em',
    marginBottom: '0.8em',
  },
  selected: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  flagIcons: {
    height: 30,
    width: 30,
    margin: '0px 10px 0px 0px',
    padding: 0,
    '& img': {
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
    },
  },
  endIcon: {
    //color: theme.palette.primary.main,
    position: 'absolute',
    right: '0',
    top: theme.spacing(0.5),
  },
  iconOnlyEndIcon: {
    //color: theme.palette.primary.main,
    position: 'absolute',
    right: '-.5rem',
  },
}));

const IxIconButtonRadioGroup = (props) => {
  const {
    items,
    icons,
    selectedIndex,
    itemChange,
    fullWidth,
    iconOnly,
  } = props;
  const classes = useStyles();

  if (!items || !items.length || !icons) {
    return null;
  }

  return (
    <Box
      className={clsx(
        iconOnly && classes.iconOnlyRoot,
        !iconOnly && classes.root,
      )}
    >
      {items.map((item, index) => {
        return (
          <IxButtonSuffix
            classes={{
              root: iconOnly ? classes.iconOnlyButtonRoot : classes.buttonRoot,
              label: classes.label,
              startIcon: classes.flagIcons,
              endIcon: iconOnly ? classes.iconOnlyEndIcon : classes.endIcon,
            }}
            key={index + item.name}
            // eslint-disable-next-line eqeqeq
            className={selectedIndex == index ? classes.selected : ''}
            variant="outlined"
            fullWidth={fullWidth}
            startIcon={<img src={icons[item.icon]} alt="flag" />}
            // eslint-disable-next-line eqeqeq
            endIcon={selectedIndex == index ? <CheckCircleIcon /> : ''}
            onClick={() => itemChange(index)}
          >
            {iconOnly ? '' : item.name}
          </IxButtonSuffix>
        );
      })}
    </Box>
  );
};

export default IxIconButtonRadioGroup;
