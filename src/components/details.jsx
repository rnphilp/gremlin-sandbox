import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  paper: {
    overflow: 'auto',
    width: '300px'
  }
}));

const Details = (props) => {
  const classes = useStyles();

  const {item, show} = props;

  console.log('item <----', item)

  return show && (
    <div className={classes.root}>
      <Paper variant="outlined" className={classes.paper}>
          <Typography variant="h6">
            Details
          </Typography>
        {Object.entries(item).map(([name, value]) => {
          console.log(name)
          if (!['IN', 'OUT'].includes(name)) {
            return (
              <Typography variant="body2">
              {name} = {value}
            </Typography>
            )
          }
        })}
      </Paper>
    </div>
  )
}

export default Details;