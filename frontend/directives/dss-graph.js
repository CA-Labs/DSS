/**
 * Created by Jordi Aranda.
 * 24/10/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('dssGraph', ['d3Factory', function(d3Factory){
    return {
        restrict: 'E',
        scope: {},
        link: function(scope, element, attrs){
            d3Factory.d3().then(function(d3){
                console.log('D3 already available :)');
            });
        }
    }
}]);
