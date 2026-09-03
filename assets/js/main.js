"use strict";


jQuery(document).ready(function ($) {

	$(window).load(function () {
		$(".loaded").fadeOut();
		$(".preloader").delay(1000).fadeOut("slow");
	});
    /*---------------------------------------------*
     * Mobile menu
     ---------------------------------------------*/
    $('#navbar-collapse').find('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 40)
                }, 1000);
                if ($('.navbar-toggle').css('display') != 'none') {
                    $(this).parents('.container').find(".navbar-toggle").trigger("click");
                }
                return false;
            }
        }
    });

    /*---------------------------------------------*
     * Portfolio Pop Up Animation
     ---------------------------------------------*/

    $('.portfolio-img').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    /*---------------------------------------------*
     * Menu Section
     ---------------------------------------------*/

    $('.cd-menu-trigger').on('click', function (event) {
        event.preventDefault();
        $('.home-main-content').addClass('move-out');
        $('#main-nav').addClass('is-visible');
        $('.cd-shadow-layer').addClass('is-visible');
    });
    //close menu
    $('.cd-close-menu').on('click', function (event) {
        event.preventDefault();
        $('.home-main-content').removeClass('move-out');
        $('#main-nav').removeClass('is-visible');
        $('.cd-shadow-layer').removeClass('is-visible');
    });

    //clipped image - blur effect
    set_clip_property();
    $(window).on('resize', function () {
        set_clip_property();
    });

    function set_clip_property() {
        var $header_height = $('.cd-header').height(),
                $window_height = $(window).height(),
                $header_top = $window_height - $header_height,
                $window_width = $(window).width();
        $('.cd-blurred-bg').css('clip', 'rect(' + $header_top + 'px, ' + $window_width + 'px, ' + $window_height + 'px, 0px)');
    }
    $('#main-nav a[href^="#"]').on('click', function (event) {
        event.preventDefault();
        var target = $(this.hash);
        $('.home-main-content').removeClass('move-out');
        $('#main-nav').removeClass('is-visible');
        $('.cd-shadow-layer').removeClass('is-visible');
        $('body,html').animate(
                {'scrollTop': target.offset().top},
        900
                );
    });


//****** Los Scrips de LISHO **************** //

	$('#logohome').fadeIn(5000, function() {
		//Stuff to do *after* the animation takes place
	});

// Inline popups

/*
	$('.popup').magnificPopup({
	  delegate: 'a',
	  removalDelay: 1000, //delay removal by X to allow out-animation
	  callbacks: {
	    beforeOpen: function() {
	       this.st.mainClass = this.st.el.attr('data-effect');
	    }
	  },
	  midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
	});
*/

// Inline popups
$('.back').magnificPopup({
  delegate: 'a',
  removalDelay: 1000, //delay removal by X to allow out-animation
  callbacks: {
    beforeOpen: function() {
       this.st.mainClass = this.st.el.attr('data-effect');
    },

  },
  midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
});

// Hinge effect popup

	$('a.hinge').magnificPopup({
		mainClass: 'mfp-with-fade',
		removalDelay: 1000, //delay removal by X to allow out-animation
		callbacks: {
			beforeClose: function() {
				this.content.addClass('hinge');
			},
			close: function() {
				this.content.removeClass('hinge');
			}
		},
		midClick: true
	});
/*
    $('a.newspaper').magnificPopup({
        mainClass: 'mfp-newspaper',
        removalDelay: 1000, //delay removal by X to allow out-animation
        callbacks: {
            beforeClose: function() {
                this.content.addClass('mfp-newspaper');
            },
            close: function() {
                this.content.removeClass('mfp-newspaper');
            }
        },
        midClick: true
    });
*/
    /*---------------------------------------------*
     * STICKY scroll
     ---------------------------------------------*/

//    $.localScroll();



    /*---------------------------------------------*
     * Counter
     ---------------------------------------------*/

//    $('.statistic-counter').counterUp({
//        delay: 10,
//        time: 2000
//    });




    /*---------------------------------------------*
     * WOW
     ---------------------------------------------*/

//        var wow = new WOW({
//            mobile: false // trigger animations on mobile devices (default is true)
//        });
//        wow.init();


    /* ---------------------------------------------------------------------
     Carousel
     ---------------------------------------------------------------------= */

//    $('.testimonials').owlCarousel({
//        responsiveClass: true,
//        autoplay: false,
//        items: 1,
//        loop: true,
//        dots: true,
//        autoplayHoverPause: true
//
//    });


    //End


		/* ---------------------------------------------------------------------
		 MIS SCRIPS
		 ---------------------------------------------------------------------= */

/**** Definiciones de ejes de desarrollo *****/




/**** ENVIO DE COMENTARIOS *****/

/* https://github.com/PHPMailer/PHPMailer */
                                        
    $('#enviar').click(function(){

        console.log("hola");

           var parametros = {
                "nombre" : $("#nombre").val(),
                "mail" : $("#mail").val(),
                "titulo" : $("#titulo").val(),
                "mensaje" : $("#mensaje").val()
          }

          console.log(parametros);


          if ( parametros.nombre!="" && parametros.mail!="" && parametros.titulo!="") {
 
              $.ajax({
                  data : parametros,
                  url : "mail2.php",
                  type : "post",
                  success : function(response){
                         //response contiene la respuesta al llamado de tu archivo
                         //aqui actualizas los valores de inmediato llamando a sus respectivas id.
                            $("#nombre").val("");
                            $("#mail").val("");
                            $("#titulo").val("");
                            $("#mensaje").val("");

                            $('#msj').removeClass('alert-danger')
                                      .addClass('alert-success')
                                      .html("")
                                      .html("<div id='divmsj'><p><b>Mensaje enviado con éxito. Muchas gracias por tu aportación.</b></p></div>")
                                    ;

                            $('#divmsj').delay(3000).fadeOut(3000, function() {
                              $('#msj').removeClass('alert-success');
                            });


                  }
              })
          }

          else{

            //var cola = $('#msj p').fadeOut(5000);

            function cola () {
              $('#msj p').fadeOut(5000);
            }
            var col2 = $('#msj').removeClass('alert-danger');

            $('#msj').removeClass('alert-success')
                      .addClass('alert-danger')
                      .html("")
                      .html("<div id='divmsj'><p><b>No ha sido posible enviar el mensaje. Por favor, revisa el contenido de los campos.</b></p></div>")
                    ;

            $('#divmsj').delay(3000).fadeOut(3000, function() {
              $('#msj').removeClass('alert-danger');
            });
            

          }

    });

});
