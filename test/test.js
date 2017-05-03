define(['function_utils'], function (function_utils) {

  describe('dagsheet', function () {
    beforeEach(function () {

    });

    describe('function_utils', function() {
      describe('positional_args', function () {
        it('works', function () {
          var f_positional = function_utils.make_positional_args_function(
              ['greeting', 'name'],
              'console.log("positional?"); greeting + ", " + name + "!"'
          );
          expect(f_positional('hello', 'world')).toEqual('hello, world!');
        })
      });

      describe('positional_args', function () {
        it('works', function () {
          var f_named = function_utils.make_named_args_function(
              ['greeting', 'name'],
              'console.log("named?"); greeting + ", " + name + "!"'
          );
          expect(f_named({greeting: 'hello', name: 'world'})).toEqual('hello, world!');
        })
      });
    });

  });
});