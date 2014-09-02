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

    var loadingDataFromLocalStorage = false;                                                                                                    //Flag to control local storage restore state

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

    this.addRiskLikelihoodAcceptance = function(riskName, likelihood){
        risksLikelihoodConsequenceAcceptance[riskName + '_likelihood_acceptance'] = parseInt(likelihood);
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
        //clear simple/multiple acceptance models
        for(key in risksLikelihoodConsequenceAcceptance){
            if(regex.exec(key)){
                delete risksLikelihoodConsequenceAcceptance[key];
            }
        };
        for(key in risksTALikelihoodConsequenceAcceptance){
            if(regex.exec(key)){
                delete risksTALikelihoodConsequenceAcceptance[key];
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

    this.addRiskConsequenceAcceptance = function(riskName, consequence){
        risksLikelihoodConsequenceAcceptance[riskName + '_consequence_acceptance'] = parseInt(consequence);
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

    this.addRiskTaLikelihoodAcceptance = function(riskName, taAssetName, likelihood){
        risksTALikelihoodConsequenceAcceptance[riskName + '_' + taAssetName + '_likelihood_acceptance'] = parseInt(likelihood);
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

    this.addRiskTAConsequenceAcceptance = function(riskName, taAssetName, consequence){
        risksTALikelihoodConsequenceAcceptance[riskName + '_' + taAssetName + '_consequence_acceptance'] = parseInt(consequence);
    };

    /**
     * Removes both likelihood/consequence values for a given tangible asset risk.
     * @param taAssetName The tangible asset name.
     */
    this.removeRiskTALikelihoodConsequence = function(taAssetName){
        // clear multiple model
        var regex = new RegExp('[\\w\\s]+_' + taAssetName + '_[\\w\\s]+', 'i');
        for(key in risksTALikelihoodConsequence){
            if(regex.exec(key)){
                //console.log('removing key ' + key + ' in multiple model');
                delete risksTALikelihoodConsequence[key];
            }
        };
        // clear multiple acceptance model
        regex = new RegExp('[\\w\\s]+_' +  taAssetName + '_[\\w\\s]+_[\\w\\s]+', 'i');
        for(key in risksTALikelihoodConsequenceAcceptance){
            if(regex.exec(key)){
                delete risksTALikelihoodConsequenceAcceptance[key];
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

    this.getRisksLikelihoodConsequenceAcceptance = function(){
        return risksLikelihoodConsequenceAcceptance;
    }

    /**
     * Retrieves the multiple model risk values (likelihood and consequence).
     * @returns {{}}
     */
    this.getRisksTALikelihoodConsequence = function(){
        return risksTALikelihoodConsequence;
    };

    this.getRisksTALikelihoodConsequenceAcceptance = function(){
        return risksTALikelihoodConsequenceAcceptance;
    }

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

    this.setSimpleRisksLikelihoodConsequenceAcceptance = function(simpleRisksLikelihoodConsequenceAcceptanceLoadedFromLocalStorage){
        risksLikelihoodConsequenceAcceptance = simpleRisksLikelihoodConsequenceAcceptanceLoadedFromLocalStorage;
    };

    /**
     * Sets the multiple risk model to that one loaded from local storage.
     * @param multipleRisksLikelihoodConsequenceLoadedFromLocalStorage Local
     * storage multiple risk model.
     */
    this.setMultipleRisksLikelihoodConsequence = function(multipleRisksLikelihoodConsequenceLoadedFromLocalStorage){
        risksTALikelihoodConsequence = multipleRisksLikelihoodConsequenceLoadedFromLocalStorage;
    };

    this.setMultipleRisksLikelihoodConsequenceAcceptance = function(multipleRisksLikelihoodConsequenceAcceptanceLoadedFromLocalStorage){
        risksTALikelihoodConsequenceAcceptance = multipleRisksLikelihoodConsequenceAcceptanceLoadedFromLocalStorage;
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
     * @param taAssetName The technical asset associated to the risk, if specified.
     */
    this.getRiskLikelihoodValue = function(riskName, taAssetName){
        if(taAssetName){
            // Multiple likelihood/consequence model
            return risksTALikelihoodConsequence[riskName + '_' + taAssetName + '_likelihood'];
        } else {
            // Simple likelihood/consequence model
            return risksLikelihoodConsequence[riskName + '_likelihood'];
        }
    };

    this.getRiskLikelihoodAcceptanceValue = function(riskName, taAssetName){
        if(taAssetName){
            // Multiple likelihood/consequence model
            return risksTALikelihoodConsequenceAcceptance[riskName + '_' + taAssetName + '_likelihood_acceptance'];
        } else {
            // Simple likelihood/consequence model
            return risksLikelihoodConsequenceAcceptance[riskName + '_likelihood_acceptance'];
        }
    };

    /**
     * Retrieves a certain risk consequence.
     * @param riskName The risk name to look up.
     * @param taAssetName The technical asset associated to the risk, if specified.
     */
    this.getRiskConsequenceValue = function(riskName, taAssetName){
        if(taAssetName){
            // Multiple likelihood/consequence model
            return risksTALikelihoodConsequence[riskName + '_' + taAssetName + '_consequence'];
        } else {
            // Simple likelihood/consequence model
            return risksLikelihoodConsequence[riskName + '_consequence'];
        }
    };

    this.getRiskConsequenceAcceptanceValue = function(riskName, taAssetName){
        if(taAssetName){
            // Multiple likelihood/consequence model
            return risksTALikelihoodConsequenceAcceptance[riskName + '_' + taAssetName + '_consequence_acceptance'];
        } else {
            // Simple likelihood/consequence model
            return risksLikelihoodConsequenceAcceptance[riskName + '_consequence_acceptance'];
        }
    };

    /**
     * Computes the related risk value.
     * @param riskName The risk value to look up.
     * @param taAssetName The TA asset associated to it, if specified.
     * @returns {number}
     */
    /*
    this.getRiskValue = function(riskName, taAssetName) {
        if(taAssetName){
            return Math.ceil(this.getRiskLikelihoodValue(riskName, taAssetName)/10 * this.getRiskConsequenceValue(riskName, taAssetName));
        } else {
            return Math.ceil(this.getRiskLikelihoodValue(riskName)/10 * this.getRiskConsequenceValue(riskName));
        }
    };
    */

}]);
