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
        label = cell.value.formula + ' → ' + output_display;
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


      // var root = mxUtils.load(filename).getDocumentElement();
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
      encode: encode
    }
  }
);

