define([],
  function () {
    /**
     * Reduces an mxGraph to a hash of vertex IDs -> List of source vertex IDs.
     * @param graph
     */
    function simplify_graph(graph) {
      var hash = {};
      var cells = graph.model.getDescendants(graph.model.getRoot());
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.isVertex()) {
          id = cell.id;
          cell_sources = [];
          var all_edges = cell.edges;
          for (var j = 0; j < all_edges.length; j++) {
            var edge = all_edges[j];
            var source_id = edge.source.id;
            if (source_id != id) {
              cell_sources.push(parseInt(source_id));
            }
          }
          hash[id] = cell_sources;
        }
      }
      return hash;
    }

    /**
     * Given a simple graph, return the vertices in topological order.
     * @param simple_graph
     */
    function topological_order(simple_graph) {
      //console.log('at the beginning:', simple_graph);
      var no_sources = [];
      // Remove nodes with no source links:
      for (var key in simple_graph) {
        if (simple_graph[key].length == 0) {
          no_sources.push(key);
          delete simple_graph[key]
        }
      }
      //console.log('no_sources at the start:', no_sources);
      //console.log('after deleting some nodes:', simple_graph);
      // Remove links whose sources we just removed:
      for (var key in simple_graph) {
        var remaining_links = [];
        var old_links = simple_graph[key];
        for (var i = 0; i < old_links.length; i++) {
          var old_link = old_links[i];
          if (simple_graph[old_link]) {
            remaining_links.push(old_link)
          }
        }
        simple_graph[key] = remaining_links;
      }
      //console.log('after deleting some links:', simple_graph);
      var next_in_list = [];
      if (Object.keys(simple_graph).length > 0) {
        next_in_list = topological_order(simple_graph)
      }
      //console.log('no_sources before:', no_sources);
      Array.prototype.push.apply(no_sources, next_in_list);
      //console.log('no_sources after:', no_sources);
      return no_sources
    }

    return {
      topological_order: topological_order,
      simplify_graph: simplify_graph
    }
  }
);