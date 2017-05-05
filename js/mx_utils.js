define(['function_utils'],
  function (function_utils) {
    function get_label(cell) {
      var div = document.createElement('div');
      var label;
      if (cell.isVertex()) {
        label = cell.value.formula + ' → ' + cell.value.output;
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

    function value_for_cell_changed(cell, value) {
      var previous = cell.value;
      if (cell.isVertex()) {
        var inputs = {}; // TODO
        var edges = cell.edges;
        for (var i = 0; i < edges.length; i++) {
          var edge = edges[i];
          if (edge.source.id != cell.id) {
            inputs[edge.value.label] = edge.source.value.output;
          }
        }
        console.log('inputs', inputs);
        cell.value.formula = value;
        var named_args_function = function_utils.make_named_args_function(Object.keys(inputs), value);
        cell.value.output = named_args_function(inputs);
      } else if (cell.isEdge()) {
        cell.value.label = value;
      }
      return previous;
    }

    return {
      get_label: get_label,
      get_editing_value: get_editing_value,
      value_for_cell_changed: value_for_cell_changed
    }
  }
);

