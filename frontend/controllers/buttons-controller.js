/**
 * Created by Jordi Aranda.
 * 08/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('buttonsController', ['$scope', '$rootScope', 'RisksService', 'AssetsService', 'TreatmentsService', 'flash', 'ngDialog', function($scope, $rootScope, RisksService, AssetsService, TreatmentsService, flash, ngDialog){

    $scope.unacceptableRisks = RisksService.getUnacceptableRisks();     // The list of unacceptable risks per TA asset

    $scope.ta = AssetsService.getTA();                                  // The list of TA assets

    $scope.error = false;

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
                var i = 0;
                _.each($scope.unacceptableRisks, function(value, key){
                    if(value.length > 0){
                        $scope.error = true;
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
                if($scope.error){
                    $scope.error = false;
                    // flash.error = errorMessage + '.';
                    // $event.stopPropagation();
                }
            }
            else if(currentSlide.hasClass('treatments-slide')){

                var treatmentsSelected = TreatmentsService.getTreatments();
                var noUnnaceptableRisks = RisksService.noUnacceptableRisks();

                if((!treatmentsSelected || treatmentsSelected.length == 0) && !noUnnaceptableRisks){
                    $scope.error = true;
                    ngDialog.open({
                        template: 'partials/treatments/treatments-popup.html',
                        className: 'ngdialog-theme-default',
                        controller: ['$scope', '$rootScope', function($scope, $rootScope){
                            // Defines behaviour when user selected to stay in the treatments slide
                            $scope.stay = function() {
                                // This method is automatically injected into the scope
                                $scope.closeThisDialog();
                            };
                            // Defines behaviour when user selected to continue although warning was displayed
                            $scope.continue = function() {
                                // Don't consider this as an error so that slide transition to next one takes place
                                $scope.closeThisDialog();
                                // Transition to next slide
                                $('#dssSlides').carousel('next');
                                // Trigger cloud service computation taking as treatments selected those associated to
                                // every single risk unacceptable
                                $rootScope.$broadcast('getServicesWithoutTreatments');
                            };
                        }]
                    });
                } else {
                    _.each(treatmentsSelected, function(treatment){
                        if(!treatment.taRelations || treatment.taRelations.length == 0){
                            $scope.error = true;
                            flash.error = 'You should associate at least one tangible asset for each treatment.';
                        }
                    });
                }

                if($scope.error){
                    $scope.error = false;
                    $event.stopPropagation();
                } else {
                    $rootScope.$broadcast('acceptabilityValueChanged');
                }

            }
        }
    };

}]);