// TODO: Do we trust the code we're running or not?

function make_function(parameter_names, body) {
  var for_apply = parameter_names.slice();
  for_apply.push(body);
  return Function.apply({}, for_apply)
}

var f = make_function(['a', 'b'], 'return a + b');
console.log('2+2', f(2, 2));
