import React, { useEffect, useRef } from 'react';
import PT from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import { DataSet } from "vis-data";
import { Network } from "vis-network";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    width: '100%',
    height: '100%',
  },
}));

const VisNetwork = (props) => {
  const classes = useStyles();

  const {data: {nodes, edges}, options, events = []} = props;
  // A reference to the div rendered by this component
  const domNode = useRef(null);

  // A reference to the vis network instance
  const network = useRef(null);

  useEffect(
    () => {
      const visNodes = new DataSet(nodes)
      const visEdges = new DataSet(edges)
      const visData = {
        nodes: visNodes,
        edges: visEdges
      };
      network.current = new Network(domNode.current, visData, options);
      Object.entries(events).forEach(([name, func]) => {
        network.current.on(name, func)
      });
    },
    [domNode, network, nodes, edges, options]
  );

  return (
    <div ref={domNode} className={classes.root}/>
  );
};

VisNetwork.PT = {
  data: PT.shape({
    nodes: PT.array,
    edges: PT.array
  }),
  options: PT.object,
  events: PT.array
}

export default VisNetwork;