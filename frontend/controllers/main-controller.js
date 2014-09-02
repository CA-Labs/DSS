/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('mainController', [
    '$scope'
    , '$upload'
    , 'flash'
    , '$http'
    , '$q'
    , 'localStorageService'
    , 'AssetsService'
    , 'RisksService'
    , 'TreatmentsService'
    , 'ArangoDBService'
    , function(
        $scope
        , $upload
        , flash
        , $http
        , $q
        , localStorageService
        , AssetsService
        , RisksService
        , TreatmentsService
        , ArangoDBService){

    //Initialization

    //File Reader object
    var fileReader = new FileReader();
    //XML parser
    var x2js = new X2JS();
    //Last requirements loaded (string XML)
    var lastRequirementsLoaded = "";

    /**
     * Clear local storage and reload the window
     */
    $scope.clearSelection = function () {
        localStorageService.clearAll();
        window.location.reload();
    };

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

    $scope.loadLocalSessionContent = function ($fileContent) {
        console.log($fileContent);
        if (dssApp.isJSON($fileContent)) {
            console.log('json');
            var fileContent = JSON.parse($fileContent);
            localStorageService.bsoiaAssetsSelected = fileContent.bsoiaAssetsSelected;
            localStorageService.toiaAssetsSelected = fileContent.toiaAssetsSelected;
            localStorageService.taAssets = fileContent.taAssets;
            localStorageService.risksSelected = fileContent.risksSelected;
            localStorageService.treatmentsSelected = fileContent.treatmentsSelected;
            //localStorageService.services = fileContent.services;
            //window.location.reload();
        }
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
        if(file !== null && typeof file !== 'undefined'){
            readFile(file).then(function(xmlString){
                //Check if XML document is correct using the XSD schema validation service on server-side
                ArangoDBService.validateSchema(xmlString, function(error, data){
                    if(error){
                        flash.error = 'Some error occurred while trying to upload your requirements';
                    } else {
                        if(data.correct){
                            var resources = x2js.xml_str2json(xmlString).resourceModelExtension.resourceContainer;
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
        if(file !== null && typeof file !== 'undefined'){
            readFile(file).then(function(jsonString){
                localStorageValues = JSON.parse(jsonString);
                // Don't touch this, order matters!
                AssetsService.loadingLocalStorageData(true);
                RisksService.loadingLocalStorageData(true);
                TreatmentsService.loadingTreatmentsFromLocalStorage(true);
                TreatmentsService.loadingTreatmentsValuesFromLocalStorage(true);
                AssetsService.setBSOIA(localStorageValues.bsoiaAssetsSelected);
                AssetsService.setTOIA(localStorageValues.toiaAssetsSelected);
                RisksService.setSimpleRisksLikelihoodConsequence(localStorageValues.simpleRisksLikelihoodConsequence);
                RisksService.setMultipleRisksLikelihoodConsequence(localStorageValues.multipleRisksLikelihoodConsequence);
                RisksService.setSimpleRisksLikelihoodConsequenceAcceptance(localStorageValues.simpleRisksLikelihoodConsequenceAcceptance);
                RisksService.setMultipleRisksLikelihoodConsequenceAcceptance(localStorageValues.multipleRisksLikelihoodConsequenceAcceptance);
                RisksService.setRisks(localStorageValues.risksSelected);
                TreatmentsService.setTreatmentValues(localStorageValues.treatmentValues);
                TreatmentsService.setTreatments(localStorageValues.treatmentsSelected);
                AssetsService.setTA(localStorageValues.taAssets);
            });
        } else {
            flash.error = 'Some error occured while trying to upload DSS session file';
        }
    };

    // Private function to read files as strings
    var readFile = function(file){
        var fileReader = new FileReader();
        var deferred = $q.defer();
        var string = fileReader.readAsText(file);
        fileReader.onload = function(){
            deferred.resolve(fileReader.result);
        };
        return deferred.promise;
    };

}]);
