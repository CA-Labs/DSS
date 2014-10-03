/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('taController', ['$rootScope', '$scope', 'AssetsService', 'CloudService', 'localStorageService', '$timeout', function($rootScope, $scope, AssetsService, CloudService, localStorageService, $timeout){

    //Initialization

    $scope.criticityBoundModels = AssetsService.getCriticityBoundModels();
    localStorageService.bind($scope, 'criticityBoundModels', $scope.criticityBoundModels);

    $scope.taAssets = AssetsService.getTA();                            // The list of TA assets read from the cloud services descriptor xml file
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
        // This timeout seems to be necessary, otherwise slider models are not updated on time
        $timeout(function(){
            $rootScope.$broadcast('acceptabilityValueChanged');
        }, 100);
    });

}]);