(function( $ ) { 
	"use strict";        
        
        var slider_id       = slider_object.slider_id;
        var $slickElement   = $('.' + slider_id);        
        
        $slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
			 if(!slick.$dots){
				return;
			 }
			 var count = slick.$dots[0].children.length;
             if ( count < 10 ) {
                count =  "0" + count;
             }     
             $( '<li class="bt_bb_content_slider_paging ' + slider_id + '">' + count + '</li>' ).insertAfter( $('.' + slider_id + ' .slick-slider ul li' ).last() );
        });
    
}( jQuery ));

