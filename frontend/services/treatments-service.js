/**
 * Created by Jordi Aranda.
 * 22/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('TreatmentsService', ['flash', function(flash){

    var treatments = [];            // Treatments selected by the user

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

}]);