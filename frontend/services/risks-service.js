/**
 * Created by Jordi Aranda.
 * 17/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('RisksService', ['flash', 'localStorageService', function(flash, localStorageService){

    var risks = [];

    var risksLikelihoodConsequence = {};        //Likelihood/consequences values for each risk (as a whole) of the form
                                                //riskname_likelihood/riskname_consequence

    var risksTALikelihoodConsequence = {};      //Likelihood/consequences values for each TA and risk of the form
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

    /**
     * Adds a new risk likelihood value for a given risk.
     * @param riskName The risk name.
     * @param likelihood The likelihood value of that risk.
     */
    this.addRiskLikelihood = function(riskName, likelihood){
        //console.log('adding risk likelihood in ' + riskName);
        risksLikelihoodConsequence[riskName + '_likelihood'] = parseInt(likelihood);
    };

    /**
     * Removes likelihood/consequence values for a given risk.
     * This implies clearing both simple and multiple models.
     * @param riskName The risk name.
     */
    this.removeRiskLikelihoodConsequence = function(riskName){
        //clear simple/multiple model
        var regex = new RegExp(riskName + '[\\w\\s]*', 'i');
        for(key in risksLikelihoodConsequence){
            if(regex.exec(key)){
                //console.log('removing key ' + key + ' in simple model');
                delete risksLikelihoodConsequence[key];
            }
        }
        for(key in risksTALikelihoodConsequence){
            if(regex.exec(key)){
                //console.log('removing key ' + key + ' in multiple model');
                delete risksTALikelihoodConsequence[key];
            }
        }
    };

    /**
     * Adds a new consequence value for a given risk.
     * @param riskName The risk name.
     * @param consequence The consequence value of that risk.
     */
    this.addRiskConsequence = function(riskName, consequence){
        //console.log('adding risk consequence for ' + riskName + ' in simple model');
        risksLikelihoodConsequence[riskName + '_consequence'] = parseInt(consequence);
    };

    /**
     * Adds a new likelihood value for a given tangible asset risk.
     * @param riskName The risk name.
     * @param taAssetName The tangible asset name.
     * @param likelihood The likelihood value.
     */
    this.addRiskTALikelihood = function(riskName, taAssetName, likelihood){
        //console.log('adding risk likelihood for ' + riskName + '/' + taAssetName + ' in multiple model');
        risksTALikelihoodConsequence[riskName + '_' + taAssetName + '_likelihood'] = parseInt(likelihood);
    };

    /**
     * Adds a new consequence value for a given tangible asset risk.
     * @param riskName The risk name.
     * @param taAssetName The tangible asset name.
     * @param consequence The consequence value.
     */
    this.addRiskTAConsequence = function(riskName, taAssetName, consequence){
        //console.log('adding risk consequence for ' + riskName + '/' + taAssetName + ' in multiple model');
        risksTALikelihoodConsequence[riskName + '_' + taAssetName + '_consequence'] = parseInt(consequence);
    };

    /**
     * Removes both likelihood/consequence values for a given tangible asset risk.
     * @param taAssetName The tangible asset name.
     */
    this.removeRiskTALikelihoodConsequence = function(taAssetName){
        //clear multiple model
        var regex = new RegExp('[\\w\\s]+_' + taAssetName + '_[\\w\\s]+', 'i');
        for(key in risksTALikelihoodConsequence){
            if(regex.exec(key)){
                //console.log('removing key ' + key + ' in multiple model');
                delete risksTALikelihoodConsequence[key];
            }
        }
    };

    /**
     * Retrieves the simple model risk values (likelihood and consequence).
     * @returns {{}}
     */
    this.getRisksLikelihoodConsequence = function(){
        return risksLikelihoodConsequence;
    };

    /**
     * Retrieves the multiple model risk values (likelihood and consequence).
     * @returns {{}}
     */
    this.getRisksTALikelihoodConsequence = function(){
        return risksTALikelihoodConsequence;
    };

}]);
