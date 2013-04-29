(function( $ ){
	var each = function(callback) {
		return function() {
			var _args = arguments;
			return this.each(function(){
				callback.apply( this, _args);
			});
		}
	}

	var checkImage = function($this, data, src) {
		if(!data.triggered) {
			$this.attr('src', src);
			data.triggered = true;
		}
	}

	var loaded = false;
	$(window).on('load', function() {
		loaded = true;
	});

	var waitload = function(callback) {
		if(!loaded) {
			$(window).on('load', function() {
				callback();
			});
		} else {
			callback();
		}
	}

	var methods = {
		init : each(function( options ) {
			var $this = $(this),
				data = $this.data('loader');

			var conf = $.extend({
				videoId: ''
			}, options);
				  
			// If the plugin hasn't been initialized yet
			if ( ! data ) {
				$this.data('loader', {
					conf: conf,
					triggered: false
				});
			}
			$this.loader('load');
		}),

		destroy : each(function( ) {
			var $this = $(this),
				data = $this.data('loader');

			// Namespacing FTW
			//$(window).unbind('.loader');
			$this.unbind('.loader');
			$this.removeData('loader');
		}),

		imagesloaded: function(callback) {
			var total = this.length;
			var count = 0;
			var loaded = false;

			var checkLoaded = function() {
				if(count == total && !loaded) {
					loaded = true;
					callback();
				}
			}

			setTimeout(function() {
				if(!loaded) {
					loaded = true;
					callback();
				}
			}, 10000);

			$.each(this, function(i, img) {
				if(!img.complete) {
					$(img).load(function() {
						count++;
						checkLoaded();
					});
				} else {
					count++;
					checkLoaded();
				}
			});
			checkLoaded();
		},

		load: each(function() {
			var $this = $(this),
				data = $this.data('loader');
			if(data.triggered)
				return;
			var src = $this.attr('data-src');
			var on = $this.attr('data-on');
			if(!on || on == '')
				on = "load";
			var timeout = parseInt($this.attr('data-timeout'));
			if(src != '') {
				switch(on) {
					case "load":
						waitload(function() {
							checkImage($this, data, src);
						});
						break;
					default:
						break;
				}
				if(timeout > 0) {
					setTimeout(function() {
						checkImage($this, data, src);
					}, timeout);
				}
			}
		})
	};

	$.fn.loader = function( method ) {
    
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.loader' );
		}    
	};
})( jQuery );
