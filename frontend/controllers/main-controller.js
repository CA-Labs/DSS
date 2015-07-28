/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('mainController', ['$scope', '$rootScope', '$upload', 'flash', '$http', '$q', 'localStorageService', 'AssetsService', 'RisksService', 'TreatmentsService', 'CloudService', 'ArangoDBService', '$timeout', 'ngDialog'
    , function($scope, $rootScope, $upload, flash, $http, $q, localStorageService, AssetsService, RisksService, TreatmentsService, CloudService, ArangoDBService, $timeout, ngDialog){

    //Initialization

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

    // Initial data fetch: available cloud service names
    ArangoDBService.getServicesWithProviders(function(error, data){
        if (error) {
            flash.error = 'Some error occurred while trying to fetch the list of service names'
        } else {
            $scope.services = data;
            $scope.selectedService = {};
        }
    });

    $scope.$watch(function(){
        return $scope.selectedService;
    }, function(newService, oldService){
        console.log(newService);
        if (typeof newService !== 'undefined' && newService !== null && !_.isEmpty(newService)){
            ngDialog.open({
                template: 'partials/service.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }
    });

    /**
     * Clear local storage and reload the window
     */
    $scope.clearSelection = function () {
        localStorageService.clearAll();
        window.location.reload();
    };

    /**
     * Saves the current user session (local storage values) on a file.
     * @param event
     */
    $scope.saveSessionFile = function (event) {
        var element = angular.element(event.target);

        var localStorageContent = {};
        var localStorageKeys = localStorageService.keys();
        _.each(localStorageKeys, function (key) {
            localStorageContent[key] = localStorageService.get(key);
        });

        element.attr({
            download: 'DSS_Session.json',
            href: 'data:application/json;charset=utf-8,' + encodeURI(JSON.stringify(localStorageContent)),
            target: '_blank'
        });
    };

    $scope.uploadSessionFile = function () {
        $('#uploadSessionFile').trigger('click');
    };

    //Force file upload dialog showing on input fields of type file
    $scope.showFileUploadDialog = function(inputId){
        $(inputId).trigger('click');
    };

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
                                    //if(resource.hasOwnProperty('cloudResource')){
                                    //    resource.cloudType = 'IaaS';
                                    //}
                                    //// PaaS
                                    //else if(resource.hasOwnProperty('cloudPlatform')){
                                    //    resource.cloudType = 'PaaS';
                                    //}
                                    AssetsService.addTA(resource);
                                });
                            } else if(_.isObject(resources)){
                                // IaaS
                                //if(resources.hasOwnProperty('cloudResource')){
                                //    resources.cloudType = 'IaaS';
                                //}
                                //// PaaS
                                //else if(resources.hasOwnProperty('cloudPlatform')){
                                //    resources.cloudType = 'PaaS';
                                //}
                                AssetsService.addTA(resources);
                            }
                            $rootScope.$broadcast('loadedTA');
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

    /************************ USER SESSION FILE UPLOAD ***********************
     *************************************************************************
     ************************************************************************/

    $scope.onSessionFileSelect = function($files){
        var file = $files[0];
        $scope.xmlTaAssetsFileName = file.name;
        if(file !== null && typeof file !== 'undefined'){
            readFile(file).then(function(jsonString){
                var localStorageValues = JSON.parse(jsonString);
                // Don't touch this, order matters!
                AssetsService.loadingLocalStorageData(true);
                RisksService.loadingLocalStorageData(true);
                TreatmentsService.loadingTreatmentsFromLocalStorage(true);
                TreatmentsService.loadingTreatmentsValuesFromLocalStorage(true);
                AssetsService.setBSOIA(localStorageValues.bsoiaAssetsSelected);
                AssetsService.setTOIA(localStorageValues.toiaAssetsSelected);
                AssetsService.setXmlTaObject(localStorageValues.xmlAsJsonObject);
                RisksService.setSimpleRisksLikelihoodConsequence(localStorageValues.simpleRisksLikelihoodConsequence);
                RisksService.setRiskBoundModels(localStorageValues.riskBoundModels);
                RisksService.setSpecifiyLikelihoods(localStorageValues.specifyLikelihoods);
                RisksService.setSpecifiyTALikelihoods(localStorageValues.specifyTALikelihoods);
                RisksService.setMultipleRisksLikelihoodConsequence(localStorageValues.multipleRisksLikelihoodConsequence);
                RisksService.setRisks(localStorageValues.risksSelected);
                AssetsService.setCriticityBoundModels(localStorageValues.criticityBoundModels);
                AssetsService.setTA(localStorageValues.taAssets);

                // Delay treatments initialization, otherwise selected treatments values are overwritten because other
                // AngularJS are triggering updates.
                $timeout(function(){
                    TreatmentsService.setTreatmentValues(localStorageValues.treatmentValues);
                    TreatmentsService.setTreatments(localStorageValues.treatmentsSelected);
                    TreatmentsService.loadingTreatmentsFromLocalStorage(false);
                    TreatmentsService.loadingTreatmentsValuesFromLocalStorage(false);
                    $rootScope.$broadcast('risksSelectedChanged');
                }, 1000);
            });
        } else {
            flash.error = 'Some error occured while trying to upload DSS session file';
        }
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

    /**
     * Saves the user services selection on a file.
     * @param event
     */
    $scope.saveCloudSelection = function (event) {
        var selectedServices = CloudService.getServicesSelected();
        if(!selectedServices || typeof selectedServices === 'undefined' || selectedServices.length == 0){
            flash.error = 'No cloud services were selected, nothing to export.'
            return;
        } else {
            // Remove cloudType property added by the app from TA assets
            // angular.toJson call is required to remove $$_ internal properties
            var copy = _.clone(JSON.parse(angular.toJson(AssetsService.getXmlTaObject())));
            if(_.isArray(copy.resourceModelExtension.resourceContainer)){
                _.each(copy.resourceModelExtension.resourceContainer, function(resourceContainer, index){
                    delete copy.resourceModelExtension.resourceContainer[index]['cloudType'];
                });
            } else if(_.isObject(copy.resourceModelExtension.resourceContainer)){
                delete copy.resourceModelExtension.resourceContainer['cloudType'];
            }

            var element = angular.element(event.target);
            // Set export file name
            var fileName = 'DSS_CloudServicesSelection.xml';
            element.attr({
                download: fileName,
                href: 'data:application/xml;charset=utf-8,' + decodeURI(x2js.json2xml_str(copy)),
                target: '_blank'
            });
        }
    };

    /************************ DSS GRAPH WITH SELECTION ***********************
     *************************************************************************
     ************************************************************************/
    $scope.showDSSGraph = function() {
        ngDialog.open({
            template: 'partials/dss-graph.html',
            className: 'ngdialog-theme-default'
        });
    };

    //---------------------------------
    // what follows is a set of counters which check if the steps have been fulfilled by the
    // actor or not. should be fairly self explanatory

    $scope.haveBSOIASelected = function () {
        return AssetsService.countBSOIASelected() > 0;
    };

    $scope.haveTOIASelected = function () {
        return AssetsService.countTOIASelected() > 0;
    };

    $scope.isTALoaded = function () {
        return AssetsService.countTALoaded() > 0;
    };

    $scope.haveRisksSelected = function () {
        return RisksService.countRisksSelected() > 0;
    };

    $scope.haveTreatmentsSelected = function () {
        return TreatmentsService.countTreatmentsSelected() > 0;
    };


    // skipBsoia status
    $scope.isSkipBsoia = function () {
       return AssetsService.getSkipBsoia();
    };

    // skip Toia status
    $scope.isSkipToia = function () {
        return AssetsService.getSkipToia();
    };
}]);
