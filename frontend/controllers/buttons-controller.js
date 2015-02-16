/**
 * Created by Jordi Aranda.
 * 08/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('buttonsController', ['$scope', '$rootScope', 'RisksService', 'AssetsService', 'TreatmentsService', 'flash', 'ngDialog', 'usSpinnerService', '$timeout', function($scope, $rootScope, RisksService, AssetsService, TreatmentsService, flash, ngDialog, usSpinnerService, $timeout){

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
        var currentSlide = $('#dssSlides').find('.active');
        if(currentSlide.hasClass('toia-slide')){
            _.each(AssetsService.getTOIA(), function(toia){
                if(toia.bsoiaRelations.length == 0){
                    $scope.error = true;
                }
            });
            if($scope.error){
                ngDialog.open({
                    template: 'partials/assets/toia-bsoia-relation-popup.html',
                    className: 'ngdialog-theme-default',
                    controller: ['$scope', function($scope){
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
                        };
                    }]
                });
                $scope.error = false;
                $event.stopPropagation();
            }
        }
        else if(currentSlide.hasClass('risks-slide') && _.size($scope.unacceptableRisks) > 0){
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
        else if(currentSlide.hasClass('treatments-slide') && _.size($scope.unacceptableRisks) > 0){

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
                // Don't move the slide until we actually have results!
                $event.stopPropagation();
                // Show DSS spinner
                $timeout(function(){
                    // Firstly show the spinner so that the UI does not block right away
                    usSpinnerService.spin('dss-spinner');
                    // Compute scores, once calculated, move the slides forward
                    $timeout(function(){
                        $rootScope.$broadcast('getServicesWithTreatments');
                    }, 100);
                }, 100);
            }
        }
    };

    /**
     * Event used for moving slides from any controller. It is
     * basically used to move forward to the services slides once
     * we actually get results, so that the UI experience is better.
     */
    $scope.$on('moveSlides', function(){
        $('#dssSlides').carousel('next')
    });

    /**
     * Check if the Bsoia step was skipped
     * @returns {boolean|*}
     */
    $scope.skippedBsoia = function () {
        return AssetsService.countBSOIASelected() === 0 && AssetsService.getSkipBsoia();
    };

    /**
     * Check if the Toia step is skipped
     * @returns {boolean|*}
     */
    $scope.skippedToia = function () {
        return AssetsService.countTOIASelected() === 0 && AssetsService.getSkipToia();
    };

    /**
     * Skip step function
     */
    $scope.skip = function () {

        var lastActiveWizardElement = $('.nav-wizard').find('.active').last();

        if (lastActiveWizardElement.hasClass('bsoia-slide')) {
            AssetsService.toggleSkipBsoia();
        } else if (lastActiveWizardElement.hasClass('toia-slide')) {
            AssetsService.toggleSkipToia();
        }
    };

}]);