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
    $scope.showRiskPerTA = false;                                                                                       //Switch button to allow evaluate risks for each TA
    localStorageService.bind($scope, 'showRiskPerTA', $scope.showRiskPerTA);
    $scope.taAssets = AssetsService.getTA();                                                                            //The selected TA assets

    $scope.simpleRisksLikelihoodConsequence = RisksService.getRisksLikelihoodConsequence();                             //Likelihood/Consequence values for simple risks model
    localStorageService.bind($scope, 'simpleRisksLikelihoodConsequence', $scope.simpleRisksLikelihoodConsequence);

    $scope.multipleRisksLikelihoodConsequence = RisksService.getRisksTALikelihoodConsequence();                         //Likelihood/Consequence values for multiple risks model
    localStorageService.bind($scope, 'multipleRisksLikelihoodConsequence', $scope.multipleRisksLikelihoodConsequence);

    $scope.unacceptableRisks = RisksService.getUnacceptableRisks();

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

    //List of available categories to categorize risks level for likelihood values
    var LIKELIHOOD_CATEGORIES = {
        RARE: {
            class: 'risk-very-low',
            name: 'Rare'
        },
        UNLIKELY: {
            class: 'risk-low',
            name: 'Unlikely'
        },
        POSSIBLE: {
            class: 'risk-normal',
            name: 'Possible'
        },
        LIKELY: {
            class: 'risk-high',
            name: 'Likely'
        },
        CERTAIN: {
            class: 'risk-very-high',
            name: 'Certain'
        }
    };

    var CONSEQUENCE_CATEGORIES = {
        INSIGNIFICANT: {
            class: 'risk-very-low',
            name: 'Insignificant'
        },
        MINOR: {
            class: 'risk-low',
            name: 'Minor'
        },
        MODERATE: {
            class: 'risk-normal',
            name: 'Moderate'
        },
        MAJOR: {
            class: 'risk-high',
            name: 'Major'
        },
        CATASTROPHIC: {
            class: 'risk-very-high',
            name: 'Catastrophic'
        }
    };

    //Auxiliar function to map scalar values to discrete ones (class names)
    var numberToCategoryClass = function(n, type){
        switch(type){
            case 'likelihood':
                if(n < 2 ) return LIKELIHOOD_CATEGORIES.RARE.class;
                if(n == 2 || n == 3) return LIKELIHOOD_CATEGORIES.UNLIKELY.class;
                if(n == 4 || n == 5 || n == 6) return LIKELIHOOD_CATEGORIES.POSSIBLE.class;
                if(n == 7 || n == 8) return LIKELIHOOD_CATEGORIES.LIKELY.class;
                if(n > 8) return LIKELIHOOD_CATEGORIES.CERTAIN.class;
                break;
            case 'consequence':
                if(n < 2 ) return CONSEQUENCE_CATEGORIES.INSIGNIFICANT.class;
                if(n == 2 || n == 3) return CONSEQUENCE_CATEGORIES.MINOR.class;
                if(n == 4 || n == 5 || n == 6) return CONSEQUENCE_CATEGORIES.MODERATE.class;
                if(n == 7 || n == 8) return CONSEQUENCE_CATEGORIES.MAJOR.class;
                if(n > 8) return CONSEQUENCE_CATEGORIES.CATASTROPHIC.class;
                break;
            default:
                break;
        }
    };

    //Auxiliar function to map scalar values to discrete ones (names)
    var numberToCategoryName = function(n, type){
        switch(type){
            case 'likelihood':
                if(n < 2 ) return LIKELIHOOD_CATEGORIES.RARE.name;
                if(n == 2 || n == 3) return LIKELIHOOD_CATEGORIES.UNLIKELY.name;
                if(n == 4 || n == 5 || n == 6) return LIKELIHOOD_CATEGORIES.POSSIBLE.name;
                if(n == 7 || n == 8) return LIKELIHOOD_CATEGORIES.LIKELY.name;
                if(n > 8) return LIKELIHOOD_CATEGORIES.CERTAIN.name;
                break;
            case 'consequence':
                if(n < 2 ) return CONSEQUENCE_CATEGORIES.INSIGNIFICANT.name;
                if(n == 2 || n == 3) return CONSEQUENCE_CATEGORIES.MINOR.name;
                if(n == 4 || n == 5 || n == 6) return CONSEQUENCE_CATEGORIES.MODERATE.name;
                if(n == 7 || n == 8) return CONSEQUENCE_CATEGORIES.MAJOR.name;
                if(n > 8) return CONSEQUENCE_CATEGORIES.CATASTROPHIC.name;
                break;
            default:
                break;
        }
    };

    //Auxiliar function to clear categories
    var removeClasses = function(domElement){
        for(category in LIKELIHOOD_CATEGORIES){
            domElement.removeClass(LIKELIHOOD_CATEGORIES[category].class);
        }
        for(category in CONSEQUENCE_CATEGORIES){
            domElement.removeClass(CONSEQUENCE_CATEGORIES[category].class);
        }
        return domElement;
    };

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
        if($scope.showRiskPerTA){
            if($scope.taAssets.length == 0){
                flash.warn = 'You can\'t define risks per each tangible asset since you did not specify any of them';
                $scope.showRiskPerTA = false;
                return;
            } else {
                $scope.showRiskPerTA = true;
            }
        }
    };

    /**
     * Upon load of Tangible assets,
     * set the values of the risks to be automatically enabled
     */
    $scope.$on('loadedTA', function () {
        $scope.showRiskPerTA = true;
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
                $scope.showRiskPerTA = true;
            }
            // Local storage finished loading assets scope data
            AssetsService.loadingLocalStorageData(false);
            return;
        }

        //Check switch button status
        if(newTaAssets.length == 0){
            $scope.showRiskPerTA = false;
        }

        //Update risks showRiskPerTA model
        var keysToRemove = [];
        var keysToAdd = [];

        //Keys removed
        _.each(oldTaAssets, function(oldAsset){
            var found = false;
            var cloudType = oldAsset.cloudType;
            _.each(newTaAssets, function(newAsset){
                switch(newAsset.cloudType){
                    case 'IaaS':
                        if(newAsset._id == oldAsset._id &&
                            newAsset.cloudResource._serviceName == oldAsset.cloudResource._serviceName){
                            found = true;
                        }
                        break;
                    case 'PaaS':
                        if(newAsset._id == oldAsset._id &&
                            newAsset.cloudPlatform._serviceName == oldAsset.cloudPlatform._serviceName){
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
                        keysToRemove.push(oldAsset._id);
                        break;
                    case 'PaaS':
                        keysToRemove.push(oldAsset._id);
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
                        if(oldTaAsset._id == newTaAsset._id &&
                            oldTaAsset.cloudResource._serviceName == newTaAsset.cloudResource._serviceName){
                            found = true;
                        }
                        break;
                    case 'PaaS':
                        if(oldTaAsset._id == newTaAsset._id &&
                            oldTaAsset.cloudPlatform._serviceName == newTaAsset.cloudPlatform._serviceName){
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
                        keysToAdd.push(newTaAsset._id);
                        break;
                    case 'PaaS':
                        keysToAdd.push(newTaAsset._id);
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
                        RisksService.addRiskTALikelihood(key.name, taAsset._id, key.value);
                        RisksService.addRiskTAConsequence(key.name, taAsset._id, key.value);
                        break;
                    case 'PaaS':
                        RisksService.addRiskTALikelihood(key.name, taAsset._id, key.value);
                        RisksService.addRiskTAConsequence(key.name, taAsset._id, key.value);
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
        var sliderType = element.type;
        var sliderModel = element.model;

        //Retrieve the unique hash key to know what must be updated in risks services, whether simple or multiple models
        var hashKey = element.slider.data('hash-key');
        var hashAttributes = hashKey.split('/');

        //Update category tag with current slider value
        removeClasses(element.slider.children().first())
            .addClass(numberToCategoryClass(sliderValue, sliderType))
            .text(numberToCategoryName(sliderValue, sliderType));

        if(hashAttributes.length < 2){
            flash.error = 'Incorrect hash key for slider value!';
            return;
        };

        var riskName = hashAttributes[0];

        if(sliderModel == 'multiple'){
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

            // Check risk unacceptability
            var riskLikelihoodConsequence = RisksService.getLikelihoodAndConsequenceValues(riskName, taKey);
            var isRiskUnacceptable = AssetsService.isRiskUnacceptable(riskLikelihoodConsequence.likelihood, riskLikelihoodConsequence.consequence, taKey);
            if(isRiskUnacceptable){
                // console.log(riskName + ' (multiple) is unnaceptable');
                RisksService.addUnacceptableRisk(taKey, riskName);
            } else {
                // console.log(riskName + ' (multiple) is acceptable');
                RisksService.removeUnacceptableRisk(taKey, riskName);
            }

        } else if(sliderModel == 'simple') {
            //Likelihood or consequence?
            var valueToUpdate = hashAttributes[1];

            if(valueToUpdate == "likelihood"){
                //Update likelihood in simple model
                RisksService.addRiskLikelihood(riskName, sliderValue)
            } else {
                //Update consequence in simple model
                RisksService.addRiskConsequence(riskName, sliderValue);
            }

            // Check risk acceptability
            var riskLikelihoodConsequence = RisksService.getLikelihoodAndConsequenceValues(riskName);
            _.each($scope.taAssets, function(ta){
               var isRiskUnacceptable = AssetsService.isRiskUnacceptable(riskLikelihoodConsequence.likelihood, riskLikelihoodConsequence.consequence, ta._id);
                if(isRiskUnacceptable){
                    console.log(riskName + ' (simple) is unacceptable');
                    RisksService.addUnacceptableRisk(ta._id, riskName);
                } else {
                    console.log(riskName + ' (simple) is acceptable');
                    RisksService.removeUnacceptableRisk(ta._id, riskName);
                }
            });

        }

        $rootScope.$broadcast('risksSelectedChanged');

    });

    /**
     * Event received when some TA acceptability value changed, we have
     * to recompute risks acceptability.
     */
    $scope.$on('acceptabilityValueChanged', function(){
        //console.log('I have to recompute things...');
        if(_.isEmpty($scope.simpleRisksLikelihoodConsequence) || _.isEmpty($scope.multipleRisksLikelihoodConsequence)){
            return;
        }
        var SEPARATOR = RisksService.getSeparator();
        var taIds = $scope.taAssets.map(function(ta){
            return ta._id;
        });
        var riskNames = $scope.risksSelected.map(function(risk){
            return risk.destination.name;
        });
        if($scope.showRiskPerTA){
            _.each(riskNames, function(riskName){
                //console.log('RISK NAME', riskName);
                _.each(taIds, function(taId){
                    //console.log('TA ID', taId);
                    var riskLikelihoodConsequence = RisksService.getLikelihoodAndConsequenceValues(riskName, taId);
                    var isRiskUnacceptable = AssetsService.isRiskUnacceptable(riskLikelihoodConsequence.likelihood, riskLikelihoodConsequence.consequence, taId);
                    if(isRiskUnacceptable){
                        //console.log(riskName + ' (multiple) is unnaceptable');
                        RisksService.addUnacceptableRisk(taId, riskName);
                    } else {
                        //console.log(riskName + ' (multiple) is acceptable');
                        RisksService.removeUnacceptableRisk(taId, riskName);
                    }
                    //console.log('**************************');
                });
            })
        } else {
            _.each(riskNames, function(riskName){
                var riskLikelihoodConsequence = RisksService.getLikelihoodAndConsequenceValues(riskName);
                _.each(taIds, function(taId){
                    var isRiskUnacceptable = AssetsService.isRiskUnacceptable(riskLikelihoodConsequence.likelihood, riskLikelihoodConsequence.consequence, taId);
                    if(isRiskUnacceptable){
                        //console.log(riskName + ' (simple) is unacceptable');
                        RisksService.addUnacceptableRisk(taId, riskName);
                    } else {
                        //console.log(riskName + ' (simple) is acceptable');
                        RisksService.removeUnacceptableRisk(taId, riskName);
                    }
                    //console.log('******************');
                });
            })
        }
        $rootScope.$broadcast('risksSelectedChanged');
    });

    $scope.isUnacceptable = function(riskName, taAssetId){
        if(taAssetId){
            return RisksService.isUnacceptable(riskName, taAssetId);
        } else {
            return RisksService.isUnacceptable(riskName);
        }
    };

}]);
