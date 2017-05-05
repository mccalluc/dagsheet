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
          var v1 = graph.insertVertex(parent, null, {formula: '2+2'}, 20, 20, 80, 30);
          var v2 = graph.insertVertex(parent, null, {formula: '"hello"'}, 200, 150, 80, 30);
          var e1 = graph.insertEdge(parent, null, {label: 'parent'}, v1, v2);
        } finally {
          model.endUpdate();
        }

        graph_utils.update_graph(graph);
      }
    }
  }
);