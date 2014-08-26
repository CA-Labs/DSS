/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('mainController', ['$scope', '$upload', 'flash', '$http', '$q', 'AssetsService', 'ArangoDBService', function($scope, $upload, flash, $http, $q, AssetsService, ArangoDBService){

    //Initialization

    //File Reader object
    var fileReader = new FileReader();
    //XML parser
    var x2js = new X2JS();
    //Last requirements loaded (string XML)
    var lastRequirementsLoaded = "";

    $scope.clearSelection = function () {
        $localStorage.bsoiaAssetsSelected = $rootScope.bsoiaAssetsSelected = [];
        $localStorage.toiaAssetsSelected = $rootScope.toiaAssetsSelected = [];
        $localStorage.risksSelected = $rootScope.risksSelected = [];
        $localStorage.treatmentsSelected = $rootScope.treatmentsSelected = [];
        // TODO: extend with cloud services selected
    };

    $scope.saveSessionFile = function (event) {
        var element = angular.element(event.target);

        element.attr({
            download: 'DSS_Session.json',
            href: 'data:application/json;charset=utf-8,' + encodeURI(JSON.stringify($localStorage)),
            target: '_blank'
        });
    };

    $scope.uploadSessionFile = function () {
        $('#uploadSessionFile').trigger('click');
    };

    $scope.loadLocalSessionContent = function ($fileContent) {
        if (dssApp.isJSON($fileContent)) {
            var fileContent = JSON.parse($fileContent);
            $localStorage.assetsSelected = $rootScope.assetsSelected = fileContent.assetsSelected;
            $localStorage.risksSelected = $rootScope.risksSelected = fileContent.risksSelected;
            $localStorage.requirementsSelected = $rootScope.requirementsSelected = fileContent.requirementsSelected;
            // TODO: extend with cloud services selected
        }
    };

    //Force file upload dialog showing on input fields of type file
    $scope.showFileUploadDialog = function(inputId){
        $(inputId).trigger('click');
    };

    /**************** FILE UPLOAD ***************
    *********************************************
    *********************************************/

    $scope.onFileSelect = function($files){

        var file = $files[0];
        if(file !== null && typeof file !== 'undefined'){
            AssetsService.loadResourcesFromXML(file).then(function(xmlString){
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

}]);
