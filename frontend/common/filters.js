// Main filters file
dssApp.filter('capitalize', function() {
    return function(input) {
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
});

dssApp.filter('replaceSpacesWithDash', function() {
    return function(input) {
        return input.replace(/\ /g, "_");
    };
});

dssApp.filter('replaceDotWithDash', function() {
    return function(input) {
        return input.replace(/\./g, "_");
    };
});

dssApp.filter('replaceDashWithSpace', function() {
    return function(input) {
        return input.replace(/_/g, " ");
    };
});

dssApp.filter('replaceDashWithDot', function() {
    return function(input) {
        return input.replace(/_/g, ".");
    };
});

dssApp.filter('unique', function() {
    return function(items, filterOn) {
        var extractValueToCompare, newItems;
        if (filterOn === false) {
            return items;
        }
        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            newItems = [];
            extractValueToCompare = function(item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };
            angular.forEach(items, function(item) {
                var _i, _len;
                var isDuplicate = false;
                for (_i = 0, _len = newItems.length; _i < _len; _i++) {
                    var newItem = newItems[_i];
                    if (angular.equals(extractValueToCompare(newItem), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }
                items = newItems;
            });
        }
        return items;
    };
});

