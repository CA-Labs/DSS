/**
 * Created by Jordi Aranda.
 * 17/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('RisksService', ['flash', 'localStorageService', 'ArangoDBService', function(flash, localStorageService, ArangoDBService){

    var risks = [];

    var risksLikelihoodConsequenceFromStorage = localStorageService.get('simpleRisksLikelihoodConsequence') || {};                              //Likelihood/consequences values for each risk (as a whole) of the form
    var risksLikelihoodConsequence = risksLikelihoodConsequenceFromStorage;                                                                     //riskname_likelihood/riskname_consequence

    var risksTALikelihoodConsequenceFromStorage = localStorageService.get('multipleRisksLikelihoodConsequence') || {};                          //Likelihood/consequences values for each TA and risk of the form
    var risksTALikelihoodConsequence = risksTALikelihoodConsequenceFromStorage;                                                                 //riskname_taAssetName_likelihood/riskname_taAssetName_consequence

    var riskBoundModelsFromStorage = localStorageService.get('riskBoundModels') || {};                                                          //Risk bound models
    var riskBoundModels = riskBoundModelsFromStorage;

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
        risksLikelihoodConsequence[riskName + SEPARATOR + 'consequence'] = parseInt(consequence);
    };

    /**
     * Adds a new likelihood value for a given tangible asset risk.
     * @param riskName The risk name.
     * @param taAssetId The tangible asset id.
     * @param likelihood The likelihood value.
     */
    this.addRiskTALikelihood = function(riskName, taAssetId, likelihood){
        risksTALikelihoodConsequence[riskName + SEPARATOR + taAssetId + SEPARATOR + 'likelihood'] = parseInt(likelihood);
    };

    /**
     * Adds a new consequence value for a given tangible asset risk.
     * @param riskName The risk name.
     * @param taAssetId The tangible asset id.
     * @param consequence The consequence value.
     */
    this.addRiskTAConsequence = function(riskName, taAssetId, consequence){
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
            if(regex.exec(key)){;
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
        angular.copy(risksLoadedFromLocalStorage, risks);
    };

    /**
     * Sets the simple risk model to that one loaded from local storage.
     * @param simpleRisksLikelihoodConsequenceLoadedFromLocalStorage Local
     * storage simple risk model.
     */
    this.setSimpleRisksLikelihoodConsequence = function(simpleRisksLikelihoodConsequenceLoadedFromLocalStorage){
        angular.copy(simpleRisksLikelihoodConsequenceLoadedFromLocalStorage, risksLikelihoodConsequence);
    };

    /**
     * Sets the multiple risk model to that one loaded from local storage.
     * @param multipleRisksLikelihoodConsequenceLoadedFromLocalStorage Local
     * storage multiple risk model.
     */
    this.setMultipleRisksLikelihoodConsequence = function(multipleRisksLikelihoodConsequenceLoadedFromLocalStorage){
        angular.copy(multipleRisksLikelihoodConsequenceLoadedFromLocalStorage, risksTALikelihoodConsequence);
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

    /**
     * Adds a new unacceptable risk to the list of unacceptable risks
     * for a given TA asset.
     * @param taAssetId The id of the TA asset.
     * @param riskName The unnaceptable risk name to be added.
     */
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

    /**
     * Removes an unacceptable risk form the list of unacceptable risks
     * for a given TA asset.
     * @param taAssetId The if of the TA asset.
     * @param riskName The unacceptable risk name to be removed.
     */
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

    /**
     * Removes all unacceptable risks for a given TA asset.
     * @param taAssetId The id of the TA asset.
     */
    this.removeTAUnacceptableRisks = function(taAssetId){
        delete unacceptableRisks[taAssetId];
    };

    /**
     * Returns the list of unacceptable risks for a given TA asset.
     * @param taAssetId The id of the TA asset.
     * @returns {*}
     */
    this.getTAUnacceptableRisks = function(taAssetId){
        return unacceptableRisks[taAssetId] ? unacceptableRisks[taAssetId] : [];
    };

    /**
     * Returns all unacceptable risks (by TA asset id).
     * @returns {{}}
     */
    this.getUnacceptableRisks = function(){
        return unacceptableRisks;
    };

    /**
     * Removes all unacceptable risks.
     */
    this.clearUnacceptableRisks = function(){
        _.each(unacceptableRisks, function(values, key){
            unacceptableRisks[key] = [];
        });
    };

    /**
     * Returns the risk sliders bound model.
     * @returns {*|{}}
     */
    this.getRiskBoundModels = function(){
        return riskBoundModels;
    };

    /**
     * Sets the risk sliders model loading it from
     * local storage.
     * @param riskBoundModelsFromStorage The risk sliders model
     * to be loaded from local storage.
     */
    this.setRiskBoundModels = function(riskBoundModelsFromStorage){
        angular.copy(riskBoundModelsFromStorage, riskBoundModels);
    };

    /**
     * Returns true if a given risk is unacceptable for a certain TA
     * asset, false otherwise.
     * @param riskName The risk name.
     * @param taAssetId The id of the TA asset.
     * @returns {boolean}
     */
    this.isUnacceptable = function(riskName, taAssetId){
        var unacceptable = false;
        if(taAssetId){
            unacceptable = unacceptableRisks[taAssetId] !== undefined ? unacceptableRisks[taAssetId].indexOf(riskName) !== -1 : true;
            return unacceptable;
        } else {
            _.each(unacceptableRisks, function(value, key){
                if(value.indexOf(riskName) !== -1){
                    unacceptable = true;
                }
            });
        }
        return unacceptable;
    };

    this.getSeparator = function(){
        return SEPARATOR;
    };

}]);
