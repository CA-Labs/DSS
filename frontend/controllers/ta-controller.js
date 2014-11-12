/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('taController', ['$rootScope', '$scope', 'AssetsService', 'CloudService', 'localStorageService', 'TreatmentsService', '$timeout', 'flash', 'ArangoDBService', '$q', 'ngDialog', function($rootScope, $scope, AssetsService, CloudService, localStorageService, TreatmentsService, $timeout, flash, ArangoDBService, $q, ngDialog){

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

    //Force file upload dialog showing on input fields of type file
    $scope.showFileUploadDialog = function(inputId){
        $(inputId).trigger('click');
    };

    //File Reader object
    var fileReader = new FileReader();
    //XML parser
    var x2js = new X2JS();
    //Last requirements loaded (string XML)
    var lastRequirementsLoaded = "";
    $scope.xmlAsJsonObject = AssetsService.getXmlTaObject();
    localStorageService.bind($scope, 'xmlAsJsonObject', $scope.xmlAsJsonObject);

    // Save loaded XML file name for later reuse on export
    $scope.xmlTaAssetsFileName = "";
    localStorageService.bind($scope, 'xmlTaAssetsFileName', $scope.xmlTaAssetsFileName);

    /********************* DSS CLOUD RESOURCE FILE UPLOAD *******************
     *************************************************************************
     ************************************************************************/

    $scope.onDSSCloudResourceFileSelect = function($files){

        var file = $files[0];
        $scope.xmlTaAssetsFileName = file.name;
        if(file !== null && typeof file !== 'undefined'){
            readFile(file).then(function(xmlString){
                //Check if XML document is correct using the XSD schema validation service on server-side
                ArangoDBService.validateSchema(xmlString, function(error, data){
                    if(error){
                        flash.error = 'Some error occurred while trying to upload your requirements';
                    } else {
                        if(data.correct){

                            AssetsService.setXmlTaObject(x2js.xml_str2json(xmlString));
                            var resources = AssetsService.getXmlTaObject().resourceModelExtension.resourceContainer;

                            // Mind the hack! XML library used returns 'Object' type when only one element
                            // is retrieved from an XML sequence and 'Array' type when multiple elements
                            // are retrieved.
                            if(_.isArray(resources)){
                                _.each(resources, function(resource){
                                    // IaaS
                                    if(resource.hasOwnProperty('cloudResource')){
                                        resource.cloudType = 'IaaS';
                                    }
                                    // PaaS
                                    else if(resource.hasOwnProperty('cloudPlatform')){
                                        resource.cloudType = 'PaaS';
                                    }
                                    AssetsService.addTA(resource);
                                });
                            } else if(_.isObject(resources)){
                                // IaaS
                                if(resources.hasOwnProperty('cloudResource')){
                                    resources.cloudType = 'IaaS';
                                }
                                // PaaS
                                else if(resources.hasOwnProperty('cloudPlatform')){
                                    resources.cloudType = 'PaaS';
                                }
                                AssetsService.addTA(resources);
                            }
                            $rootScope.$broadcast('loadedTA');
                            ngDialog.open({
                                template: 'partials/assets/ta-confirm.html',
                                className: 'ngdialog-theme-default',
                                controller: ['$scope', function($scope){
                                    // Defines behaviour when user loaded TA assets and he is presented with a modal to confirm next step
                                    $scope.continue = function() {
                                        // Don't consider this as an error so that slide transition to next one takes place
                                        $scope.closeThisDialog();
                                    };
                                }]
                            });
                        } else {
                            flash.error = 'Some error occurred while trying to upload your requirements';
                        }
                    }
                });
            });
        } else {
            flash.error = 'Some error occurred while trying to upload your requirements';
        }

        // Mind the hack! Reset the form so that cloud descriptor files (same name, file, ...)
        // can be uploaded first (wrap the input element within a form element and reset the form)
        jQuery('#cloud-descriptor-file-selector').get(0).reset();

    };

    // Private function to read files as strings
    var readFile = function(file){
        var fileReader = new FileReader();
        var deferred = $q.defer();
        fileReader.readAsText(file);
        fileReader.onload = function(){
            deferred.resolve(fileReader.result);
        };
        return deferred.promise;
    };

}]);