// TODO: Do we trust the code we're running or not?

/**
 * Given the named parameters in order, and the text of a function,
 * adds a "return" if needed, and returns a Function object.
 *
 * @param parameter_names
 * @param body
 * @returns {Function}
 */
function make_positional_args_function(parameter_names, body) {
  var for_apply = parameter_names.slice(); // shallow copy
  var statements = body.split(';'); // TODO: actually parse the JS
  statements[statements.length-1] =
      'return ' + statements[statements.length-1];
  var mod_body = statements.join(';');
  for_apply.push(mod_body);
  return Function.apply(
      {}, // "this"
      for_apply
  )
}

/**
 * Given the named parameters, and the text of a function,
 * returns a function object which takes a single object argument.
 *
 * @param parameter_names
 * @param body
 */
function make_named_args_function(parameter_names, body) {
  name_of_single_arg = 'named_parameters';
  var statements = body.split(';');
  for (var i = 0; i < parameter_names.length; i++) {
    statements.unshift(
        'var '+parameter_names[i]+' = '+name_of_single_arg+'.'+parameter_names[i]);
  }
  return make_positional_args_function([name_of_single_arg], statements.join(';'))
}

// TESTING:

var f_positional = make_positional_args_function(
    ['greeting', 'name'],
    'console.log("positional?"); greeting + ", " + name + "!"'
);
console.log(f_positional('hello', 'world'));

var f_named = make_named_args_function(
    ['greeting', 'name'],
    'console.log("named?"); greeting + ", " + name + "!"'
);
console.log(f_named({greeting: 'hello', name: 'world'}));
