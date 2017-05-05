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
        console.log('edges', cell.edges);
        cell.value.formula = value;
        cell.value.output = function_utils.make_named_args_function([], value)(inputs);
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

