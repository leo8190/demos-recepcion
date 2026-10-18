(function($) {
	$(document).ready(function() {

		var slider = $('.opinion-nos-ayuda-crecer-wrap').lightSlider({
		controls: true,
		pager: false,
		adaptiveHeight:true,
		item:1,
		slideMove: 1,
		slideMargin:0,
		//loop:true,
		responsive : [
			{
				breakpoint:800,
				settings: {
					item:1,
					slideMove:1,
					slideMargin:6,
				  }
			},
			{
				breakpoint:480,
				settings: {
					item:1,
					slideMove:1
				  }
			}
		]
		});
		
		$('.opinion-nos-ayuda-crecer .slideControls .slidePrev').click(function() {
            slider.goToPrevSlide();
        });

        $('.opinion-nos-ayuda-crecer .slideControls .slideNext').click(function() {
            slider.goToNextSlide();
        });

		//$('.lSAction').insertBefore('.lSSlideOuter');
		
	  });

/*** Second Slider */
	  $(document).ready(function() {

		var slider = $('.service-slider').lightSlider({
		controls: true,
		pager: false,
		adaptiveHeight:true,
		item:3,
		slideMove: 3,
		slideMargin:10,
		//loop:true,
		responsive : [
			{
				breakpoint:800,
				settings: {
					item:1,
					slideMove:1,
					slideMargin:6,
				  }
			},
			{
				breakpoint:480,
				settings: {
					item:1,
					slideMove:1
				  }
			}
		]
		});
		
		$('.service-otros-servicios .slideControls .slidePrev').click(function() {
            slider.goToPrevSlide();
        });

        $('.service-otros-servicios .slideControls .slideNext').click(function() {
            slider.goToNextSlide();
        });

		//$('.lSAction').insertBefore('.lSSlideOuter');
		
});
	
})(jQuery);