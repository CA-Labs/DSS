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
            element.html('<label>' + scope.item.name + '</label><label class="switch-light well" onclick=""><input type="checkbox"/><span><span>' + attributes[0] + '</span><span>' + attributes[1] + '</span></span><a class="btn btn-success"></a></label>');
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
            element.html('<label for="' + scope.item.name + '">' + scope.item.name + ' <span data-tooltip class="has-tip tip-top" title="' + scope.item.definition + '"><i class="fi-lightbulb"></i></span></label><select name="' + scope.item.linkName + '" class="query form-control form">' + options + '</select>');
            return element.bind('change', function() {
                return scope.change();
            });
        }
    };
});

dssApp.directive('reqSlider', function() {
    return {
        restrict: 'E',
        replace: true,
        link: function(scope, element) {
            var attributes;
            attributes = scope.$eval("{" + scope.item.attributes + "}");
            element.html('\
        <label style="margin-bottom: 5px;" class="def-tip" data-container="body" data-toggle="popover" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">' + scope.item.name + '<span title="' + scope.item.definition + '" \
        <i class="fi-lightbulb"></i></span></label>\
        <span class="label secondary radius right requirementValue">-</span>\
        <div class="row"><div class="col-lg-6"><small>Likelihood: </small><div style="width: 80%; margin-bottom: 15px;" class="noUiSlider"></div></div><div class="col-lg-6"><small>Consequence :</small><div style="width: 80%; margin-bottom: 15px;" class="noUiSlider"></div></div></div>\
      ');
            $(".def-tip").popover({
                toggle: 'hover'
            });
            return element.find("div.noUiSlider").noUiSlider({
                range: { min: 0, max: 10 },
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