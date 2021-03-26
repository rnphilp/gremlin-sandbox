import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    'align-items': 'center'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  icon: {
    width: 50
  },
}));

const LabelSummary = (props) => {
  const classes = useStyles();
  
  const {name, count} = props;

  return (
    <Card className={classes.root} square>
      <BubbleChartIcon
        className={classes.icon}
        fontSize={'large'}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="h6">
            {name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            ?? / {count} vertices
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}
export default LabelSummary;