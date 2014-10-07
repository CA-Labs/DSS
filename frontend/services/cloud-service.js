/**
 * Created by Jordi Aranda.
 * 10/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('CloudService', ['AssetsService', 'RisksService', 'TreatmentsService', 'localStorageService', 'flash', function(AssetsService, RisksService, TreatmentsService, localStorageService, flash){

    var proposalsFromLocalStorage = localStorageService.get('proposals') || {};
    var proposals = proposalsFromLocalStorage;

    var filteredProposalsFromLocalStorage = localStorageService.get('filteredProposals') || {};
    var filteredProposals = filteredProposalsFromLocalStorage;

    var loadingProposals = false;
    var loadingFilteredProposals = true;

    var deploymentProposals = [];

    /**
     * Returns the list of initial proposals.
     * @returns {*|{}}
     */
    this.getProposals = function(){
        return proposals;
    };

    /**
     * Sets the list of initial proposals loaded
     * from local storage.
     * @param proposalsLoadedFromLocalStorage The
     * initial proposals to be loaded.
     */
    this.setProposals = function(proposalsLoadedFromLocalStorage){
        if(!angular.equals(proposals, proposalsLoadedFromLocalStorage)){
            angular.copy(proposalsLoadedFromLocalStorage, proposals);
        }
        loadingProposals = false;
    };

    /**
     * Sets a flag indicating whether the initial list of proposals is
     * being loaded or not.
     * @param loadingProposalsFromLocalStorage A boolean indicating the
     * proposals list loading state.
     */
    this.loadingProposals = function(loadingProposalsFromLocalStorage){
        loadingProposals = loadingProposalsFromLocalStorage;
    };

    /**
     * Returns true if the list of proposals is still being loaded,
     * false otherwise.
     * @returns {boolean}
     */
    this.isLoadingProposals = function(){
        return loadingProposals;
    };

    /**
     * Returns array of all possible permutations of the arguments.
     * @returns {Array}
     */
    this.cartesian = function () {
        var r = [], arg = arguments, max = arg.length-1;
        function helper(arr, i) {
            for (var j=0, l=arg[i].length; j<l; j++) {
                var a = arr.slice(0); // clone arr
                a.push(arg[i][j]);
                if (i==max) {
                    r.push(a);
                } else
                    helper(a, i+1);
            }
        }
        helper([], 0);
        return r;
    };

    /**
     * Sets a list of proposals for a given tangible asset.
     * @param ta The TA asset.
     * @param data The list of proposals for TA asset.
     */
    this.setTAProposals = function(ta, data){
        // console.log('Setting proposal for ta', ta.cloudType, data);
        switch(ta.cloudType){
            case 'IaaS':
                proposals[ta.cloudResource._serviceName] = data;
                break;
            case 'PaaS':
                proposals[ta.cloudPlatform._serviceName] = data;
                break;
            default:
                break;
        }
    };

    /**
     * Returns the list of filtered proposals.
     * @returns {*|{}}
     */
    this.getFilteredProposals = function(){
        return filteredProposals;
    };

    /**
     * Sets the list of filtered proposals loading them
     * from local storage.
     * @param filteredProposalsLoadedFromLocalStorage The
     * list of filtered proposals to be loaded.
     */
    this.setFilteredProposals = function(filteredProposalsLoadedFromLocalStorage){
        if(!angular.equals(filteredProposals, filteredProposalsFromLocalStorage)){
            angular.copy(filteredProposalsLoadedFromLocalStorage, filteredProposals);
        }
        loadingFilteredProposals = false;
    };

    /**
     * Sets a flag indicating whether the list of filtered proposals
     * has been loaded or not.
     * @param loadingFilteredProposalsFromLocalStorage A boolean indicating
     * filtered proposals list loading state.
     */
    this.loadingFilteredProposals = function(loadingFilteredProposalsFromLocalStorage){
        loadingFilteredProposals = loadingFilteredProposalsFromLocalStorage;
    };

    /**
     * Returns true if the list of filtered proposals is still being loaded,
     * false otherwise.
     * @returns {boolean}
     */
    this.isLoadingFilteredProposals = function(){
        return loadingFilteredProposals;
    };

    /**
     * Returns the list of proposals for a TA asset.
     * @param taAssetName The name of the TA asset.
     * @returns {*}
     */
    this.getTAProposals = function(taAssetName){
        if(filteredProposals[taAssetName]){
            return filteredProposals[taAssetName];
        } else {
            return [];
        }
    };

    /**
     * Given a TA assets list and a TA name, returns
     * the corresponding TA asset.
     * @param taList A list of TA ssets.
     * @param taName The name of the TA asset.
     * @returns {{}}
     */
    function getTA (taList, taName) {
        var returnTA = {};
        _.each(taList, function (ta) {
            switch (ta.cloudType) {
                case 'IaaS':
                    if (ta.cloudResource._serviceName == taName) {
                        returnTA = ta;
                    }
                    break;
                case 'PaaS':
                    if (ta.cloudPlatform._serviceName == taName) {
                        returnTA = ta;
                    }
                    break;
            }
        });

       return returnTA;
    }


    /**
     * Returns the final list of deployment proposals.
     * @returns {Array}
     */
    this.getDeploymentsProposals = function () {

        var taAssets = AssetsService.getTA();

        var argsArray = [];
        if (!_.isEmpty(filteredProposals)) {
            _.each(filteredProposals, function (proposal, taAssetName) {
                // attach ta to proposal
                for (var i = 0; i < proposal.length; i++) {
                    proposal[i].ta = getTA(taAssets, taAssetName);
                }
                argsArray.push(proposal);
            });

            // find deployments combinations
            deploymentProposals = this.cartesian.apply(null, argsArray);

            // calculate overall score
            _.each(deploymentProposals, function(proposal, index) {
                var numerator = 0.0;
                var denominator = 0.0;
                _.each(proposal, function (service) {
                    numerator += service.score;
                    denominator += service.total;
                });

                // calulate overallScore
                deploymentProposals[index].overallScore = (numerator/denominator) || 0.0;
            });
            return deploymentProposals;
        }
    };

    /**
     * Filters a list of proposals by treatments (i.e. for each
     * treatment, exists a path between the proposal and the
     * treatment).
     */
    this.filterProposalsByTreatments = function(){

        var taAssets = AssetsService.getTA();
        var treatments = TreatmentsService.getTreatments();
        // console.log('treatments in treatments filter', treatments);

        filteredProposals = {};
        var treatmentsFound = 0;
        _.each(taAssets, function(ta){
            var taProposals = [];
            var cloudType = ta.cloudType;
            var taName = '';
            switch(ta.cloudType){
                case 'IaaS':
                    taName = ta.cloudResource._serviceName;
                    break;
                case 'PaaS':
                    taName = ta.cloudPlatform._serviceName;
                    break;
                default:
                    break;
            }
            taProposals = proposals[taName];
            if(taProposals){
                _.each(taProposals, function(taProposal){
                    treatmentsFound = 0;
                    // Check if this proposal contains all treatments in its path
                    var taProposalCharacteristicNames = taProposal.characteristics.map(function(e){ return e.name });
                    _.each(treatments, function(treatment){
                        if(_.contains(taProposalCharacteristicNames, treatment.name)){
                            treatmentsFound++;
                        }
                    });
                    if(treatmentsFound == treatments.length){
                        if(filteredProposals[taName]){
                            filteredProposals[taName].push(taProposal);
                        } else {
                            filteredProposals[taName] = [];
                            filteredProposals[taName].push(taProposal);
                        }
                    }
                });
            }
        });

        // console.log('result after filter proposals by treatments', filteredProposals);

    };

    /**
     * Filters a list of proposals by threshold values (TA assets
     * criticity values).
     */
    this.filterProposalsByThresholds = function(){

        var treatments = TreatmentsService.getTreatments();
        // console.log('treatments in threshold filter', treatments);

        // Reset scores
        _.each(filteredProposals, function(proposals, taAssetName){
            _.each(proposals, function(proposal, index){
                filteredProposals[taAssetName][index].score = 0.0;
                filteredProposals[taAssetName][index].total = 0.0;
                filteredProposals[taAssetName][index].unmitigatedRisks = [];
            });
        });

        var riskNames = [];
        var riskMitigatedNames = [];

        /***************************************************************************************
         ***************************************************************************************
         ****** No treatments selected, all unacceptable risks are then unmitigated risks ******
         ***************************************************************************************
         ***************************************************************************************/

        if(treatments.length == 0){
            var unmitigatedRisks = [];
            var risksSelected = RisksService.getRisks();
            var unacceptableRisksPerTA = RisksService.getUnacceptableRisks();
            _.each(unacceptableRisksPerTA, function(risks, ta){
                _.each(risks, function(risk){
                    if(unmitigatedRisks.indexOf(risk) == -1){
                        unmitigatedRisks.push(risk);
                    }
                });
            });
            _.each(filteredProposals, function(proposals, taAssetName){
                _.each(proposals, function(proposal, index){
                    filteredProposals[taAssetName][index].unmitigatedRisks = unmitigatedRisks;
                    // If all risks are acceptable (i.e. there are no unacceptable risks), all services should have a score of 10
                    if(unmitigatedRisks.length == 0){
                        // Simulate a score of 10, i.e. score and total are equal
                        filteredProposals[taAssetName][index].score = 1;
                        filteredProposals[taAssetName][index].total = 1;
                    } else {
                        // flash.error = 'This should\'t occur since we don\'t allow having unacceptable risks without treatments for simplicity';
                        // console.error('There unacceptable risks and no treatment has been selected yet!');
                    }
                });
            });
            return;
        }

        /***************************************************************************************
         ***************************************************************************************
         *************************** Some treatments were selected *****************************
         ***************************************************************************************
         ***************************************************************************************/

        _.each(treatments, function(treatment){

            var treatmentName = treatment.name;
            var treatmentRisks = TreatmentsService.getRisksFromTreatment(treatmentName);

            _.each(treatmentRisks, function(riskName){

                // console.log('current treatment', treatmentName);
                // console.log('current risk', riskName);

                _.each(treatment.taRelations, function(ta, index){

                    // console.log('taRelation' + index, ta);
                    var criticityValue = TreatmentsService.showTreatmentValue(treatmentName) ? AssetsService.getInverseCriticityValue(TreatmentsService.getTreatmentValue(treatmentName)) : AssetsService.getTACriticityValue(ta._id);
                    // console.log('criticity value', criticityValue);

                    if(riskNames.indexOf(riskName) == -1) riskNames.push(riskName);

                    if(RisksService.isUnacceptable(riskName, ta._id)){

                        // console.log(riskName + '_' + ta._id + ' is unacceptable');

                        // Risk is unacceptable, check if service has some characteristic with a value below the criticity value
                        _.each(filteredProposals, function(proposals, taAssetName){
                            _.each(proposals, function(proposal, index){

                                if(proposal.service.cloudType == ta.cloudType){

                                    // console.log('Evaluating proposal ' + proposal.service.name);
                                    var characteristics = proposal.characteristics;
                                    var riskMitigated = false;

                                    _.each(characteristics, function(characteristic){
                                        // console.log('Current service characteristic is ' + characteristic.name + ' with value ' + AssetsService.getInverseCriticityValue(characteristic.value) + ' criticity value is ' + criticityValue);
                                        if(characteristic.name == treatmentName && AssetsService.getInverseCriticityValue(characteristic.value) <= criticityValue && !riskMitigated){

                                            // This characteristic is mitigating the risk
                                            riskMitigated = true;
                                            if(riskMitigatedNames.indexOf(riskName) == -1) {
                                                riskMitigatedNames.push(riskName);
                                            }
                                            if(filteredProposals[taAssetName][index].score){
                                                // console.log(characteristic.name + ' is mitigating risk ' + riskName);
                                                filteredProposals[taAssetName][index].score++;
                                                // console.log(filteredProposals[taAssetName][index].score)
                                            } else {
                                                // console.log(characteristic.name + ' is mitigating risk ' + riskName);
                                                filteredProposals[taAssetName][index].score = 1.0;
                                                // console.log(filteredProposals[taAssetName][index].score)
                                            }

                                        }
                                    });

                                    if(!riskMitigated){
                                        // Store what risks are unmitigated for that service
                                        if(filteredProposals[taAssetName][index].unmitigatedRisks){
                                            if(filteredProposals[taAssetName][index].unmitigatedRisks.indexOf(riskName) == -1){
                                                filteredProposals[taAssetName][index].unmitigatedRisks.push(riskName);
                                            }
                                        } else {
                                            filteredProposals[taAssetName][index].unmitigatedRisks = [];
                                            if(filteredProposals[taAssetName][index].unmitigatedRisks.indexOf(riskName) == -1){
                                                filteredProposals[taAssetName][index].unmitigatedRisks.push(riskName);
                                            }
                                        }
                                    }

                                }

                            });
                        });
                    } else {
                        // console.log(riskName + '_' + ta._id + ' is acceptable');
                        _.each(filteredProposals, function(proposals, taAssetName){
                            _.each(proposals, function(proposal, index){
                                if(proposal.service.cloudType == ta.cloudType){
                                    if(riskMitigatedNames.indexOf(riskName) == -1){
                                        riskMitigatedNames.push(riskName);
                                        // console.log('Incrementing score in service ' + proposal.service.name + ' for risk ' + riskName);
                                        if(filteredProposals[taAssetName][index].score){
                                            filteredProposals[taAssetName][index].score++;
                                        } else {
                                            filteredProposals[taAssetName][index].score = 1.0;
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            });
        });

        // Normalization
        _.each(filteredProposals, function(proposals, taAssetName){
            _.each(proposals, function(proposal, index){
                if(_.isNumber(proposal.score)){
                    filteredProposals[taAssetName][index].total = riskNames.length;
                } else {
                    filteredProposals[taAssetName][index].score = 0.0;
                    filteredProposals[taAssetName][index].total = riskNames.length;
                }
            });
        });

        // console.log('result after filter proposals by thresholds', filteredProposals);

    };

}]);
