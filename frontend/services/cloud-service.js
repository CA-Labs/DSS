/**
 * Created by Jordi Aranda.
 * 10/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('CloudService', ['AssetsService', 'RisksService', 'TreatmentsService', 'localStorageService', function(AssetsService, RisksService, TreatmentsService, localStorageService){

    var taAssets = AssetsService.getTA();

    var treatments = TreatmentsService.getTreatments();

    var proposalsFromLocalStorage = localStorageService.get('proposals') || {};
    var proposals = proposalsFromLocalStorage;

    var filteredProposalsFromLocalStorage = localStorageService.get('filteredProposals') || {};
    var filteredProposals = filteredProposalsFromLocalStorage;

    var loadingProposals = false;
    var loadingFilteredProposals = true;

    this.getProposals = function(){
        return proposals;
    };

    this.setProposals = function(proposalsLoadedFromLocalStorage){
        proposals = proposalsLoadedFromLocalStorage;
        loadingProposals = false;
    };

    this.loadingProposals = function(loadingProposalsFromLocalStorage){
        loadingProposals = loadingProposalsFromLocalStorage;
    };

    this.isLoadingProposals = function(){
        return loadingProposals;
    };

    /**
     * returns array of all possible permutations of the arguments
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

    this.setTAProposals = function(ta, data){
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

    this.getFilteredProposals = function(){
        return filteredProposals;
    };

    this.setFilteredProposals = function(filteredProposalsLoadedFromLocalStorage){
        filteredProposals = filteredProposalsLoadedFromLocalStorage;
        loadingFilteredProposals = false;
    };

    this.loadingFilteredProposals = function(loadingFilteredProposalsFromLocalStorage){
        loadingFilteredProposals = loadingFilteredProposalsFromLocalStorage;
    };

    this.isLoadingFilteredProposals = function(){
        return loadingFilteredProposals;
    };

    this.getTAProposals = function(taAssetName){
        if(filteredProposals[taAssetName]){
            return filteredProposals[taAssetName];
        } else {
            return [];
        }
    };

    this.filterProposalsByTreatments = function(){
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
    };

    this.filterProposalsByThresholds = function(){

        // Reset scores
        _.each(filteredProposals, function(proposals, taAssetName){
            _.each(proposals, function(proposal, index){
                filteredProposals[taAssetName][index].score = 0.0;
            });
        });

        var riskNames = [];

        _.each(treatments, function(treatment){

            var treatmentName = treatment.name;
            var treatmentRisks = TreatmentsService.getRisksFromTreatment(treatmentName);

            _.each(treatmentRisks, function(riskName){

                console.log('current treatment', treatmentName);
                console.log('current risk', riskName);
                riskNames.push(riskName);

                _.each(treatment.taRelations, function(ta, index){

                    console.log('taRelation' + index, ta);
                    var criticityValue = AssetsService.getTACriticityValue(ta._id);
                    console.log('criticity value', criticityValue);

                    if(RisksService.isUnacceptable(riskName, ta._id)){

                        console.log(riskName + '_' + ta._id + ' is unacceptable');
                        // Risk is unacceptable, check if service has some characteristic with a value below the criticity value
                        _.each(filteredProposals, function(proposals, taAssetName){
                            _.each(proposals, function(proposal, index){
                                if(proposal.service.cloudType == ta.cloudType){
                                    console.log('Evaluating proposal ' + proposal.service.name);
                                    var characteristics = proposal.characteristics;
                                    _.each(characteristics, function(characteristic){
                                        console.log('Current service characteristic is ' + characteristic.name + ' with value ' + AssetsService.getInverseCriticityValue(characteristic.value));
                                        if(characteristic.name == treatmentName && AssetsService.getInverseCriticityValue(characteristic.value) < criticityValue){
                                            // This characteristic is mitigating the risk
                                            if(filteredProposals[taAssetName][index].score){
                                                console.log(characteristic.name + ' is mitigating risk ' + riskName);
                                                filteredProposals[taAssetName][index].score++;
                                                console.log(filteredProposals[taAssetName][index].score)
                                            } else {
                                                console.log(characteristic.name + ' is mitigating risk ' + riskName);
                                                filteredProposals[taAssetName][index].score = 1.0;
                                                console.log(filteredProposals[taAssetName][index].score)
                                            }
                                            console.log('Incrementing score in service ' + proposal.service.name + ' for risk ' + riskName);
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        console.log(riskName + '_' + ta._id + ' is acceptable');
                        _.each(filteredProposals, function(proposals, taAssetName){
                            _.each(proposals, function(proposal, index){
                                if(proposal.service.cloudType == ta.cloudType){
                                    console.log('Incrementing score in service ' + proposal.service.name + ' for risk ' + riskName);
                                    if(filteredProposals[taAssetName][index].score){
                                        filteredProposals[taAssetName][index].score++;
                                    } else {
                                        filteredProposals[taAssetName][index].score = 1.0;
                                    }
                                }
                            });
                        });
                    }
                });
            });
        });

        // Normalization
        if(riskNames.length > 0){
            _.each(filteredProposals, function(proposals, taAssetName){
                _.each(proposals, function(proposal, index){
                    if(_.isNumber(proposal.score)){
                        filteredProposals[taAssetName][index].score = filteredProposals[taAssetName][index].score / (riskNames.length * 1.0);
                    } else {
                        filteredProposals[taAssetName][index].score = 0.0;
                    }
                });
            });
        }

        // console.log(filteredProposals);

    };

}]);
