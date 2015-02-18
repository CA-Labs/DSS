/**
 * Created by Jordi Aranda.
 * 22/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('TreatmentsService', ['flash', 'localStorageService', 'RisksService', function(flash, localStorageService, RisksService){

    var allTreatments = [];

    var treatmentsFromStorage = localStorageService.get('treatmentsSelected') || [];
    var treatments = treatmentsFromStorage;

    var treatmentsValuesFromStorage = localStorageService.get('treatmentValues') || {};
    var treatmentsValues = treatmentsValuesFromStorage;         // Treatments values model used to store
                                                                // select/sliders/radio UI components values

    var risksTreatmentsMappingFromStorage = localStorageService.get('risksTreatmentsMapping') || {};
    var risksTreatmentsMapping = risksTreatmentsMappingFromStorage;

    var treatmentsConnectedToCloudAndServiceTypesFromStorage = localStorageService.get('treatmentsConnectedToCloudAndServiceTypesFromStorage') || {};
    var treatmentsConnectedToCloudAndServiceTypes = treatmentsConnectedToCloudAndServiceTypesFromStorage;

    var showTreatmentsValuesFromStorage = localStorageService.get('showTreatmentsValues') || {};
    var showTreatmentsValues = showTreatmentsValuesFromStorage;

    var loadingTreatmentsFromLocalStorage = false;              // Flag to control local storage restore state
    var loadingTreatmentsValuesFromLocalStorage = false;        // IDEM

    /**
     * Adds a treatment to the list of selected treatments.
     * @param risk The treatment to be added.
     */
    this.addTreatment = function(treatment){
        if(treatment === null || typeof treatment === 'undefined'){
            flash.warn = 'No treatment was selected';
        } else {
            //Check treatment doesn't already exist
            var exists = treatments.filter(function(t, treatmentIndex){
                return treatment.name == t.name;
            }).length > 0;
            if(!exists){
                // objectify options
                treatments.push(treatment);
            } else {
                // flash.warn = 'This treatment has been already added';
            }
        }
    };

    /**
     * Removes a treatment from the list of selected treatments.
     * @param risk The treatment to be removed.
     */
    this.removeTreatment = function(treatment){
        var index = -1;
        _.each(treatments, function(t, treatmentIndex){
            if(treatment.name == t.name){
                index = treatmentIndex;
            }
        });
        if(index >= 0) treatments.splice(index, 1);
    };

    /**
     * Retrieves the list of selected treatments.
     * @returns {Array}
     */
    this.getTreatments = function(){
        return treatments;
    };

    /**
     * Retrieves the list of all treatments.
     * @returns {Array}
     */
    this.getAllTreatments = function(){
        return allTreatments;
    }

    /**
     * Adds a new treatment value to the model of selected treatments values.
     * @param treatmentName The treatment name.
     * @param treatmentValue The treatment value.
     */
    this.addTreatmentValue = function(treatmentName, treatmentValue){
        treatmentsValues[treatmentName] = treatmentValue;
        console.log(treatmentsValues);
    };

    /**
     * Removes a treatment value from the model of selected treatments values.
     * @param treatmentName The treatment name.
     */
    this.removeTreatmentValue = function(treatmentName){
        delete treatmentsValues[treatmentName];
    };

    /**
     * Retrieves the treatments values model.
     * @returns {{}}
     */
    this.getTreatmentsValues = function(){
        return treatmentsValues;
    };

    /**
     * Retrieves a treatment value by treatment name.
     * @param treatmentName The treatment name.
     * @returns {*}
     */
    this.getTreatmentValue = function(treatmentName){
        switch (typeof treatmentsValues[treatmentName]){
            case 'object': return treatmentsValues[treatmentName];
            case 'string': return parseInt(treatmentsValues[treatmentName]);
            default: return treatmentsValues[treatmentName];
        }
    };

    /**
     * Sets the treatments model loaded from local storage.
     * @param treatmentsLoadedFromLocalStorage The treatments
     * model to be loaded from local storage.
     */
    this.setTreatments = function(treatmentsLoadedFromLocalStorage){
        if(!angular.equals(treatments, treatmentsLoadedFromLocalStorage)){
            angular.copy(treatmentsLoadedFromLocalStorage, treatments);
        }
    };

    /**
     * Sets the all treatments model loaded from local storage.
     * @param newAllTreatmentsLoadedFromLocalStorage The all treatments
     * model to be loaded from local storage.
     */
    this.setAllTreatments = function(newAllTreatmentsLoadedFromLocalStorage){
        if(!angular.equals(allTreatments, newAllTreatmentsLoadedFromLocalStorage)){
            angular.copy(newAllTreatmentsLoadedFromLocalStorage, allTreatments);
        }
    };

    /**
     * Sets the treatments values model from local storage.
     * @param treatmentValuesLoadedFromLocalStorage The treatments
     * values model to be loaded from local storage.
     */
    this.setTreatmentValues = function(treatmentValuesLoadedFromLocalStorage){
        if(!angular.equals(treatmentsValues, treatmentValuesLoadedFromLocalStorage)){
            angular.copy(treatmentValuesLoadedFromLocalStorage, treatmentsValues);
        }
    };

    /**
     * Sets a flag indicating whether the treatments model is being
     * loaded from local storage or not.
     * @param loading A boolean indicating the treatments model
     * loading state.
     */
    this.loadingTreatmentsFromLocalStorage = function(loading){
        loadingTreatmentsFromLocalStorage = loading;
    };

    /**
     * Sets a flag indicating whether the treatments values model
     * is being loaded from local storage or not.
     * @param loading A boolean indicating the treatments values
     * model loading state.
     */
    this.loadingTreatmentsValuesFromLocalStorage = function(loading){
        loadingTreatmentsValuesFromLocalStorage = loading;
    };

    /**
     * Whether the treatments model is still being loaded or not.
     * @returns {boolean}
     */
    this.isLoadingTreatmentsFromLocalStorage = function(){
        return loadingTreatmentsFromLocalStorage;
    };

    /**
     * Whehter the treatments values model is still being loaded or not.
     * @returns {boolean}
     */
    this.isLoadingTreatmentsValuesFromLocalStorage = function(){
        return loadingTreatmentsValuesFromLocalStorage;
    };

    /**
     * Sets the risks treatments mapping.
     * @param risksTreatmentsMappingValues The risks treatments mapping
     * values to be set.
     */
    this.setRisksTreatmentsMapping = function(risksTreatmentsMappingValues){
        if(!angular.equals(risksTreatmentsMapping, risksTreatmentsMappingValues)){
            angular.copy(risksTreatmentsMappingValues, risksTreatmentsMapping);
        }
    };

    /**
     * Returns the risks treatments mapping.
     * @returns {*|{}}
     */
    this.getRisksTreatmentsMapping = function(){
        return risksTreatmentsMapping;
    };

    /**
     * Given a cloud type and a service type, sets what treatments are found
     * in any single path between a service of this nature and a treatment in our
     * graph model.
     * @param cloudType A valid cloud type.
     * @param serviceType A valid service type.
     * @param treatmentsConnections The treatments connections found in the graph.
     */
    this.setTreatmentsConnectedToCloudAndServiceTypes = function(cloudType, serviceType, treatmentsConnections){
        treatmentsConnectedToCloudAndServiceTypes[cloudType + '/' + serviceType] = treatmentsConnections;
    };

    /**
     * Given a cloud type and a service type, returns what treatments connections
     * were previously found.
     * @param cloudType A valid cloud type.
     * @param serviceType A valid service type.
     * @returns {*}
     */
    this.getTreatmentsConnectedToCloudAndServiceTypes = function(cloudType, serviceType){
        var treatmentsConnections = treatmentsConnectedToCloudAndServiceTypes[cloudType + '/' + serviceType];
        if(treatmentsConnections){
            return treatmentsConnections;
        } else {
            return [];
        }
    };

    /**
     * Given a treatment, return what risks are connected to it.
     * @param treatmentName The tretment name.
     * @returns {Array}
     */
    this.getRisksFromTreatment = function(treatmentName){
        var selectedRisks = RisksService.getRisks();
        var riskNames = [];
        _.each(risksTreatmentsMapping, function(value, key){
            if(_.contains(value, treatmentName) && !_.contains(riskNames, key)){
                _.each(selectedRisks, function(selectedRisk){
                    if(selectedRisk.destination.name == key && riskNames.indexOf(key) == -1){
                        riskNames.push(key);
                    }
                });
            }
        });
        return riskNames;
    };

    /**
     * Given a risk name, return what treatments are connected to it.
     * @param riskName The risk name.
     * @returns {*}
     */
    this.getTreatmentsFromRisk = function(riskName){
        return risksTreatmentsMapping[riskName];
    };

    /**
     * Given a list of treatments, returns what risks are mitigated.
     * @param treatments The list of treatments.
     */
    this.getRisksMitigatedFromTreatments = function(treatments){
        var riskNames = [];
        _.each(risksTreatmentsMapping, function(value, key){
            _.each(treatments, function(treatment){
                if(_.contains(value, treatment) && !_.contains(riskNames, key)){
                    riskNames.push(key);
                }
            });
        });
        return riskNames;
    };

    /**
     * Given a treatment name, returns true if the user selected to choose among
     * its possible values or false otherwise (he is not interested in the values,
     * but just in the concept).
     * @param treatmentName The treatment name.
     * @returns {boolean}
     */
    this.showTreatmentValue = function(treatmentName){
        return showTreatmentsValues[treatmentName] !== undefined && showTreatmentsValues[treatmentName] === true;
    };

    /**
     * Sets the treatment options mode (show allowed values or not).
     * @param treatmentName The treatment name.
     * @param showTreatment A boolean indicating if treatment options should be displayed or not.
     */
    this.setShowTreatmentValue = function(treatmentName, showTreatment){
        if(showTreatment){
            showTreatmentsValues[treatmentName] = true;
        } else {
            delete showTreatmentsValues[treatmentName];
        }
    };

    /**
     * Returns the treatments values model.
     * @returns {*|{}}
     */
    this.getShowTreatmentsValues = function(){
        return showTreatmentsValues;
    };

    /**
     * Sets the treatments values model to be loaded from
     * local storage.
     * @param showTreatmentsValuesFromLocalStorage The
     * treatments values model to be loaded.
     */
    this.setShowTreatmentsValues = function(showTreatmentsValuesFromLocalStorage){
        showTreatmentsValues = showTreatmentsValuesFromLocalStorage;
    };

    /**
     * Checks if a TA asset is associated with a treatment.
     * @param treatment The treatment.
     * @param ta The TA asset.
     * @returns {boolean}
     */
    this.taAssetExists = function (treatment, ta) {
        var bool = false;
        if (_.isUndefined(treatment.taRelations)) treatment.taRelations = [];
        _.each(treatment.taRelations, function (taAssigned) {
            if (taAssigned._id == ta._id) {
                bool = true;
            }
        });
        return bool;
    };

    /**
     * Associates a TA asset with a treatment.
     * @param treatment The treatment.
     * @param ta The TA asset to be associated
     * to that treatment.
     */
    this.addTAToTreatment = function (treatment, ta) {
        var index = -1;
        _.each(treatments, function(t, i){
            if(t.name == treatment.name){
                index = i;
            }
        });
        if(index >= 0){
            if(treatments[index].taRelations){
                var found = treatments[index].taRelations.filter(function(taRelation){
                    return taRelation._id == ta._id;
                }).length > 0;
                if(!found){
                    treatments[index].taRelations.push(ta);
                }
            } else {
                treatments[index].taRelations = [];
                treatments[index].taRelations.push(ta);
            }
        }
    };

    /**
     * Removes a TA asset from a treatment.
     * @param treatment The treatment.
     * @param ta The TA asset to be removed from
     * that treatment.
     * @returns {boolean}
     */
    this.removeTaFromTreatment = function (treatment, ta) {
        if (_.isUndefined(treatment.taRelations)) return false;
        var taPos = _.indexOf(treatment.taRelations, ta);
        if (taPos > -1) {
            treatment.taRelations.splice(taPos, 1);
        }
    };

    /**
     * Count Treatments Selected
     * @returns {Number}
     */
    this.countTreatmentsSelected = function () {
        return treatments.length;
    };

    /**
     * Used when comparing user-selected regions with service regions.
     * @param userRegions
     * @param serviceRegions
     * @returns {number}
     */
    this.compareRegions = function(userRegions, serviceRegions){
        // Normalize regions arrays to lowercase
        userRegions = _.map(userRegions, function(region){ return region.toLowerCase(); });
        serviceRegions = _.map(serviceRegions, function(region){ return region.toLowerCase(); });

        // Compute score based on user-selected regions
        var score = 0;
        _.each(userRegions, function(region){
            if(serviceRegions.indexOf(region) !== -1 && score < userRegions.length) score++;
        });
        return userRegions.length > 0 ? (score/userRegions.length)*10 : 0;
    };

}]);

