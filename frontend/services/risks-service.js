/**
 * Created by Jordi Aranda.
 * 17/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('RisksService', ['flash', 'localStorageService', 'ArangoDBService', function(flash, localStorageService, ArangoDBService){

    var risks = [];

    var risksLikelihoodConsequenceFromStorage = localStorageService.get('simpleRisksLikelihoodConsequence') || {};
    var risksLikelihoodConsequence = risksLikelihoodConsequenceFromStorage;                                                                     //Likelihood/consequences values for each risk (as a whole) of the form
                                                                                                                                                //riskname_likelihood/riskname_consequence

    var risksTALikelihoodConsequenceFromStorage = localStorageService.get('multipleRisksLikelihoodConsequence') || {};
    var risksTALikelihoodConsequence = risksTALikelihoodConsequenceFromStorage;                                                                 //Likelihood/consequences values for each TA and risk of the form
                                                                                                                                                //riskname_taAssetName_likelihood/riskname_taAssetName_consequence

    var risksLikelihoodConsequenceAcceptanceFromStorage = localStorageService.get('simpleRisksLikelihoodConsequenceAcceptance') || {};          //Likelihood/consequence acceptance values for each risk (as a whole) of the form
    var risksLikelihoodConsequenceAcceptance = risksLikelihoodConsequenceAcceptanceFromStorage;                                                 //riskname_likelihood_acceptance/riskname_consequence_acceptance

    var risksTALikelihoodConsequenceAcceptanceFromStorage = localStorageService.get('multipleRisksLikelihoodConsequenceAcceptance') || {};      //Likelihood/consequences acceptance values for each TA and risk of the form
    var risksTALikelihoodConsequenceAcceptance = risksTALikelihoodConsequenceAcceptanceFromStorage;                                             //riskname_taAssetName_likelihood_acceptance/riskname_taAssetName_consequence_acceptance

    var unacceptableRisks = {};                                                                                                                 //List of unacceptable risks per tangible asset

    var loadingDataFromLocalStorage = false;                                                                                                    //Flag to control local storage restore state

    var SEPARATOR = '/';

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
        //console.log('adding risk likelihood for ' + riskName + ' in simple model');
        risksLikelihoodConsequence[riskName + SEPARATOR + 'likelihood'] = parseInt(likelihood);
    };

    /**
     * Removes likelihood/consequence values and acceptance values
     * for a given risk. This implies clearing both simple and multiple
     * models and acceptance models.
     * @param riskName The risk name.
     */
    this.removeRiskLikelihoodConsequence = function(riskName){
        //clear simple/multiple models
        var regex = new RegExp(riskName + '[\\w\\s]*', 'i');
        for(key in risksLikelihoodConsequence){
            if(regex.exec(key)){
                delete risksLikelihoodConsequence[key];
            }
        };
        for(key in risksTALikelihoodConsequence){
            if(regex.exec(key)){
                delete risksTALikelihoodConsequence[key];
            }
        };
    };

    /**
     * Adds a new consequence value for a given risk.
     * @param riskName The risk name.
     * @param consequence The consequence value of that risk.
     */
    this.addRiskConsequence = function(riskName, consequence){
        //console.log('adding risk consequence for ' + riskName + ' in simple model');
        risksLikelihoodConsequence[riskName + SEPARATOR + 'consequence'] = parseInt(consequence);
    };

    /**
     * Adds a new likelihood value for a given tangible asset risk.
     * @param riskName The risk name.
     * @param taAssetId The tangible asset id.
     * @param likelihood The likelihood value.
     */
    this.addRiskTALikelihood = function(riskName, taAssetId, likelihood){
        //console.log('adding risk likelihood for ' + riskName + '/' + taAssetId + ' in multiple model');
        risksTALikelihoodConsequence[riskName + SEPARATOR + taAssetId + SEPARATOR + 'likelihood'] = parseInt(likelihood);
    };

    /**
     * Adds a new consequence value for a given tangible asset risk.
     * @param riskName The risk name.
     * @param taAssetId The tangible asset id.
     * @param consequence The consequence value.
     */
    this.addRiskTAConsequence = function(riskName, taAssetId, consequence){
        //console.log('adding risk consequence for ' + riskName + '/' + taAssetId + ' in multiple model');
        risksTALikelihoodConsequence[riskName + SEPARATOR + taAssetId + SEPARATOR + 'consequence'] = parseInt(consequence);
    };

    /**
     * Removes both likelihood/consequence values for a given tangible asset risk.
     * @param taAssetId The tangible asset id.
     */
    this.removeRiskTALikelihoodConsequence = function(taAssetId){
        // clear multiple model
        var regex = new RegExp('[\\w\\s]+' + SEPARATOR + taAssetId + SEPARATOR + '[\\w\\s]+', 'i');
        for(key in risksTALikelihoodConsequence){
            if(regex.exec(key)){
                //console.log('removing key ' + key + ' in multiple model');
                delete risksTALikelihoodConsequence[key];
            }
        };
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

    /**
     * Sets the risks to that ones loaded from local storage.
     * @param risksLoadedFromLocalStorage Local storage risks.
     */
    this.setRisks = function(risksLoadedFromLocalStorage){
        risks = risksLoadedFromLocalStorage;
    };

    /**
     * Sets the simple risk model to that one loaded from local storage.
     * @param simpleRisksLikelihoodConsequenceLoadedFromLocalStorage Local
     * storage simple risk model.
     */
    this.setSimpleRisksLikelihoodConsequence = function(simpleRisksLikelihoodConsequenceLoadedFromLocalStorage){
        risksLikelihoodConsequence = simpleRisksLikelihoodConsequenceLoadedFromLocalStorage;
    };

    /**
     * Sets the multiple risk model to that one loaded from local storage.
     * @param multipleRisksLikelihoodConsequenceLoadedFromLocalStorage Local
     * storage multiple risk model.
     */
    this.setMultipleRisksLikelihoodConsequence = function(multipleRisksLikelihoodConsequenceLoadedFromLocalStorage){
        risksTALikelihoodConsequence = multipleRisksLikelihoodConsequenceLoadedFromLocalStorage;
    };

    /**
     * Sets a flag indicating local storage data is being loaded.
     * @param loading A boolean indicating the loading state.
     */
    this.loadingLocalStorageData = function(loading){
        loadingDataFromLocalStorage = loading;
    };

    /**
     * Whether local storage data is being loaded or not.
     * @returns {boolean}
     */
    this.isLoadingLocalStorageData = function(){
        return loadingDataFromLocalStorage;
    };

    /**
     * Retrieves a certain risk likelihood.
     * @param riskName The risk name to look up.
     * @param taAssetId The technical asset associated to the risk, if specified.
     */
    this.getRiskLikelihoodValue = function(riskName, taAssetId){
        if(taAssetId){
            // Multiple likelihood/consequence model
            return risksTALikelihoodConsequence[riskName + SEPARATOR + taAssetId + SEPARATOR + 'likelihood'];
        } else {
            // Simple likelihood/consequence model
            return risksLikelihoodConsequence[riskName + SEPARATOR + 'likelihood'];
        }
    };

    /**
     * Retrieves a certain risk consequence.
     * @param riskName The risk name to look up.
     * @param taAssetId The technical asset associated to the risk, if specified.
     */
    this.getRiskConsequenceValue = function(riskName, taAssetId){
        if(taAssetId){
            // Multiple likelihood/consequence model
            return risksTALikelihoodConsequence[riskName + SEPARATOR + taAssetId + SEPARATOR + 'consequence'];
        } else {
            // Simple likelihood/consequence model
            return risksLikelihoodConsequence[riskName + SEPARATOR + 'consequence'];
        }
    };

    /**
     * Retrieves the likelihood/consequence values for a risk/taAsset.
     */
    this.getLikelihoodAndConsequenceValues = function(riskName, taAssetId){
        if(taAssetId){
            return {likelihood: risksTALikelihoodConsequence[riskName + SEPARATOR + taAssetId + SEPARATOR + 'likelihood'], consequence: risksTALikelihoodConsequence[riskName + SEPARATOR + taAssetId + SEPARATOR + 'consequence']};
        } else {
            return {likelihood: risksLikelihoodConsequence[riskName + SEPARATOR + 'likelihood'], consequence: risksLikelihoodConsequence[riskName + SEPARATOR + 'consequence']};
        }
    };

    this.addUnacceptableRisk = function(taAssetId, riskName){
        var aux = unacceptableRisks[taAssetId];
        if(aux){
            if(aux.filter(function(risk){
                return risk == riskName
            }).length > 0){
                return;
            } else {
                unacceptableRisks[taAssetId].push(riskName);
            }
        } else {
            unacceptableRisks[taAssetId] = [];
            unacceptableRisks[taAssetId].push(riskName);
        }
    };

    this.removeUnacceptableRisk = function(taAssetId, riskName){
        if(unacceptableRisks[taAssetId]){
            var index = -1;
            _.each(unacceptableRisks, function(risk, i){
                if(risk == riskName) {
                    index = i;
                }
            });
            if(index !== -1){
                unacceptableRisks[taAssetId].splice(index, 1);
            }
        }
    };

    this.removeTAUnacceptableRisks = function(taAssetId){
        delete unacceptableRisks[taAssetId];
    };

    this.getTAUnacceptableRisks = function(taAssetId){
        return unacceptableRisks[taAssetId] ? unacepptableRisks[taAssetId] : [];
    };

    this.getUnacceptableRisks = function(){
        return unacceptableRisks;
    };

    this.getSeparator = function(){
        return SEPARATOR;
    };

}]);
