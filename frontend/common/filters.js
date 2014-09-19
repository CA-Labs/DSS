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

dssApp.filter('multicloudReplication', function () {
    return function (input, isMulticloudDeployment) {
        var newInput = [];
        console.log('filter called');
        if (isMulticloudDeployment) {
            return input;
        }
        _.each(input, function (deployment) {
            var numberOfTaAssets = deployment.length - 1;

            var haveTheSameProvider = false;
            for (var i = 0; i < numberOfTaAssets; i++) {
                haveTheSameProvider = deployment[i].provider._id == deployment[i++].provider._id;
            }

            if (haveTheSameProvider) newInput.push(deployment);
        });

        return newInput;
    }
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

dssApp.filter('byCloudAndServiceTypes', ['TreatmentsService', function(TreatmentsService){
    return function(items, cloudType, serviceType){
        var newArray = [];
        _.each(items, function (item) {
            if (_.contains(TreatmentsService.getTreatmentsConnectedToCloudAndServiceTypes(cloudType, serviceType), item.treatment.name)) {
                newArray.push(item);
            }
        });
        return newArray;
    }
}]);

