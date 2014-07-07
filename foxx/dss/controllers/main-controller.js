/**
 * Created by Jordi Aranda.
 * 07/07/14
 * <jordi.aranda@bsc.es>
 */

//Access jQuery object from AngularJS controller
//var $jq = jQuery.noConflict();

dssApp.controller('mainController', ['$scope', '$upload', 'flash', 'AssetsService', function($scope, $upload, flash, AssetsService){

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
            //This is async!
            var xmlString = fileReader.readAsText(file);
            //Load handler
            fileReader.onload = function(){
                //Add all defined cloud resources as technical assets by calling the Assets service
                $scope.lastRequirementsLoaded = fileReader.result;
                var resources = x2js.xml_str2json($scope.lastRequirementsLoaded).resourceModelExtension.resourceContainer;
                _.each(resources, function(taAsset, index){
                    AssetsService.addTAReadFromXML(taAsset);
                });
            }
        } else {
            flash.error = 'Some error occurred while trying to upload your requirements';
        }
    }

}]);
