import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import Graph from "./vis-network";
import Details from "./details";
import Menu from './menu'
import { g } from '../gremlin/connection';
import {mapToJson} from '../gremlin/utils'

const gremlin = require('gremlin');
const { within } = gremlin.process.P;
const { out, outE, inV, in_, inE, coalesce, constant, project } = gremlin.process.statics;

const stringToMultiLine = (str, maxLength) => {
  let multiArr = [];
  const sentenceArr = str.split(' ');
  if (sentenceArr.length > 0) {
    let count = 0;
    multiArr.push([sentenceArr.shift()]);
    sentenceArr.forEach(word => {
      if (multiArr[count].join(' ').concat(word).length > maxLength) {
        count = count + 1;
        multiArr[count] = [word];
      } else {
        multiArr[count].push(word);
      }
    })
    multiArr = multiArr.map(line => line.join(' '));
  }
  return multiArr.join('\n');
}

const setIdAsKey = (arr) => {
  const lookup = {};
  arr.forEach(item => {
    lookup[item.id] = item;
  })
  return lookup;
}

const getNodes = () => {
  return g
  .V('a1cbb927-f960-4ee4-bfe3-1d11325825f2')
  // .V().hasLabel('Systems')
  .not(inE())
  .emit()
  .repeat(out()).until(outE().count().is(0))
  .elementMap()
  .toList()
  .then(res => res.map(mapToJson))
}

const getEdges = (nodeIds) => {
  return g.V().hasId(within(nodeIds)).outE().where(inV().hasId(within(nodeIds))).elementMap().toList()
  .then(res => res.map(mapToJson))
}

const options = {
  nodes: {
    fixed: {
      x: false,
      y: false
    },
    shape: "dot",
    size: 20,
    borderWidth: 1.5,
    borderWidthSelected: 2,
    font: {
      size: 15,
      align: "center",
      bold: {
        color: "#bbbdc0",
        size: 15,
        vadjust: 0,
        mod: "bold"
      }
    }
  },
  edges: {
    width: 0.01,
    color: {
      color: "#D3D3D3",
      highlight: "#797979",
      hover: "#797979",
      opacity: 1.0
    },
    font: {
      align: 'middle',
    },
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" },
    },
    smooth: {
      type: "continuous",
      roundness: 0
    }
  },
  physics: { // https://visjs.github.io/vis-network/docs/network/physics.html
    enabled: true,
    solver: "barnesHut", // barnesHut, repulsion, hierarchicalRepulsion, forceAtlas2Based
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    stabilization: { iterations: 2500 }
  },
  layout: {
    hierarchical: {
      enabled: false,
      levelSeparation: 200,
      nodeSpacing: 100,
      treeSpacing: 200,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'LR',        // UD, DU, LR, RL
      sortMethod: 'directed',  // hubsize, directed
      shakeTowards: 'roots'  // roots, leaves
    }
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: true,
    selectable: true,
    selectConnectedEdges: true,
    zoomView: true,
    dragView: true
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height:"100vh", 
    width:"100wh"
  },
  details: {
    position: 'absolute',
    top: '100px',
    left: '100px',
    height: '80vh',
    width: '300px'
  }
}));

const Main = () => {
  console.log('render...')
  const classes = useStyles();

  const [data, setData] = useState({});
  const [graphData, setGraphData] = useState({nodes: [], edges: []})
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null)

  const onSelect = ({nodes, edges}) => {
    if (nodes.length === 1) {
      const [selectedItemId] = nodes;
      setSelectedItemId(selectedItemId)
      setShowDetails(true);
    } else if (edges.length === 1) {
      const [selectedItemId] = edges;
      setSelectedItemId(selectedItemId)
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
    return;
  }

  const events = {
    select: onSelect
  }
  
  useEffect(() => {
    console.log('useEffect().....')
    const getData = async () => {
      const nodes = await getNodes();
      // console.log('nodes ->', nodes)
      const nodeIds = nodes.map(node => node.id)
      const edges = await getEdges(nodeIds)
      // console.log('edges ->', edges)
      const nodesLookup = setIdAsKey(nodes)
      const edgesLookup = setIdAsKey(edges)
      setData({...nodesLookup, ...edgesLookup});
      const graphNodes = nodes.map(({id, name}) => ({id, label: stringToMultiLine(name, 25)}))
      const graphEdges = edges.map(({id, label, IN, OUT }) => ({id, from: OUT.id, to: IN.id}))
      setGraphData({nodes: graphNodes, edges: graphEdges})
    }
    getData();
  },[]);

  return (
    <div className={classes.root}>
      <Graph data={graphData} options={options} events={events}/>
      <Menu />
      <Box
        p={2}
        position="absolute"
        top={100}
        left="2%"
      >
        <Details show={showDetails} item={selectedItemId ? data[selectedItemId]: {}} className={classes.details}/>
      </Box>
    </div>
    )
}

export default Main;