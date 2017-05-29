define([],
  function () {
    /**
     * Reduces an mxGraph to a hash of vertex IDs -> List of source vertex IDs.
     * @param graph
     */
    function simplify_graph(graph) {
      var model = graph.model;
      var hash = {};
      var cells = model.getDescendants(model.getRoot());
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (cell.isVertex()) {
          id = cell.id;
          cell_sources = [];
          var all_edges = cell.edges || [];
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
     * Given a simple graph, return the vertices in topological order,
     * with unlinked vertices first.
     * TODO: Dependencies between globals?
     * @param simple_graph
     */
    function topological_order(simple_graph) {
      //console.log('at the beginning:', simple_graph);
      var no_sources = [];
      // Find all the nodes which are sources to anything:
      var all_sources = {};
      var key;
      for (key in simple_graph) {
        for (var i=0; i < simple_graph[key].length; i++) {
          var source = simple_graph[key][i];
          all_sources[source] = 1;
        }
      }
      // Remove nodes with no source links:
      for (key in simple_graph) {
        if (simple_graph[key].length == 0) {
          if (all_sources[key]) {
            no_sources.push(key);
          } else {
            // If it has no sources, AND is not itself a source,
            // then it should be a global definition, and should be handled first.
            no_sources.unshift(key);
          }
          delete simple_graph[key]
        }
      }
      //console.log('no_sources at the start:', no_sources);
      //console.log('after deleting some nodes:', simple_graph);
      // Remove links whose sources we just removed:
      for (key in simple_graph) {
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

    /**
     * Updates the next cell after the current_cell in topological order.
     * @param graph
     * @param current_cell
     */
    function update_next_cell(graph, current_cell) {
      var simple_graph = simplify_graph(graph);
      var in_order = topological_order(simple_graph);

      var model = graph.getModel();
      model.beginUpdate();
      try {
        var after_current = false;
        for (var i = 0; i < in_order.length; i++) {
          var cell = model.cells[in_order[i]];
          if (after_current) {
            model.setValue(cell, cell.value.formula);
            break;
          }
          if (cell === current_cell) {
            after_current = true;
          }
        }
      } finally {
        model.endUpdate();
      }
    }

    /**
     * Given an mxGraph, set the user values.
     * @param graph
     */
    function update_graph(graph) {
      var simple_graph = simplify_graph(graph);
      var in_order = topological_order(simple_graph);

      var model = graph.getModel();
      model.beginUpdate();
      try {
        for (var i = 0; i < in_order.length; i++) {
          var cell = model.cells[in_order[i]];
          model.setValue(cell, cell.value.formula);
          cell.graph = graph;
          // This is used by the value_for_cell_changed callback,
          // but it also causes infinite recursion if present during encoding.
          // TODO: Find something better?
        }
      } finally {
        model.endUpdate();
      }
    }

    return {
      update_graph: update_graph,
      update_next_cell: update_next_cell,

      // These are exported only for testing:
      topological_order: topological_order,
      simplify_graph: simplify_graph
    }
  }
);