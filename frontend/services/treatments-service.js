/**
 * Created by Jordi Aranda.
 * 22/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('TreatmentsService', ['flash', 'localStorageService', 'RisksService', function(flash, localStorageService, RisksService){

    var treatmentsFromStorage = localStorageService.get('treatmentsSelected') || [];
    var treatments = treatmentsFromStorage;

    var treatmentsValuesFromStorage = localStorageService.get('treatmentValues') || {};
    var treatmentsValues = treatmentsValuesFromStorage;         // Treatments values model used to store select/sliders/radio UI components values

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
     * Adds a new treatment value to the model of selected treatments values.
     * @param treatmentName The treatment name.
     * @param treatmentValue The treatment value.
     */
    this.addTreatmentValue = function(treatmentName, treatmentValue){
        treatmentsValues[treatmentName] = treatmentValue;
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

    this.getTreatmentValue = function(treatmentName){
        return treatmentsValues[treatmentName];
    };

    this.setTreatments = function(treatmentsLoadedFromLocalStorage){
        treatments = treatmentsLoadedFromLocalStorage;
    };

    this.setTreatmentValues = function(treatmentValuesLoadedFromLocalStorage){
        treatmentsValues = treatmentValuesLoadedFromLocalStorage;
    };

    this.loadingTreatmentsFromLocalStorage = function(loading){
        loadingTreatmentsFromLocalStorage = loading;
    };

    this.loadingTreatmentsValuesFromLocalStorage = function(loading){
        loadingTreatmentsValuesFromLocalStorage = loading;
    };

    this.isLoadingTreatmentsFromLocalStorage = function(){
        return loadingTreatmentsFromLocalStorage;
    };

    this.isLoadingTreatmentsValuesFromLocalStorage = function(){
        return loadingTreatmentsValuesFromLocalStorage;
    };

    this.setRisksTreatmentsMapping = function(risksTreatmentsMappingValues){
        risksTreatmentsMapping = risksTreatmentsMappingValues;
    };

    this.getRisksTreatmentsMapping = function(){
        return risksTreatmentsMapping;
    };

    this.setTreatmentsConnectedToCloudAndServiceTypes = function(cloudType, serviceType, treatmentsConnections){
        treatmentsConnectedToCloudAndServiceTypes[cloudType + '/' + serviceType] = treatmentsConnections;
    };

    this.getTreatmentsConnectedToCloudAndServiceTypes = function(cloudType, serviceType){
        var treatmentsConnections = treatmentsConnectedToCloudAndServiceTypes[cloudType + '/' + serviceType];
        if(treatmentsConnections){
            return treatmentsConnections;
        } else {
            return [];
        }
    };

    this.getRisksFromTreatment = function(treatmentName){
        var selectedRisks = RisksService.getRisks();
        var risksNames = [];
        _.each(risksTreatmentsMapping, function(value, key){
            if(_.contains(value, treatmentName) && !_.contains(risksNames, key)){
                _.each(selectedRisks, function(selectedRisk){
                    if(selectedRisk.destination.name == key){
                        risksNames.push(key);
                    }
                });
            }
        });
        return risksNames;
    };

    this.showTreatmentValue = function(treatmentName){
        return showTreatmentsValues[treatmentName] !== undefined && showTreatmentsValues[treatmentName] === true;
    };

    this.setShowTreatmentValue = function(treatmentName, showTreatment){
        if(showTreatment){
            showTreatmentsValues[treatmentName] = true;
        } else {
            delete showTreatmentsValues[treatmentName];
        }
    };

    this.getShowTreatmentsValues = function(){
        return showTreatmentsValues;
    };

    this.setShowTreatmentsValues = function(showTreatmentsValuesFromLocalStorage){
        showTreatmentsValues = showTreatmentsValuesFromLocalStorage;
    };

    /**
     * check if TA exists in the treatment
     * @param treatment
     * @param ta
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
     * Add TA to Treatment
     * @param treatment
     * @param ta
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
                console.log(index);
                console.log(treatments);
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
     * Remove Tangible Asset from Treatment
     * @param treatment
     * @param ta
     * @returns {boolean}
     */
    this.removeTaFromTreatment = function (treatment, ta) {
        if (_.isUndefined(treatment.taRelations)) return false;
        var taPos = _.indexOf(treatment.taRelations, ta);
        if (taPos > -1) {
            treatment.taRelations.splice(taPos, 1);
            return;
        }
    };

}]);

