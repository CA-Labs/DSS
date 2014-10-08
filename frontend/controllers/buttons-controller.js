/**
 * Created by Jordi Aranda.
 * 08/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('buttonsController', ['$scope', '$rootScope', 'RisksService', 'AssetsService', 'TreatmentsService', 'flash', function($scope, $rootScope, RisksService, AssetsService, TreatmentsService, flash){

    $scope.unacceptableRisks = RisksService.getUnacceptableRisks();     // The list of unacceptable risks per TA asset

    $scope.ta = AssetsService.getTA();                                  // The list of TA assets

    /**
     * Called whenever the next button is clicked. Handles
     * what buttons should be displayed and triggers app
     * events accordingly (e.g.: when Search button is clicked,
     * filter cloud service proposals).
     * @param $event
     */
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
                    // flash.error = errorMessage + '.';
                    // $event.stopPropagation();
                }
            }
            else if(currentSlide.hasClass('treatments-slide')){

                var treatmentsSelected = TreatmentsService.getTreatments();
                var noUnnaceptableRisks = RisksService.noUnacceptableRisks();
                var error = false;

                if((!treatmentsSelected || treatmentsSelected.length == 0) && !noUnnaceptableRisks){
                    error = true;
                    flash.error = 'There are unmitigated risks. Please select some treatments before and associate them to the corresponding tangible asset(s). Please do refine your selection.';
                }

                _.each(treatmentsSelected, function(treatment){
                    if(!treatment.taRelations || treatment.taRelations.length == 0){
                        error = true;
                        flash.error = 'You should associate at least one tangible asset for each treatment.';
                    }
                });

                if(error){
                    $event.stopPropagation();
                } else {
                    $rootScope.$broadcast('acceptabilityValueChanged');
                }

            }
        }
    };

}]);