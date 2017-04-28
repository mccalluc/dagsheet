function main(container) {
    if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
    } else {
        mxEvent.disableContextMenu(container);
        var graph = new mxGraph(container);
        new mxRubberband(graph);
        var parent = graph.getDefaultParent();
        graph.getModel().beginUpdate();
        try {
            var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
            var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
            var e1 = graph.insertEdge(parent, null, '', v1, v2);
        } finally {
            graph.getModel().endUpdate();
        }
    }
};