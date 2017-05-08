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
          if (! document.location.search) {
            window.location.replace(window.location + '?hello-world');
            return;
          } else {
            var file_stem = document.location.search.slice(1);
            mx_utils.decode(graph, 'examples/' + file_stem + '.xml');
          }
        } finally {
          model.endUpdate();
        }
        graph_utils.update_graph(graph);
      }
    }
  }
);