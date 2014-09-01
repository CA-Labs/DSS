/**
 * Created by Jordi Aranda.
 * 22/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('TreatmentsService', ['flash', 'localStorageService', function(flash, localStorageService){

    var treatmentsFromStorage = localStorageService.get('treatmentsSelected') || [];
    var treatments = treatmentsFromStorage;

    var treatmentsValuesFromStorage = localStorageService.get('treatmentValues') || {};
    var treatmentsValues = treatmentsValuesFromStorage;         // Treatments values model used to store select/sliders/radio UI components values

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
                return treatment.destination.name == t.destination.name;
            }).length > 0;
            if(!exists){
                treatments.push(treatment);
            } else {
                flash.warn = 'This treatment has been already added';
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
            if(treatment.destination.name == t.destination.name){
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
    }

}]);

