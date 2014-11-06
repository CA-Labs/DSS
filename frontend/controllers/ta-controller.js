/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('taController', ['$rootScope', '$scope', 'AssetsService', 'CloudService', 'localStorageService', 'TreatmentsService', '$timeout', function($rootScope, $scope, AssetsService, CloudService, localStorageService, TreatmentsService, $timeout){

    //Initialization

    $scope.criticityBoundModels = AssetsService.getCriticityBoundModels();
    localStorageService.bind($scope, 'criticityBoundModels', $scope.criticityBoundModels);

    $scope.taAssets = AssetsService.getTA();                            // The list of TA assets read from the cloud
                                                                        // services descriptor xml file
    localStorageService.bind($scope, 'taAssets', $scope.taAssets);      // Bind the taAssets to localStorage

    $scope.isMulticloudDeployment = AssetsService.getDeploymentType();
    localStorageService.bind($scope, 'isMulticloudDeployment', $scope.isMulticloudDeployment);

    $scope.setDeploymentType = function () {
        AssetsService.setDeploymentType();
    };

    /**
     * Removes a TA asset from the list of assets selected
     * by the user, by calling the Assets service.
     * @param taAsset The TA asset to be removed.
     */
    $scope.removeTaAsset = function(taAsset){
        AssetsService.removeTA(taAsset);
        $rootScope.$broadcast('removeProposalsForTAAsset', taAsset._id);
    };

    $scope.getValueDescription = function (value) {
        var descriptions = [
            'All risks are unacceptable on your asset. Your asset is very important.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 3.4 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 5.8 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 8.2 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 10.6 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 13 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 15.4 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 17.8 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 20.2 are unacceptable.',
            'All risks with product of likelihood [range(1..5)] and consequence [range(1..5)]  greater than 22.6 are unacceptable.',
            'All risks are acceptable. Your asset has very high endurance.'
        ];
        return descriptions[Math.round(10-(10*(25-value)/(25-1)))];
    };

    /**
     * When a TA acceptability slider has moved, we have to recompute
     * related risks unacceptability.
     */
    $scope.$on('sliderValueChanged', function($event, element){
        /*
         * For some reason, the slider model isn't bound until the slider is moved.
         * This may cause unexpected errors, that's why we force it to be initialized.
         */
        if(element.init){
            AssetsService.setCriticityBoundModel(element.key, parseFloat(element.value));
        }
        if(!TreatmentsService.isLoadingTreatmentsFromLocalStorage() && !TreatmentsService.isLoadingTreatmentsValuesFromLocalStorage()){
            // This timeout seems to be necessary, otherwise slider models are not updated on time
            $timeout(function(){
                $rootScope.$broadcast('acceptabilityValueChanged');
            }, 100);
        }
    });

}]);