import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LabelSummary from './label-summary'
import { g } from '../gremlin/connection';
import {mapToJson} from '../gremlin/utils'

const gremlin = require('gremlin');
const { within } = gremlin.process.P;
const { out, outE, inV, in_, inE, coalesce, constant, project } = gremlin.process.statics;

const getLabelSummary = () => {
  return g
    .V()
    .label()
    .groupCount()
    .toList()
    .then(([res]) => mapToJson(res))
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    width: '300px',
    overflow: 'auto'
  }
}));

const Menu = () => {
  const classes = useStyles();
  
  const [labelSummary, setLabelSummary] = useState([])

  useEffect(() => {
    const setLabels = async () => {
      const summaryObj = await getLabelSummary();
      const summary = Object.entries(summaryObj).map(([key, value]) => {
        return {
          name: key,
          count: value
        }
      })
      setLabelSummary(summary)
    }
    setLabels();
  }, [])
  const summary = getLabelSummary();

  return (
    <div className={classes.root}>
      <Paper elevation={0} variant="outlined" square className={classes.paper}>
        <Paper elevation={0} variant="outlined" square>
          <Typography variant="h6" className={classes.title}>
            Vertex Summary
          </Typography>
        </Paper>
        {
          labelSummary.map(({name, count}) => (<LabelSummary name={name} count={count} key={name} />))
        }
      </Paper>
    </div>
  )
}

export default Menu;