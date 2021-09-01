import React from 'react';
import { makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  expansionPanelRoot: {
    border: '1px solid',
    borderColor: theme.palette.border.primary,
    borderRadius: theme.shape.borderRadiusPrimary,
    boxShadow: 'none',
    background: 'transparent',
    padding: 0,
    marginBottom: theme.spacing(0.5),
    '&::before': {
      height: 0,
    },
    '&.Mui-expanded': {
      margin: 0,
      marginBottom: theme.spacing(0.5),
    },
  },
  expansionPanelSummaryRoot: {
    flexDirection: 'row-reverse',
    paddingLeft: 0,
    alignItems: 'flex-start',
  },
  expansionSummaryContent: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    overflow: 'hidden',
  },
  expandIcon: {
    marginRight: -theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  heading: {
    width: '60%',
    flexShrink: 0,
    overflow: 'hidden',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },
  expansionPaneDetails: {
    padding: 0,
  },
  childrenWrapper: {
    width: '100%',
  },
}));

const IxCollapsePanel = ({
  id,
  name,
  subTitle,
  subTitleColor,
  defaultExpanded,
  expanded,
  onChange = () => {},
  children,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Accordion
        key={id}
        classes={{ root: classes.expansionPanelRoot }}
        expanded={expanded}
        onChange={onChange(id)}
        defaultExpanded={defaultExpanded}
      >
        <AccordionSummary
          classes={{
            root: classes.expansionPanelSummaryRoot,
            content: classes.expansionSummaryContent,
            expandIcon: classes.expandIcon,
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-content-${id}`}
          id={`panel-content-header-${id}`}
        >
          <Typography variant="h6" color="textPrimary" className={classes.heading}>
            {name}
          </Typography>
          <Typography className={classes.secondaryHeading} color={subTitleColor || 'textSecondary'}>
            {subTitle}
          </Typography>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.expansionPaneDetails }}>
          <div className={classes.childrenWrapper}>{children}</div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default IxCollapsePanel;
