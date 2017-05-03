(function () {
  // window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  //   alert(errorMsg
  //       + '\n\n' + url
  //       + ' (' + lineNumber + ':' + column + ')');
  // };

  requirejs.config({
    "baseUrl": "js"
  });

  require(['main', 'graph_utils', 'function_utils'], function (main, graph_utils, function_utils) {
    main(document.getElementById('container'))
  });
})();