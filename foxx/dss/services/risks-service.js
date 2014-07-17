/**
 * Created by Jordi Aranda.
 * 17/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('RisksService', ['flash', function(flash){

    var risks = [];                             //The list of selected risks by the user.

    var singleLikelihoodConsequence = [];       // An array of likelihood/consequences values (object with two keys), when
                                                // risks must be evaluated as a whole and not per TA.
                                                // The size of this array should be size(risks).

    var multipleLikelihoodConsequence = [];     // An array of arrays of likelihood/consequences values (object with two keys),
                                                // for each TA and risk. The size of this array should be size(risks)*size(TA).
    /**
     * Adds a risk to the list of selected risks.
     * @param risk The risk to be added.
     */
    this.addRisk = function(risk){
        if(risk === null || typeof risk === 'undefined'){
            flash.warn = 'No risk was selected';
        } else {
            //Check risk doesn't already exist
            var exists = risks.filter(function(r, riskIndex){
                return risk.destination.name == r.destination.name;
            }).length > 0;
            if(!exists){
                risks.push(risk);
            } else {
                flash.warn = 'This risk has been already added';
            }
        }
    };

    /**
     * Removes a risk from the list of selected risks.
     * @param risk The risk to be removed.
     */
    this.removeRisk = function(risk){
        var index = -1;
        _.each(risks, function(r, riskIndex){
            if(risk.destination.name == r.destination.name){
                index = riskIndex;
            }
        });
        if(index >= 0) risks.splice(index, 1);
    };

    /**
     * Retrieves the list of selected risks.
     * @returns {Array}
     */
    this.getRisks = function(){
        return risks;
    };

    this.addSingleLikelihoodConsequence = function(likelihood, consequence){
        var newEntry = {likelihood: likelihood, consequence: consequence};
        singleLikelihoodConsequence.push(newEntry);
    };

    /**
     * Removes likelihood/consequence values for
     * @param index
     */
    this.removeSingleLikelihoodConsequence = function(index){
        if(index < 0 || singleLikelihoodConsequence.length == 0) {
            flash.error = 'Invalid likelihood/consequence value to be removed.'
            return;
        } else {
            if(index < singleLikelihoodConsequence){
                singleLikelihoodConsequence.splice(index, 1);
            } else {
                flash.error = 'Invalid likelihood/consequence value to be removed (index out of bound)';
            }
        }
    };

    this.getSingleLikelihoodConsequence = function(){
        return singleLikelihoodConsequence;
    }

}]);
