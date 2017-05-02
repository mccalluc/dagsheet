// TODO: Do we trust the code we're running or not?

function make_function(parameter_names, body) {
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

var f = make_function(['greeting', 'name'], 'console.log("this", this); greeting + ", " + name + "!"');
console.log(f({greeting: 'hello', name: 'hello'}));
