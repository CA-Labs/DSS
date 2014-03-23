// Requirements interfaces
dssApp.directive('reqInput', function() {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element) {
            var attributes, placeholder, type;
            attributes = scope.$eval("{" + scope.item.attributes + "}");
            placeholder = attributes.placeholder || "";
            type = attributes.type || "text";
            element.html('<label for="' + scope.item.name + '">' + scope.item.name + ' <span data-tooltip class="has-tip tip-top" title="' + scope.item.definition + '"><i class="fi-lightbulb"></i></span></label><input name="' + scope.item.linkName + '" type="' + type + '" class="large-12 columns query" placeholder="' + placeholder + '">');
            return element.bind('change', function() {
                return scope.change();
            });
        }
    };
});

dssApp.directive('reqRadio', function() {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element) {
            var attributes;
            attributes = scope.$eval("{" + scope.item.attributes + "}");
            element.html('<label for="' + scope.item.name + '">' + scope.item.name + ' <span data-tooltip class="has-tip tip-top" title="' + scope.item.definition + '"><i class="fi-lightbulb"></i></span></label><div class="switch small radius\
      query" name="' + scope.item.linkName + '"><input id="0" name="' + scope.item.name + '" type="radio" checked><label for="z" onclick="">' + attributes[0] + '</label><input id="1" name="' + scope.item.name + '" type="radio"><label for="z1" onclick="">' + attributes[1] + '</label><span></span></div>');
            return element.bind('click', function() {
                return scope.change();
            });
        }
    };
});

dssApp.directive('reqSelect', function() {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element) {
            var attributes, options;
            attributes = scope.$eval("{" + scope.item.attributes + "}");
            options = '<option value="none">-- select --</option>';
            angular.forEach(attributes, function(value, key) {
                options = options + '<option value="' + key + '">' + value + '</option>';
            });
            element.html('<label for="' + scope.item.name + '">' + scope.item.name + ' <span data-tooltip class="has-tip tip-top" title="' + scope.item.definition + '"><i class="fi-lightbulb"></i></span></label><select name="' + scope.item.linkName + '" class="query">' + options + '</select>');
            return element.bind('change', function() {
                return scope.change();
            });
        }
    };
});

dssApp.directive('reqSlider', function() { // TODO: change that to ngSlider
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element) {
            var attributes;
            attributes = scope.$eval("{" + scope.item.attributes + "}");
            element.html('\
        <label style="margin-bottom: 5px;">' + scope.item.name + '<span data-tooltip class="has-tip tip-top" title="' + scope.item.definition + '">\
        <i class="fi-lightbulb"></i></span></label>\
        <span class="label secondary radius right requirementValue">-</span>\
        <div style="width: 80%; margin-bottom: 15px;" class="noUiSlider"></div>\
      ');
            return element.find("div.noUiSlider").noUiSlider({
                range: attributes.range || [0, 100],
                start: attributes.start || 0,
                step: attributes.step || 1,
                handles: attributes.handles || 1,
                slide: function() {
                    return $(this).prev("span.requirementValue").text($(this).val());
                }
            });
        }
    };
});