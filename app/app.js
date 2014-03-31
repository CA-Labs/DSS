/* global angular */

// bootstrap definitions
$("#dssSlides").carousel('pause');

$(".topMenu .col-lg-3").on('click', function (event) {
   event.preventDefault();
   var menuItem = $(this);

    if (!menuItem.hasClass("active")) {
        menuItem.parent().find(".col-lg-3").removeClass("active");
        menuItem.addClass("active");
    }

});

var dssApp = angular.module('dssApp', [
    'ngStorage'
]);

// TODO: add ngstorage integration to store choosen requirements and resuts in JSON format
