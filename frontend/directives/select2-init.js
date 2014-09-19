/**
 * Created by Jordi Aranda.
 * 18/09/14
 * <jordi.aranda@bsc.es>
 */

dssApp.directive('select2Init', function(){
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs){
                scope.$on('treatmentsSelect2Populated', function(){
                var selects = $('select[label="treatments"]');
                _.each(selects, function(select){
                    console.log($(select).children().length);
                    // Remove first extra option value
                    $(select).children().first().remove();
                    // Prepend a valid option value with no content
                    $(select).prepend('<option></option>');
                    // Generate select2
                    $(select).select2({
                        placeholder: 'Select a treatment'
                    });
                });
            });
        }
    };
});
