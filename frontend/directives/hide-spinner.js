/**
 * Created by Jordi Aranda.
 * 4/11/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('hideSpinner', ['$rootScope', function($rootScope){
    return {
        restrict: 'A',
        link: function($scope, element, attrs){
            $scope.$on('us-spinner:spin', function(){
                $(element).parent().show();
                $(element).show();
            });
            // Hide spinner when the list of service proposals finished rendering
            $rootScope.$on('repeatDone', function(){
                $(element).parent().hide();
                $(element).hide();
                // We have finally the service scores, move the treatments slide forward
                $rootScope.$broadcast('moveSlides');
            });
        }
    }
}]);
