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

        var edge_style = graph.getStylesheet().getDefaultEdgeStyle();
        edge_style[mxConstants.STYLE_ROUNDED] = '1'; // STYLE_ROUNDED is another possibility.
        // TODO: I want to set an opaque background on the edge label:
        // This does not do it.
        //edge_style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#ffffff';

        new mxKeyHandler(graph);

        graph.getLabel = mx_utils.get_label;
        graph.getEditingValue = mx_utils.get_editing_value;

        document.getElementById('download').onclick = function() {
          // TODO: How do I move this event handler out and retain a reference to graph?
          var model = graph.getModel();
          model.beginUpdate();
          try {
            for (var k in model.cells) {
              var cell = model.cells[k];
              delete cell.graph; // The native serializer recurses infinitely if this is left in place.
            }
          } finally {
            model.endUpdate();
          }

          var xml = new mxCodec().encode(graph.getModel());
          var xml_string = new XMLSerializer().serializeToString(xml);

          var link = document.createElement('a');
          link.download = 'dagsheet.xml';
          link.href = 'data:text/plain,' + encodeURIComponent(xml_string);
          link.target = '_blank';
          document.body.appendChild(link); // Only needed by FF?
          link.click();
          document.body.removeChild(link);
          
          model.beginUpdate();
          try {
            for (var k in model.cells) {
              var cell = model.cells[k];
              cell.graph = graph; // Replace the property we removed above.
            }
          } finally {
            model.endUpdate();
          }
        };

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