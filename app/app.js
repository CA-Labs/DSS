/* global angular */

// bootstrap definitions and UI interactions
$("#dssSlides").carousel('pause' ,{
    wrap: false
}).on('slid.bs.carousel', function () {
   var topMenu = $(".topMenu");
   var slideClass = $(this).find(".active");
   var stickyBottom = $(".sticky-bottom");
   topMenu.find("blockquote p").removeClass("active");
   if (slideClass.hasClass("assets-slide")) {
       topMenu.find(".assets-slide blockquote p").addClass("active");
       stickyBottom.find(".slide-next").prop('disabled', false);
       stickyBottom.find(".slide-prev").prop('disabled', true);
   } else if (slideClass.hasClass("risks-slide")) {
       topMenu.find(".risks-slide blockquote p").addClass("active");
       stickyBottom.find(".slide-next").prop('disabled', false);
       stickyBottom.find(".slide-prev").prop('disabled', false);
   } else if (slideClass.hasClass("requirements-slide")) {
       topMenu.find(".requirements-slide blockquote p").addClass("active");
       stickyBottom.find(".slide-next").prop('disabled', false);
       stickyBottom.find(".slide-prev").prop('disabled', false);
   } else {
       topMenu.find(".services-slide blockquote p").addClass("active");
       stickyBottom.find(".slide-next").prop('disabled', true);
       stickyBottom.find(".slide-prev").prop('disabled', false);
   }
});


var dssApp = angular.module('dssApp', [
    'ngStorage'
]);

// TODO: add ngstorage integration to store choosen requirements and resuts in JSON format
