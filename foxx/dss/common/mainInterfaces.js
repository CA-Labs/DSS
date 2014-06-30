/**
 Main interfaces file
**/

/**
 * Directive which reads file using local browser File Reader method
 */
dssApp.directive('onReadFile', ["$parse", function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };
                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
}]);

/**
 * Method to check if the string provided is valid JSON or not. At this point used when a session file is read
 * to the browser.
 * @param string
 * @returns {boolean}
 */
dssApp.isJSON = function (string) {
  if (typeof string == "string") {
      try {
          JSON.parse(string);
      } catch (ex) {
          return false;
      }
      return true;
  } else {
      return false;
  }
};