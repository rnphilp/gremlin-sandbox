import React, { useEffect, useRef } from 'react';
import PT from "prop-types";
import { DataSet } from "vis-data";
import { Network } from "vis-network";

const VisNetwork = (props) => {
  const {data: {nodes, edges}, options} = props;
  console.log('nodes =>', nodes)
  console.log('edges =>', edges)
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
    },
    [domNode, network, nodes, edges, options]
  );

  return (
    <div ref = { domNode } style={{ width: "100%", height: "100%" }} />
  );
};

VisNetwork.PT = {
  data: PT.shape({
    nodes: PT.array,
    edges: PT.array
  }),
  options: PT.object
}

export default VisNetwork;