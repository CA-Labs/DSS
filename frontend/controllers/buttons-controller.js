/**
 * Created by Jordi Aranda.
 * 08/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('buttonsController', ['$scope', '$rootScope', 'RisksService', 'AssetsService', 'TreatmentsService', 'flash', function($scope, $rootScope, RisksService, AssetsService, TreatmentsService, flash){

    $scope.unacceptableRisks = RisksService.getUnacceptableRisks();

    $scope.ta = AssetsService.getTA();

    $scope.next = function($event){
        if(_.size($scope.unacceptableRisks) > 0){
            var currentSlide = $('#dssSlides').find('.active');
            if(currentSlide.hasClass('risks-slide')){
                var errorMessage = 'The following risks aren\'t mitigated: ';
                var error = false;
                var i = 0;
                _.each($scope.unacceptableRisks, function(value, key){
                    if(value.length > 0){
                        error = true;
                        var first = true;
                        var taName = '';
                        _.each($scope.ta, function(ta){
                            if(ta._id == key){
                                switch(ta.cloudType){
                                    case 'IaaS':
                                        taName = ta.cloudResource._serviceName;
                                        break;
                                    case 'PaaS':
                                        taName = ta.cloudPlatform._serviceName;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                        _.each(value, function(risk, j){
                            if(first){
                                first = false;
                                errorMessage += value + ' (' + taName + ')';
                                if(j == value.length - 1 && i != _.size($scope.unacceptableRisks) - 1){
                                    errorMessage += ', ';
                                }
                            } else {
                                errorMessage += ', ' + value + ' (' + taName + ')';
                            }
                        });
                    }
                    i++;
                });
                if(error){
                    flash.error = errorMessage + '.';
                    //$event.stopPropagation();
                }
            }
            else if(currentSlide.hasClass('treatments-slide')){
                var treatmentsSelected = TreatmentsService.getTreatments();
                var error = false;
                _.each(treatmentsSelected, function(treatment){
                    if(!treatment.taRelations || treatment.taRelations.length == 0){
                        error = true;
                    }
                });
                if(error){
                    flash.error = 'You should associate at least one Tangible Asset for each treatment.';
                    $event.stopPropagation();
                } else {
                    $rootScope.$broadcast('acceptabilityValueChanged');
                }

            }
        }
    };

}]);