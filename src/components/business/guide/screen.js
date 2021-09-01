import React from 'react';
import { makeStyles, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  guideImage: {
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(3),
  },
  title: {
    margin: '1rem 0',
  },
  description: {
    color: theme.palette.text.commonSecondaryColor,
  },
}));
const Screen = ({ image, title, description }) => {
  const classes = useStyles();
  return (
    <Grid container justify="center">
      <Grid container justify="center" alignItems="center" direction="column">
        <Grid item xs={8}>
          <img className={classes.guideImage} src={image} alt="nxt-guide-visual" />
        </Grid>
      </Grid>
      <Grid container justify="center" alignItems="center" direction="column">
        <Grid item xs={10}>
          <Typography className={classes.title} variant="h4" align="center">
            {title}
          </Typography>
          <Typography className={classes.description} variant="caption" align="center" display="block">
            {description}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Screen;
