define(['function_utils', 'graph_utils'],
  function (function_utils, graph_utils) {
    function get_label(cell) {
      var div = document.createElement('div');
      var label;
      if (cell.isVertex()) {
        var output_display;
        if (typeof cell.value.output == 'function') {
          output_display = 'f()';
        } else if (typeof cell.value.output == 'number') {
          output_display = Math.round(1000 * cell.value.output)/1000; // TODO: define number formatting in front matter
        } else {
          output_display = cell.value.output;
        }
        label = String(cell.value.formula);
        if (! label.match(/^\s*[a-zA-Z]\w*\s*=[^=]/)) {
           // If not a constant definition:
          label += ' → ' + output_display;
        }
      } else if (cell.isEdge()) {
        label = cell.value.label;
      }
      mxUtils.write(div, label);
      return div;
    }

    function get_editing_value(cell, event) {
      if (cell.isVertex()) {
        return cell.value.formula;
      } else if (cell.isEdge()) {
        return cell.value.label;
      }
    }

    var globals = {};

    function make_download_handler(graph) {
      return function () {
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

        var xml = new mxCodec().encode(model);
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
      }
    }

    function value_for_cell_changed(cell, value) {
      var previous = cell.value;
      if (cell.isVertex()) {
        var inputs = {};
        // Set global inputs:
        for (var key in globals) {
          inputs[key] = globals[key];
        }
        // Set the local inputs:
        var edges = cell.edges || [];
        for (var i = 0; i < edges.length; i++) {
          var edge = edges[i];
          if (edge.source.id != cell.id) {
            inputs[edge.value.label] = edge.source.value.output;
          }
        }
        cell.value.formula = value;
        var assign_global = String(value).match(/^\s*\w+\s*=\b/);
        if (assign_global) {
          // TODO: Not intending to have inputs to globals right now, but...
          globals[assign_global[1]] =
              function_utils.make_named_args_function(Object.keys(inputs), assign_global[2]);
          cell.value.output = 'GLOBAL'; // TODO
        } else {
          var named_args_function =
              function_utils.make_named_args_function(Object.keys(inputs), value);
          cell.value.output = named_args_function(inputs);
        }
      } else if (cell.isEdge()) {
        cell.value.label = value;
      }
      if (cell.graph) {
        graph_utils.update_next_cell(cell.graph, cell);
      }
      return previous;
    }

    function decode(graph, filename) {
      var input_xml = mxUtils.load(filename).getDocumentElement();
      var xsl = mxUtils.load('xsl/dagsheet-to-mxgraph.xsl').getDocumentElement();
      var processor = new XSLTProcessor();
      processor.importStylesheet(xsl);
      var root = processor.transformToDocument(input_xml).documentElement;

      console.log(root);
      var codec = new mxCodec(root.ownerDocument);
      codec.decode(root, graph.getModel());
    }

    function encode(graph) {
      var codec = new mxCodec();
      return codec.encode(graph.getModel());

    }

    return {
      get_label: get_label,
      get_editing_value: get_editing_value,
      value_for_cell_changed: value_for_cell_changed,
      decode: decode,
      encode: encode,
      make_download_handler: make_download_handler
    }
  }
);

