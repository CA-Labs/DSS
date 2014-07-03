/**
 * Created by Jordi Aranda.
 * 02/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('AssetsService', ['flash', function(flash){

    //BSOIA assets
    var bsoia = [];     //BSOIA assets selected by the user
    //TOIA assets
    var toia = [];      //TOIA assets selected by the user

    /**
     * Adds an asset to the list of selected
     * BSOIA assets.
     * @param bsoiaAsset The selected asset to add.
     */
    this.addBSOIA = function(bsoiaAsset){
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
     * Adds an asset to the list of selected
     * TOIA assets.
     * @param toiaAsset The selected asset to add.
     */
    this.addTOIA = function(toiaAsset){
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
     * Checks if exists a TOIA by name.
     * @param toiaAssetName The name of the TOIA.
     */
    this.existsTOIAByName = function(toiaAssetName){
        toia.filter(function(asset, i){
           return asset.name == toiaAssetName;
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
     * Updates a TOIA by TOIA name.
     * @param toiaAssetName The name of the TOIA asset.
     * @param toiaAsset The TOIA asset with the update.
     */
    this.updateTOIAbyName = function(toiaAssetName, toiaAsset){
        var index = -1;
        _.each(toia, function(asset, i){
            if(asset.name == toiaAssetName){
                index = i;
            }
        });
        if(index >= 0){
            toia[index] = toiaAsset;
        }
    };

}]);
