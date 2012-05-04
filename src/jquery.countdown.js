/**
 * jQuery Countdown plugin v@VERSION.
 *
 * Copyright (c) 2012. Dmitriy V. Ibragimov
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html.
 *
 * Depends:
 *     jquery.js
 *
 * Date: @DATE
 */
(function($) {

    // countdown namespace
    $.countdown = {};

    // countdown formats
    $.countdown.formats = {
            DHMS : 1, // days-hours-minutes-seconds
            HMS  : 2  // hours-minutes-seconds
    };

    // countdown default options
    $.countdown.defaults = {
            finish   : null,
            format   : $.countdown.formats.DHMS,
            autoStart: true,
            timeout  : null,
            days     : ".days",
            hours    : ".hours",
            minutes  : ".minutes",
            seconds  : ".seconds"
    };

    // countdown plugin
    var countdown = function ( element, options ) {
        this.element = element;
        this.options = $.extend( {}, $.countdown.defaults, options );
        this.timerId = null;

        if ( this.options.autoStart ) {
            this.start();
        }
    };

    // jquery constuctor for plugin
    $.fn.countdown = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "countdown" ) ) {
                $.data(this, "countdown", new countdown(this, options));
            }

            if ('string' == typeof options) {
                return $.data(this, "countdown")[ options ].apply(
                        $.data(this, "countdown"),
                        Array.prototype.slice.call(arguments, 1)
                );
            } else {
                return $.data(this, "countdown");
            }
        });
    };

    // extend plugin methods
    $.extend(countdown.prototype, {
        start: function () {
            if ( !this.timerId ) {
                this.timerId = setInterval( $.proxy(this.timer, this), 1000 );
            }
        },
        stop: function () {
            if ( this.timerId ) {
                clearInterval( this.timerId );
                this.timerId = null;
            }
        },
        timer: function () {
            var self = this,
                diff = ( new Date(this.options.finish) ).getTime() - (new Date()).getTime(),
                times = {},
                pad = [ 'minutes', 'seconds' ];

            if (diff > 0) {
                times[ 'seconds' ] = parseInt(diff / 1000);

                if ($.countdown.formats.DHMS == this.options.format) {
                    times[ 'days' ]    = parseInt(times[ 'seconds' ] / 86400);
                    times[ 'seconds' ] -= times[ 'days' ] * 86400;
                    pad.push( 'hours' );
                }

                times[ 'hours' ]   = parseInt(times[ 'seconds' ] / 3600);
                times[ 'seconds' ] -= times[ 'hours' ] * 3600;
                times[ 'minutes' ] = parseInt(times[ 'seconds' ] / 60);
                times[ 'seconds' ] -= times[ 'minutes' ] * 60;
            } else {
                if ( $.countdown.formats.DHMS == this.options.format ) {
                    times[ 'days' ] = 0;
                    pad.push( 'hours' );
                }

                times[ 'hours' ]   = 0;
                times[ 'minutes' ] = 0;
                times[ 'seconds' ] = 0;

                this.stop();

                if ( $.isFunction( this.options.timeout ) ) {
                    this.options.timeout.apply( this.element );
                }
            }

            $.each( times, function ( name, value ) {
                if ( $.inArray(name, pad) >= 0 && value < 10 ) {
                    value = '0' + value;
                }

                $( self.options[ name ], self.element ).text( value );
            });
        }
    });

})(jQuery);