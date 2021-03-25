import React, { useState, useEffect } from "react";
import Graph from "./vis-network";
import { g } from '../gremlin';

const gremlin = require('gremlin');
const { within } = gremlin.process.P;
const { out, outE, inV, in_, inE, coalesce, constant, project } = gremlin.process.statics;

const mapToJson = (map) => {
  const properties = {};
  map.forEach((item, key) => {
    if (typeof key === 'object') {
      if (item instanceof Map) {
        properties[key.elementName] = mapToJson(item)
      } else {
        properties[key.elementName] = item;
      }
    } else {
      const value =
        typeof item === 'string' || typeof item === 'number' ? item : item;
      properties[key] = value;
    }
  });
  return properties;
};

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
        multiArr[count].push(word);§
      }
    })
    multiArr = multiArr.map(line => line.join(' '));
  }
  return multiArr.join('\n');
}

const getNodes = () => {
  console.log('getting nodes...')
  return g
  .V('c8d56a47-063a-46a9-a664-4df2d350a992')
  // .hasLabel('Systems')
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
    enabled: false,
    solver: "barnesHut", // barnesHut, repulsion, hierarchicalRepulsion, forceAtlas2Based
    barnesHut: {
      gravitationalConstant: -1000,
      centralGravity: 10,
      springLength: 70,
      avoidOverlap: 1
    },
    stabilization: { iterations: 2500 }
  },
  layout: {
    hierarchical: {
      enabled: true,
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

const Main = () => {
  const [data, setData] = useState({nodes: [], edges: []});
  const [graphData, setGraphData] = useState({nodes: [], edges: []})
  
  useEffect(() => {
    console.log('useEffect().....')
    const getData = async () => {
      const nodes = await getNodes();
      // console.log('nodes ->', nodes)
      const nodeIds = nodes.map(node => node.id)
      const edges = await getEdges(nodeIds)
      // console.log('edges ->', edges)
      setData({nodes, edges});
      const graphNodes = nodes.map(({id, name}) => ({id, label: stringToMultiLine(name, 25)}))
      const graphEdges = edges.map(({id, label, IN, OUT }) => ({id, from: OUT.id, to: IN.id}))
      setGraphData({nodes: graphNodes, edges: graphEdges})
    }
    getData();
  },[]);
  

  return (
    <div style={{height:"100vh", width:"100%"}}>
      <Graph data={graphData} options={options}/>
    </div>
    )
}

export default Main;