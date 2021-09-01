import React, { useState } from 'react';
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
  },
  expansionSummaryContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  expandIcon: {
    marginRight: -theme.spacing(1),
  },
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
  },
  expansionPaneDetails: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));
// parameters items[]
// id, name, subTitle, subTitleColor, content

const IxExpansionPanel = ({ items }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div className={classes.root}>
      {items.map((item) => (
        <Accordion
          key={item.id}
          classes={{ root: classes.expansionPanelRoot }}
          expanded={expanded === item.id}
          onChange={handleChange(item.id)}
        >
          <AccordionSummary
            classes={{
              root: classes.expansionPanelSummaryRoot,
              content: classes.expansionSummaryContent,
              expandIcon: classes.expandIcon,
            }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-content-${item.id}`}
            id={`panel-content-header-${item.id}`}
          >
            <Typography variant="h6" color="textPrimary" className={classes.heading}>
              {item.name}
            </Typography>
            <Typography className={classes.secondaryHeading} color={item.subTitleColor || 'textSecondary'}>
              {item.subTitle}
            </Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.expansionPaneDetails }}>{item.content}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default IxExpansionPanel;
