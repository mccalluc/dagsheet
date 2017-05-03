define([],
  function () {
    return function() {
      /**
       * Given an mxGraph, returns a list of mxVertices in topological order.
       * @param graph
       */
      function topological_order(graph) {

      }

      /**
       * Reduces an mxGraph to a hash of vertex IDs -> List of source vertex IDs.
       * @param graph
       */
      function simplify_graph(graph) {
        var hash = {};
        var cells = graph.model.cells;
        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          if (cell.isVertex()) {
            id = cell.id;
            cell_sources = [];
            var all_edges = cell.edges;
            for (var j = 0; j < all_edges.length; j++) {
              var edge = edges[j];
              var source_id = edge.source.id;
              if (source_id != id) {
                cell_sources.push(source_id);
              }
            }
            hash[id] = cell_sources;
          }
        }
        return hash;
      }
    }
  }
);