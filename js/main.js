define(['graph_utils', 'mx_utils'],
  function (graph_utils, mx_utils) {
    return function (container) {
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser not supported', 200, false);
      } else {
        mxEvent.disableContextMenu(container);

        var graph = new mxGraph(container);
        graph.setHtmlLabels(true);
        graph.setAllowDanglingEdges(false);
        graph.setDisconnectOnMove(false);

        new mxKeyHandler(graph);

        graph.getLabel = mx_utils.get_label;
        graph.getEditingValue = mx_utils.get_editing_value;

        var model = graph.getModel();
        model.valueForCellChanged = mx_utils.value_for_cell_changed;

        var parent = graph.getDefaultParent();
        model.beginUpdate();
        try {
          var name = graph.insertVertex(parent, null, {formula: '"World"'}, 20, 20, 80, 30);
          var greet = graph.insertVertex(parent, null, {formula: 'function(name){return "Hello "+name+"!"}'}, 220, 20, 80, 30);

          var greet_name = graph.insertVertex(parent, null, {formula: 'greet(name)'}, 120, 120, 80, 30);
          
          var name_edge = graph.insertEdge(parent, null, {label: 'name'}, name, greet_name);
          var greet_edge = graph.insertEdge(parent, null, {label: 'greet'}, greet, greet_name);

        } finally {
          model.endUpdate();
        }

        graph_utils.update_graph(graph);
      }
    }
  }
);