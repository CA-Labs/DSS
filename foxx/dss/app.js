/* global angular */

// bootstrap definitions and UI interactions
$('#dssSlides').carousel('pause' ,{
    wrap: false
}).on('slid.bs.carousel', function () {

    var topMenu = $('.topMenu');
    var slideClass = $(this).find('.active');
    var stickyBottom = $('.sticky-bottom');
    var cloudServicesButton = stickyBottom.find('.slide-services');
    topMenu.find('blockquote p').removeClass('active');

    if (slideClass.hasClass('bsoia-slide')) {
        topMenu.find('.bsoia-slide blockquote p').addClass('active');
        stickyBottom.find('.slide-prev').prop('disabled', true);
        stickyBottom.find('.slide-next').prop('disabled', false);
        stickyBottom.find('.slide-next').css('display', 'inline');
        cloudServicesButton.css('display', 'none');
    } else if (slideClass.hasClass('toia-slide')) {
        topMenu.find('.toia-slide blockquote p').addClass('active');
        stickyBottom.find('.slide-prev').prop('disabled', false);
        stickyBottom.find('.slide-next').prop('disabled', false);
        stickyBottom.find('.slide-next').css('display', 'inline');
        cloudServicesButton.css('display', 'none');
    } else if (slideClass.hasClass('ta-slide')) {
        topMenu.find('.ta-slide blockquote p').addClass('active');
        stickyBottom.find('.slide-prev').prop('disabled', false);
        stickyBottom.find('.slide-next').prop('disabled', false);
        stickyBottom.find('.slide-next').css('display', 'inline');
        cloudServicesButton.css('display', 'none');
    } else if (slideClass.hasClass('risks-slide')) {
        topMenu.find('.risks-slide blockquote p').addClass('active');
        stickyBottom.find('.slide-prev').prop('disabled', false);
        stickyBottom.find('.slide-next').prop('disabled', false);
        stickyBottom.find('.slide-next').css('display', 'inline');
        cloudServicesButton.css('display', 'none');
    } else if (slideClass.hasClass('treatments-slide')) {
        topMenu.find('.treatments-slide blockquote p').addClass('active');
        stickyBottom.find('.slide-prev').prop('disabled', false);
        stickyBottom.find('.slide-next').prop('disabled', false);
        stickyBottom.find('.slide-next').css('display', 'inline');
        cloudServicesButton.css('display', 'none');
    } else {
        topMenu.find('.services-slide blockquote p').addClass('active');
        stickyBottom.find('.slide-prev').prop('disabled', false);
        stickyBottom.find('.slide-next').css('display', 'none');
        cloudServicesButton.css('display', 'inline  ');
    }

});

var dssApp = angular.module('dssApp', [
    'ngStorage',
    'angular-flash.service',
    'angular-flash.flash-alert-directive',
    'ngDragDrop',
    'angular-loading-bar',
    'angularFileUpload',
    'frapontillo.bootstrap-switch'
]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
}]);

// TODO: add ngstorage integration to store choosen requirements and resuts in JSON format

/******************************************************
 ********************* BSOIA SLIDE ********************
 *****************************************************/

//Show/hide x (close button) when hovering selected assets
$('body').on('mouseover', '.list-group > .selected-asset', function(e){
    $(this).find('.remove-asset').show();
    $(this).find('.remove-bsoia-in-toia').show();
});

$('body').on('mouseout', '.list-group > .selected-asset', function(e){
    $(this).find('.remove-asset').hide();
    $(this).find('.remove-bsoia-in-toia').hide();
});

//Show/hide x (close button) when hovering selected risks
$('body').on('mouseover', '.list-group > .selected-risk', function(e){
    $(this).find('.remove-risk').show();
});

$('body').on('mouseout', '.list-group > .selected-risk', function(e){
    $(this).find('.remove-risk').hide();
});

//Show/hide x (close button) when hovering selected bsoia tags in drop zones
$('body').on('mouseover', '.list-group > .dropzone', function(e){
    $(this).find('.remove-bsoia-in-toia-asset').show();
});

$('body').on('mouseout', '.list-group > .dropzone', function(e){
    $(this).find('.remove-bsoia-in-toia-asset').hide();
});

//Select2
$('select[label="assets"]').select2({
    placeholder: 'Select an asset'
});

$('select[label="risks"]').select2({
    placeholder: 'Select an asset'
});
