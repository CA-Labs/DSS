/**
 * Created by Jordi Aranda.
 * 09/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.controller('risksController'
        , ['$scope'
        , '$rootScope'
        , 'ArangoDBService'
        , 'flash'
        , 'localStorageService'
        , 'AssetsService'
        , 'RisksService'
        , '$timeout'
        , '$interpolate'
    , function($scope
           , $rootScope
           , ArangoDBService
           , flash
           , localStorageService
           , AssetsService
           , RisksService
           , $timeout
           , $interpolate){

    //Initialization
    $scope.potentialRisks = [];                                                                                         //List of current potential risks depending on BSOIA/TOIA assets selected by the user
    $scope.risksSelected = RisksService.getRisks();                                                                     //Risks selected by the user
    localStorageService.bind($scope, 'risksSelected', $scope.risksSelected);
    $scope.multiple = false;                                                                                            //Switch button to allow evaluate risks for each TA
    $scope.taAssets = AssetsService.getTA();                                                                            //The selected TA assets
    $scope.simpleRisksLikelihoodConsequence = RisksService.getRisksLikelihoodConsequence();                             //Likelihood/Consequence values for simple risks model
    localStorageService.bind($scope, 'simpleRisksLikelihoodConsequence', $scope.simpleRisksLikelihoodConsequence);
    $scope.multipleRisksLikelihoodConsequence = RisksService.getRisksTALikelihoodConsequence();                         //Likelihood/Consequence values for multiple risks model
    localStorageService.bind($scope, 'multipleRisksLikelihoodConsequence', $scope.multipleRisksLikelihoodConsequence);
    $scope.riskBoundModels = {};

    // Kind of a hack: this is necessary when loading simple risks model from local storage,
    // since the reference seems to be lost when setting the new simple risks model in the service
    // variable.
    $scope.$watch(function(){
        return RisksService.getRisksLikelihoodConsequence();
    }, function(newSimpleRisksLikelihoodConsequence){
        $scope.simpleRisksLikelihoodConsequence = newSimpleRisksLikelihoodConsequence;
    }, true);

    // Kind of a hack: this is necessary when loading multiple risks model from local storage,
    // since the reference seems to be lost when setting the new multiple risks model in the service
    // variable.
    $scope.$watch(function(){
        return RisksService.getRisksTALikelihoodConsequence();
    }, function(newMultipleRisksLikelihoodConsequence){
        $scope.multipleRisksLikelihoodConsequence = newMultipleRisksLikelihoodConsequence;
    }, true);

    //List of available categories to categorize risks level
    var CATEGORY = {
        VERY_LOW: {
            class: 'risk-very-low',
            name: 'Very low'
        },
        LOW: {
            class: 'risk-low',
            name: 'Low'
        },
        NORMAL: {
            class: 'risk-normal',
            name: 'Normal'
        },
        HIGH: {
            class: 'risk-high',
            name: 'High'
        },
        VERY_HIGH: {
            class: 'risk-very-high',
            name: 'Very high'
        }
    };

    //Auxiliar function to map scalar values to discrete ones (class names)
    var numberToCategoryClass = function(n){
        if(n < 2 ) return CATEGORY.VERY_LOW.class;
        if(n == 2 || n == 3) return CATEGORY.LOW.class;
        if(n == 4 || n == 5 || n == 6) return CATEGORY.NORMAL.class;
        if(n == 7 || n == 8) return CATEGORY.HIGH.class;
        if(n > 8) return CATEGORY.VERY_HIGH.class;
    };

    //Auxiliar function to map scalar values to discrete ones (names)
    var numberToCategoryName = function(n){
        if(n < 2 ) return CATEGORY.VERY_LOW.name;
        if(n == 2 || n == 3) return CATEGORY.LOW.name;
        if(n == 4 || n == 5 || n == 6) return CATEGORY.NORMAL.name;
        if(n == 7 || n == 8) return CATEGORY.HIGH.name;
        if(n > 8) return CATEGORY.VERY_HIGH.name;
    };

    //Auxiliar function to clear categories
    var removeClasses = function(domElement){
        for(category in CATEGORY){
            domElement.removeClass(CATEGORY[category].class);
        }
        return domElement;
    };

    /**
     * Listen for changes in selected risks, so that
     * treatments can be recomputed.
     */
    $scope.$watch(function(){
        return RisksService.getRisks();
    }, function(newRisks){
        $rootScope.$broadcast('risksSelectedChanged');
        $scope.risksSelected = newRisks;
    }, true);

    /**
     * Event received when a BSOIA asset has been selected/removed
     * by the user. This allows to recompute the potential risks.
     */
    $scope.$on('bsoiaChanged', function(){
        // Only update if we have at least one BSOIA asset
        if(AssetsService.getBSOIA().length > 0) {
            ArangoDBService.getPotentialRisks(AssetsService.getBSOIA(), AssetsService.getTOIA(), function(error, data){
                if(error){
                    flash.error = 'Some error occurred when trying to compute potential risks after selected BSOIA changed';
                } else {
                    var seen = [];
                    var aux = [];
                    _.each(data._documents, function(risk){
                        //TODO: Move this logic to an Angular filter
                        //Filter repeated risks by hand since AngularJS filter "unique" does not seem to work properly
                        if(seen.indexOf(risk.destination.name) === -1){
                            seen.push(risk.destination.name);
                            aux.push(risk);
                        }
                    });
                    $scope.potentialRisks = aux;
                }
            });
        }
    });

    /**
     * Event received when a TOIA asset has been selected/removed
     * by the user. This allows to recompute the potential risks.
     */
    $scope.$on('toiaChanged', function(){
        ArangoDBService.getPotentialRisks(AssetsService.getBSOIA(), AssetsService.getTOIA(), function(error, data){
           if(error){
               flash.error = 'Some error occurred when trying to compute potential risks after selected TOIA changed';
           } else {
               var seen = [];
               var aux = [];
               _.each(data._documents, function(risk){
                   //TODO: Move this logic to an Angular filter
                   //Filter repeated risks by hand since AngularJS filter "unique" does not seem to work properly
                   if(seen.indexOf(risk.destination.name) === -1){
                       seen.push(risk.destination.name);
                       aux.push(risk);
                   }
               });
               $scope.potentialRisks = aux;
           }
        });
    });

    /**
     * Handles toggle event in risks switch component and manages
     * the logic of when the user can specify risks per each tangible
     * asset.
     */
    $scope.toggleActivation = function(){
        if($scope.multiple){
            if($scope.taAssets.length == 0){
                flash.warn = 'You can\'t define risks per each tangible asset since you did not specify any of them';
                $scope.multiple = false;
                return;
            } else {
                $scope.multiple = true;
            }
        }
    };

    /**
     * Upon load of Tangible assets, set the values of the risks to be automatically enabled
     */
    $rootScope.$on('loadedTA', function () {
        $scope.multiple = true;
    });

    /**
     * Every time the set of TA assets changes, we should update the
     * likelihood/consequence models, since they are not modified automatically.
     */
    $scope.$watch(function(){
        return AssetsService.getTA();
    }, function(newTaAssets, oldTaAssets){

        // If we have loaded ta assets from local storage, don't update risks models
        if(AssetsService.isLoadingLocalStorageData()){
            $scope.taAssets = newTaAssets;
            // Check switch button status
            if($scope.taAssets.length > 0){
                $scope.multiple = true;
            }
            // Local storage finished loading assets scope data
            AssetsService.loadingLocalStorageData(false);
            return;
        }

        //Check switch button status
        if(newTaAssets.length == 0){
            $scope.multiple = false;
        }

        //Update risks multiple model
        var keysToRemove = [];
        var keysToAdd = [];

        //Keys removed
        _.each(oldTaAssets, function(oldAsset){
            var found = false;
            var cloudType = oldAsset.cloudType;
            _.each(newTaAssets, function(newAsset){
                switch(newAsset.cloudType){
                    case 'IaaS':
                        if(newAsset.cloudResource._serviceName == oldAsset.cloudResource._serviceName){
                            found = true;
                        }
                        break;
                    case 'PaaS':
                        if(newAsset.cloudPlatform._serviceName == oldAsset.cloudPlatform._serviceName){
                            found = true;
                        }
                        break;
                    default:
                        break;
                }
            });
            if(!found){
                switch(cloudType){
                    case 'IaaS':
                        keysToRemove.push(oldAsset.cloudResource._serviceName);
                        break;
                    case 'PaaS':
                        keysToRemove.push(oldAsset.cloudPlatform._serviceName);
                        break;
                    default:
                        break;
                }
            }
        });

        //Keys added
        _.each(newTaAssets, function(newTaAsset) {
            var found = false;
            var cloudType = newTaAsset.cloudType;
            _.each(oldTaAssets, function (oldTaAsset) {
                switch(oldTaAsset.cloudType){
                    case 'IaaS':
                        if(oldTaAsset.cloudResource._serviceName == newTaAsset.cloudResource._serviceName){
                            found = true;
                        }
                        break;
                    case 'PaaS':
                        if(oldTaAsset.cloudPlatform._serviceName == newTaAsset.cloudPlatform._serviceName){
                            found = true;
                        }
                        break;
                    default:
                        break;
                }
            });
            if(!found){
                switch(cloudType){
                    case 'IaaS':
                        keysToAdd.push(newTaAsset.cloudResource._serviceName);
                        break;
                    case 'PaaS':
                        keysToAdd.push(newTaAsset.cloudPlatform._serviceName);
                        break;
                    default:
                        break;
                }
            }
        });

        //Remove keys
        _.each(keysToRemove, function(key){
            RisksService.removeRiskTALikelihoodConsequence(key);
        });

        //Add keys
        _.each(keysToAdd, function(key){
            _.each($scope.risksSelected, function(risk){
                var attrs = $scope.$eval("{" + risk.destination.attributes + "}");
                RisksService.addRiskTALikelihood(risk.destination.name, key, attrs.start);
                RisksService.addRiskTAConsequence(risk.destination.name, key, attrs.start);
            })
        });

        $scope.taAssets = newTaAssets;

    }, true);

    /**
     * Every time the set of selected risks changes, we should update the
     * likelihood/consequence models, since they are not modified automatically.
     */
    $scope.$watch('risksSelected', function(newRisks, oldRisks){

        // If we have loaded risks from local storage, don't update risks models
        if(RisksService.isLoadingLocalStorageData()){
            RisksService.loadingLocalStorageData(false);
            // Restore UI sliders using bounded models
            Object.keys($scope.simpleRisksLikelihoodConsequence).forEach(function(key){
                $scope.riskBoundModels[key] = $scope.simpleRisksLikelihoodConsequence[key];
            });
            Object.keys($scope.multipleRisksLikelihoodConsequence).forEach(function(key){
                $scope.riskBoundModels[key] = $scope.multipleRisksLikelihoodConsequence[key];
            });
            return;
        };

        //Update risks simple model
        var keysToRemove = [];
        var keysToAdd = [];

        //Keys removed
        _.each(oldRisks, function(oldRisk){
            var found = false;
            _.each(newRisks, function(newRisk){
                if(newRisk.destination.name == oldRisk.destination.name){
                    found = true;
                }
            });
            if(!found){
                keysToRemove.push(oldRisk.destination.name);
            }
        });
        //Keys added
        _.each(newRisks, function(newRisk){
            var found = false;
            _.each(oldRisks, function(oldRisk){
                if(oldRisk.destination.name == newRisk.destination.name){
                    found = true;
                }
            });
            if(!found){
                var attrs = $scope.$eval("{" + newRisk.destination.attributes + "}");
                keysToAdd.push({name: newRisk.destination.name, value: attrs.start});
            }
        });


        //Remove keys
        _.each(keysToRemove, function(key){
            RisksService.removeRiskLikelihoodConsequence(key);
        });

        //Add keys
        _.each(keysToAdd, function(key){
            RisksService.addRiskLikelihood(key.name, key.value);
            RisksService.addRiskConsequence(key.name, key.value);
            _.each($scope.taAssets, function(taAsset){
                switch(taAsset.cloudType){
                    case 'IaaS':
                        RisksService.addRiskTALikelihood(key.name, taAsset.cloudResource._serviceName, key.value);
                        RisksService.addRiskTAConsequence(key.name, taAsset.cloudResource._serviceName, key.value);
                        break;
                    case 'PaaS':
                        RisksService.addRiskTALikelihood(key.name, taAsset.cloudPlatform._serviceName, key.value);
                        RisksService.addRiskTAConsequence(key.name, taAsset.cloudPlatform._serviceName, key.value);
                        break;
                    default:
                        break;
                }
            });
        });

        $scope.risksSelected = newRisks;

    }, true);

    /**
     * Adds a new risk to the list of selected risks,
     * by calling the Risks service.
     * @param risk The risk to be added to the list of
     * selected risks.
     */
    $scope.addRisk = function(risk){
        RisksService.addRisk(risk);
    };

    /**
     * Removes a risk from the list of selected risks,
     * by calling the Risks service.
     * @param risk
     */
    $scope.removeRisk = function(risk){
        RisksService.removeRisk(risk);
    };

    /**
     * Event received when a certain slider value has changed.
     * It updates the corresponding model in the Risks service
     * so that we can track all risk lihelihood/consequence slider
     * values.
     */
    $scope.$on('sliderValueChanged', function($event, element){

        // Ignore this event if we have no slider values available or if we are still loading data from local storage
        if(_.isEmpty($scope.simpleRisksLikelihoodConsequence || _.isEmpty($scope.multipleRisksLikelihoodConsequence))){
            return;
        };

        //Current slider value
        var sliderValue = element.value;

        //Update category tag with current slider value
        removeClasses(element.slider.children().first())
            .addClass(numberToCategoryClass(sliderValue))
            .text(numberToCategoryName(sliderValue));

        //Retrieve the unique hash key to know what must be updated in risks services, whether simple or multiple models
        var hashKey = element.slider.data('hash-key');
        var hashAttributes = hashKey.split('_');

        if(hashAttributes.length < 2){
            flash.error = 'Incorrect hash key for slider value!';
            return;
        };

        var riskName = hashAttributes[0];


        if($scope.multiple){
            //Look up what TA asset we are referring to
            var taKey = hashAttributes[1];
            //Likelihood or consequence?
            var valueToUpdate = hashAttributes[2];
            if(valueToUpdate == "likelihood"){
                //Update likelihood for a certain TA in multiple model
                RisksService.addRiskTALikelihood(riskName, taKey, sliderValue);
            } else {
                //Update consequence for a certain TA in multiple model
                RisksService.addRiskTAConsequence(riskName, taKey, sliderValue);
            }
        } else {
            //Likelihood or consequence?
            var valueToUpdate = hashAttributes[1];
            if(valueToUpdate == "likelihood"){
                //Update likelihood in simple model
                RisksService.addRiskLikelihood(riskName, sliderValue)
            } else {
                //Update consequence in simple model
                RisksService.addRiskConsequence(riskName, sliderValue);
            }
        }

    });

}]);
