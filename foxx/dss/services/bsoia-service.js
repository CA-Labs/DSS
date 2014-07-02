/**
 * Created by Jordi Aranda.
 * 02/07/14
 * <jordi.aranda@bsc.es>
 */

dssApp.service('BSOIAService', ['flash', function(flash){

    var selectedBsoiaAssets = [];

    /**
     * Adds an asset to the list of selected
     * BSOIA assets.
     * @param bsoiaAsset The selected asset to add.
     */
    this.addBSOIA = function(bsoiaAsset){
        //Check asset doesn't already exists
        var exists = selectedBsoiaAssets.filter(function(asset){
            return asset.name === bsoiaAsset.name;
        }).length > 0;
        if(!exists){
            selectedBsoiaAssets.push(bsoiaAsset);
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
        _.each(selectedBsoiaAssets, function(asset, assetIndex){
            if(asset.name == bsoiaAsset.name){
                index = assetIndex;
            }
        });
        if(index >= 0) selectedBsoiaAssets.splice(index, 1);
    };

    /**
     * Retrieves the current BSOIA assets
     * selected by the user.
     * @returns {Array}
     */
    this.getBSOIA = function(){
        return selectedBsoiaAssets;
    };

}]);
