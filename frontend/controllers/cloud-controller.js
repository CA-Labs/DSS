/**
 * Created by Jordi Aranda.
 * 18/08/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('cloudController', ['$scope', 'ArangoDBService', 'TreatmentsService', 'AssetsService', function($scope, ArangoDBService, TreatmentsService, AssetsService){

    $scope.treatments = TreatmentsService.getTreatments();              // The selected treatments
    $scope.ta = AssetsService.getTA();                                  // The selected TA assets loaded from the cloud descriptor xml file
    $scope.proposals = {};                                              // The cloud service proposals (by TA) offered by the graph engine

    $scope.$watch(function(){
        return TreatmentsService.getTreatments();
    }, function(newTreatments, oldTreatments){
        $scope.treatments = newTreatments;

        // Only query service proposals if we have at least one treatment and tangible asset
        if($scope.treatments.length > 0 && $scope.ta.length > 0){
            _.each($scope.ta, function(ta){
                ArangoDBService.getProposals(ta.cloudType, $scope.treatments, function(error, data){
                    if(error){
                        console.log(error);
                    } else {
                        console.log(data);
                        switch(ta.cloudType){
                            case 'IaaS':
                                $scope.proposals[ta.cloudResource._serviceName] = data._documents;
                                break;
                            case 'PaaS':
                                $scope.proposals[ta.cloudPlatform._serviceName] = data._documents;
                                break;
                            default:
                                break;
                        }
                    }
                    console.log($scope.proposals);
                });
            });
        } else {
            $scope.proposals = [];
        }
    }, true);

    $scope.$watch(function(){
        return AssetsService.getTA();
    }, function(newTA, oldTA){
        $scope.ta = newTA;
        // Only query service proposals if we have at least one treatment and tangible asset
        if($scope.ta.length > 0 && $scope.treatments.length > 0){
            _.each($scope.ta, function(ta){
                ArangoDBService.getProposals(ta.cloudType, $scope.treatments, function(error, data){
                    if(error){
                        console.log(error);
                    } else {
                        switch(ta.cloudType){
                            case 'IaaS':
                                $scope.proposals[ta.cloudResource._serviceName] = data._documents;
                                break;
                            case 'PaaS':
                                $scope.proposals[ta.cloudPlatform._serviceName] = data._documents;
                                break;
                            default:
                                break;
                        }
                    }
                    console.log($scope.proposals);
                });
            });
        }
    }, true);

    $scope.getCloudTypeFromTA = function(taAsset){
        return taAssset.cloudType;
    };

    $scope.getTAProposals = function(taAssetName){
        // console.log('getting proposals for TA ' + taAssetName);
        if($scope.proposals[taAssetName]){
            console.log($scope.proposals[taAssetName]);
            return $scope.proposals[taAssetName];
        } else {
            return [];
        }
    }

}]);
