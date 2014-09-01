/**
 * Created by Jordi Aranda.
 * 02/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('AssetsService', ['flash', '$q', '$rootScope', 'localStorageService', function(flash, $q, $rootScope, localStorageService){

    //BSOIA assets
    var bsoiaFromStorage = localStorageService.get('bsoiaAssetsSelected');
    var bsoia = (!_.isNull(bsoiaFromStorage)) ? bsoiaFromStorage : [];          //BSOIA assets selected by the user
    //TOIA assets
    var toiaFromStorage = localStorageService.get('toiaAssetsSelected');
    var toia = (!_.isNull(toiaFromStorage)) ? toiaFromStorage : [];             //TOIA assets selected by the user
    //TA assets
    var taFromStorage = localStorageService.get('ta');
    var ta = (!_.isNull(taFromStorage)) ? taFromStorage : [];                   //TA assets selected by the user

    var loadingDataFromLocalStorage = false;                                    //Flag to control local storage restore state

    /**
     * Adds an asset to the list of selected
     * BSOIA assets.
     * @param bsoiaAsset The selected asset to add.
     */
    this.addBSOIA = function(bsoiaAsset){
        if(bsoiaAsset === null || typeof bsoiaAsset === 'undefined'){
            flash.warn = 'No BSOIA was selected';
            return;
        }
        //Check asset doesn't already exists
        var exists = bsoia.filter(function(asset){
            return asset.name === bsoiaAsset.name;
        }).length > 0;
        if(!exists){
            bsoia.push(bsoiaAsset);
        } else {
            flash.warn = 'This asset has been already added!';
        }
    };

    /**
     * Removes an asset from the list of
     * selected BSOIA assets.
     * @param bsoiaAsset The asset to be removed.
     */
    this.removeBSOIA = function(bsoiaAsset){
        var index = -1;
        _.each(bsoia, function(asset, assetIndex){
            if(asset.name == bsoiaAsset.name){
                index = assetIndex;
            }
        });
        if(index >= 0) bsoia.splice(index, 1);
    };

    /**
     * Retrieves the current BSOIA assets
     * selected by the user.
     * @returns {Array}
     */
    this.getBSOIA = function(){
        return bsoia;
    };

    /**
     * Sets the current BSOIA assets, loading them from
     * local storage.
     * @param bsoiaLoadedFromLocalStorage The BSOIA assets to
     * be set.
     */
    this.setBSOIA = function(bsoiaLoadedFromLocalStorage){
        bsoia = bsoiaLoadedFromLocalStorage;
    };

    /**
     * Adds an asset to the list of selected
     * TOIA assets.
     * @param toiaAsset The selected asset to add.
     */
    this.addTOIA = function(toiaAsset){
        if(toiaAsset === null || typeof toiaAsset === 'undefined'){
            flash.warn = 'No TOIA was selected';
            return;
        }
        //Check asset doesn't already exists
        var exists = toia.filter(function(asset){
            return asset.asset.name === toiaAsset.name;
        }).length > 0;
        if(!exists){
            toia.push({asset: toiaAsset, bsoiaRelations: []});
        } else {
            flash.warn = 'This asset has been already added!';
        }
    };

    /**
     * Removes an asset from the list of
     * selected TOIA assets.
     * @param toiaAsset The asset to be removed.
     */
    this.removeTOIA = function(toiaAsset){
        var index = -1;
        _.each(toia, function(asset, assetIndex){
            if(asset.asset.name == toiaAsset.asset.name){
                index = assetIndex;
            }
        });
        if(index >= 0) toia.splice(index, 1);
    };

    /**
     * Retrieves the current TOIA assets
     * selected by the user.
     * @returns {Array}
     */
    this.getTOIA = function(){
        return toia;
    };

    /**
     * Sets the current TOIA assets, loading them from
     * local storage.
     * @param toiaLoadedFromLocalStorage The TOIA assets to
     * be set.
     */
    this.setTOIA = function(toiaLoadedFromLocalStorage){
        toia = toiaLoadedFromLocalStorage;
    };

    /**
     * Checks if exists a TOIA by name.
     * @param toiaAssetName The name of the TOIA.
     */
    this.existsTOIAByName = function(toiaAssetName){
        return toia.filter(function(asset, i){
            return asset.asset.name == toiaAssetName;
        }).length > 0;
    };

    /**
     * Checks if it exists a relation between
     * a BSOIA and TOIA.
     * @param bsoiaAssetName The name of the BSOIA.
     * @param toiaAssetName The name of the TOIA.
     * @returns {boolean}
     */
    this.existsBSOIAinTOIA = function(bsoiaAssetName, toiaAssetName){
        var toiaAux = toia.filter(function(asset, i){
            return asset.asset.name == toiaAssetName;
        });
        if(toiaAux.length < 1){
            return false;
        } else {
            return toiaAux[0].bsoiaRelations.filter(function(relation, j){
                return relation.name == bsoiaAssetName;
            }).length > 0;
        }
    };

    /**
     * Removes a BSOIA asset from the list
     * of relations included in a TOIA asset.
     * @param bsoiaAssetName The BSOIA asset
     * name to be removed.
     * @param toiaAssetName The TOIA asset that
     * contains the BSOIA relations.
     */
    this.removeBSOIAfromTOIA = function(bsoiaAssetName, toiaAssetName){
        var toiaIndex = -1;
        _.each(toia, function(asset, i){
            if(asset.asset.name == toiaAssetName){
                toiaIndex = i;
            }
        });
        if(toiaIndex < 0){
            flash.error = toiaAssetName + ' does not exist';
            return;
        } else {
            var bsoiaIndex = -1;
            _.each(toia[toiaIndex].bsoiaRelations, function(relation, j){
                if(relation.name == bsoiaAssetName){
                    bsoiaIndex = j;
                }
            });
            if(bsoiaIndex >= 0){
                toia[toiaIndex].bsoiaRelations.splice(bsoiaIndex, 1);
            }
        }
    };

    /**
     * Checks if a BSOIA asset has ever been linked
     * to some TOIA asset.
     * @param bsoiaAssetName The name of the BSOIA
     * asset.
     * @returns {boolean}
     * @constructor
     */
    this.isBSOIALinked = function(bsoiaAssetName){
        return toia.filter(function(asset){
            return asset.bsoiaRelations.filter(function(relation){
                return relation.name == bsoiaAssetName;
            }).length > 0;
        }).length > 0;
    };

    /**
     * Updates a TOIA by TOIA name.
     * @param toiaAssetName The name of the TOIA asset.
     * @param toiaAsset The TOIA asset with the update.
     */
    this.updateTOIAbyName = function(toiaAssetName, toiaAsset){
        var index = -1;
        _.each(toia, function(asset, i){
            if(asset.asset.name == toiaAssetName){
                index = i;
            }
        });
        if(index >= 0){
            toia[index] = toiaAsset;
        }
    };

    /**
     * Adds an asset to the list of selected
     * TA assets.
     * @param taAsset The asset to be added.
     */
    this.addTA = function(taAsset){
        if(taAsset === null || typeof taAsset === 'undefined'){
            flash.warn = 'No TA were selected';
        } else {
            //Check asset doesn't already exist
            var exists = ta.filter(function(asset, index){
                return asset._id == taAsset._id;
            }).length > 0;
            if(!exists){
                ta.push(taAsset);
            } else {
                flash.warn = 'This asset has been already added';
            }
        }
    };

    /**
     * Removes an asset from the list of selected
     * TA assets.
     * @param taAsset The asset to be removed.
     */
    this.removeTA = function(taAsset){
        var index = -1;
        _.each(ta, function(asset, assetIndex){
            if(asset._id == taAsset._id){
                index = assetIndex;
            }
        });
        if(index >= 0) ta.splice(index, 1);
    };

    /**
     * Retrieves the current selected TA assets.
     * @returns {Array}
     */
    this.getTA = function(){
        return ta;
    };

    /**
     * Sets the current TA assets, loading them from
     * local storage.
     * @param taLoadedFromLocalStorage The TA assets to
     * be set.
     */
    this.setTA = function(taLoadedFromLocalStorage) {
        ta = taLoadedFromLocalStorage;
    };

    this.loadResourcesFromXML = function(file){
        var fileReader = new FileReader();
        var deferred = $q.defer();
        var xmlString = fileReader.readAsText(file);
        fileReader.onload = function(){
            deferred.resolve(fileReader.result);
        };
        return deferred.promise;
    };

    /**
     * Sets a flag indicating local storage data is being
     * loaded.
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

}]);
