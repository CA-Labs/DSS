/**
 * Created by Jordi Aranda.
 * 17/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('RisksService', ['flash', function(flash){

    var risks = [];                             //The list of selected risks by the user.

    var risksLikelihoodConsequence = {};            //Likelihood/consequences values for each risk (as a whole) of the form
                                                //riskname_likelihood/riskname_consequence

    var risksTALikelihoodConsequence = {};          //Likelihood/consequences values for each TA and risk of the form
                                                //riskname_taAssetName_likelihood/riskname_taAssetName_consequence


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

    this.addRiskLikelihood = function(riskName, likelihood){
        console.log('adding risk likelihood...');
        risksLikelihoodConsequence[riskName + '_likelihood'] = likelihood;
    };

    this.addRiskConsequence = function(riskName, consequence){
        console.log('adding risk consequence...');
        risksLikelihoodConsequence[riskName + '_consequence'] = consequence;
    };

    this.addRiskTALikelihood = function(riskName, taAssetName, likelihood){
        console.log('adding risk TA likelihood');
        risksTALikelihoodConsequence[riskName + '_' + taAssetName+ '_likelihood'] = likelihood;
    };

    this.addRiskTAConsequence = function(riskName, taAssetName, consequence){
        console.log('adding risk TA consequence');
        risksTALikelihoodConsequence[riskName + '_' + taAssetName+ '_consequence'] = consequence;
    };

    this.getRisksLikelihoodConsequence = function(){
        return risksLikelihoodConsequence;
    };

    this.getRisksTALikelihoodConsequence = function(){
        return risksTALikelihoodConsequence;
    };

}]);
