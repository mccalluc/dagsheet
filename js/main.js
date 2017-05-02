function main(container) {
  if (!mxClient.isBrowserSupported()) {
    mxUtils.error('Browser not supported', 200, false);
  } else {
    mxEvent.disableContextMenu(container);

    var graph = new mxGraph(container);
    graph.setHtmlLabels(true);
    graph.setAllowDanglingEdges(false);
    graph.setDisconnectOnMove(false);

    new mxKeyHandler(graph);
    new mxRubberband(graph);

    graph.getLabel = function(cell) {
      var div = document.createElement('div');
      var label;
      if (cell.isVertex()) {
        label = cell.value.output;
      } else if (cell.isEdge()) {
        label = cell.value.label;
      }
      mxUtils.write(div, label);
      return div;
    };

    graph.getEditingValue = function(cell, event) {
      if (cell.isVertex()) {
        return cell.value.formula;
      } else if (cell.isEdge()) {
        return cell.value.label;
      }
    };

    graph.getModel().valueForCellChanged = function(cell, value) {
      var previous = cell.value;
      if (cell.isVertex()) {
        cell.value.formula = value;
        cell.value.output = make_named_args_function([], cell.value.formula)({});
      } else if (cell.isEdge()) {
        cell.value.label = value;
      }
      return previous;
    };

    var parent = graph.getDefaultParent();
    graph.getModel().beginUpdate();
    try {
      var v1 = graph.insertVertex(parent, null, {formula: '2+2', output: '4'}, 20, 20, 80, 30);
      var v2 = graph.insertVertex(parent, null, {formula: '"hello"', output: 'hello'}, 200, 150, 80, 30);
      var e1 = graph.insertEdge(parent, null, {label: 'parent'}, v1, v2);
    } finally {
      graph.getModel().endUpdate();
    }
  }
};