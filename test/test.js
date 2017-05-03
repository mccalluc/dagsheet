define(['function_utils', 'graph_utils'], function (function_utils, graph_utils) {

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

    // TODO
    // describe('graph_utils', function() {
    //   describe('simplify_graph', function() {
    //     it('works', function() {
    //       var container = document.createElement("div");
    //       var graph = new window.mxGraph(container);
    //       var parent = graph.getDefaultParent();
    //       graph.getModel().beginUpdate();
    //       try {
    //         var v1 = graph.insertVertex(parent, null, {formula: '2+2', output: '4'}, 20, 20, 80, 30);
    //         var v2 = graph.insertVertex(parent, null, {formula: '"hello"', output: 'hello'}, 200, 150, 80, 30);
    //         var e1 = graph.insertEdge(parent, null, {label: 'parent'}, v1, v2);
    //       } finally {
    //         graph.getModel().endUpdate();
    //       }
    //
    //       expect(graph_utils.simplify_graph(graph).toEqual({}));
    //     })
    //   })
    // });

  });
});