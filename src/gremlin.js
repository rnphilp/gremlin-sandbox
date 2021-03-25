const gremlin = require('gremlin');

const { Graph } = gremlin.structure;
const { DriverRemoteConnection } = gremlin.driver;

console.log('connecting to gremlin...');
const graph = new Graph();

const connection = new DriverRemoteConnection('ws://localhost:8182/gremlin', {
  // traversalSource: 'dev',
});

// const connection = new DriverRemoteConnection(
//   'wss://tf-20200719214926264000000002.cefajjdxqgrs.eu-west-1.neptune.amazonaws.com:8182/gremlin',
//   { mimeType: 'application/vnd.gremlin-v3.0+json' }
// );

export const g = graph.traversal().withRemote(connection);
