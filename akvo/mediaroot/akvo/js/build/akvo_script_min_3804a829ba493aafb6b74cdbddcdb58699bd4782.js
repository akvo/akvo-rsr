

/*---------------------------------------------------------------------------
 Contents from: galleria.1.1.95.js
---------------------------------------------------------------------------*/

/*!
 * Galleria v 1.1.95 2010-08-06
 * http://galleria.aino.se
 *
 * Copyright (c) 2010, Aino
 * Licensed under the MIT license.
 */

(function() {

var initializing = false,
    fnTest = /xyz/.test(function(){xyz;}) ? /\b__super\b/ : /.*/,
    Class = function(){},
    window = this;

Class.extend = function(prop) {
    var __super = this.prototype;
    initializing = true;
    var proto = new this();
    initializing = false;
    for (var name in prop) {
        if (name) {
            proto[name] = typeof prop[name] == "function" && 
                typeof __super[name] == "function" && fnTest.test(prop[name]) ? 
                (function(name, fn) { 
                    return function() { 
                        var tmp = this.__super; 
                        this.__super = __super[name]; 
                        var ret = fn.apply(this, arguments);       
                        this.__super = tmp; 
                        return ret; 
                    }; 
                })(name, prop[name]) : prop[name]; 
        } 
    }

    function Class() {
        if ( !initializing && this.__constructor ) {
            this.__constructor.apply(this, arguments);
        }
    }
    Class.prototype = proto;
    Class.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
};

var Base = Class.extend({
    loop : function( elem, fn) {
        var scope = this;
        if (typeof elem == 'number') {
            elem = new Array(elem);
        }
        jQuery.each(elem, function() {
            fn.call(scope, arguments[1], arguments[0]);
        });
        return elem;
    },
    create : function( elem, className ) {
        elem = elem || 'div';
        var el = document.createElement(elem);
        if (className) {
            el.className = className;
        }
        return el;
    },
    getElements : function( selector ) {
        var elems = {};
        this.loop( jQuery(selector), this.proxy(function( elem ) {
            this.push(elem, elems);
        }));
        return elems;
    },
    setStyle : function( elem, css ) {
        jQuery(elem).css(css);
        return this;
    },
    getStyle : function( elem, styleProp, parse ) {
        var val = jQuery(elem).css(styleProp);
        return parse ? this.parseValue( val ) : val;
    },
    cssText : function( string ) {
        var style = document.createElement('style');
        this.getElements('head')[0].appendChild(style);
        if (style.styleSheet) { // IE
            style.styleSheet.cssText = string;
        } else {
            var cssText = document.createTextNode(string);
            style.appendChild(cssText);
        }
        return this;
    },
    touch : function(el) {
        var sibling = el.nextSibling;
        var parent = el.parentNode;
        parent.removeChild(el);
        if ( sibling ) {
            parent.insertBefore(el, sibling);
        } else {
            parent.appendChild(el);
        }
        if (el.styleSheet && el.styleSheet.imports.length) {
            this.loop(el.styleSheet.imports, function(i) {
                el.styleSheet.addImport(i.href);
            });
        }
    },
    loadCSS : function(href, callback) {
        var exists = this.getElements('link[href="'+href+'"]').length;
        if (exists) {
            callback.call(null);
            return exists[0];
        }
        var link = this.create('link');
        link.rel = 'stylesheet';
        link.href = href;
        
        if (typeof callback == 'function') {
            // a new css check method, still experimental...
            this.wait(function() {
                return !!document.body;
            }, function() {
                var testElem = this.create('div', 'galleria-container galleria-stage');
                this.moveOut(testElem);
                document.body.appendChild(testElem);
                var getStyles = this.proxy(function() {
                    var str = '';
                    var props;
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        props = document.defaultView.getComputedStyle(testElem, "");
                        this.loop(props, function(prop) {
                            str += prop + props.getPropertyValue(prop);
                        });
                    } else if (testElem.currentStyle) { // IE
                        props = testElem.currentStyle;
                        this.loop(props, function(val, prop) {
                            str += prop + val;
                        });
                    }
                    return str;
                });
                var current = getStyles();
                this.wait(function() {
                    return getStyles() !== current;
                }, function() {
                    document.body.removeChild(testElem);
                    callback.call(link);
                }, function() {
                    G.raise('Could not confirm theme CSS');
                }, 2000);
            });
        }
        window.setTimeout(this.proxy(function() {
            var styles = this.getElements('link[rel="stylesheet"],style');
            if (styles.length) {
                styles[0].parentNode.insertBefore(link, styles[0]);
            } else {
                this.getElements('head')[0].appendChild(link);
            }
            // IE needs a manual touch to re-order the cascade
            if (G.IE) {
                this.loop(styles, function(el) {
                    this.touch(el);
                })
            }
        }), 2);
        return link;
    },
    moveOut : function( elem ) {
        return this.setStyle(elem, {
            position: 'absolute',
            left: '-10000px',
            display: 'block'
        });
    },
    moveIn : function( elem ) {
        return this.setStyle(elem, {
            left: '0'
        }); 
    },
    reveal : function( elem ) {
        return jQuery( elem ).show();
    },
    hide : function( elem ) {
        return jQuery( elem ).hide();
    },
    mix : function() {
        return jQuery.extend.apply(jQuery, arguments);
    },
    proxy : function( fn, scope ) {
        if ( typeof fn !== 'function' ) {
            return function() {};
        }
        scope = scope || this;
        return function() {
            return fn.apply( scope, Array.prototype.slice.call(arguments) );
        };
    },
    listen : function( elem, type, fn ) {
        jQuery(elem).bind( type, fn );
    },
    forget : function( elem, type, fn ) {
        jQuery(elem).unbind(type, fn);
    },
    dispatch : function( elem, type ) {
        jQuery(elem).trigger(type);
    },
    clone : function( elem, keepEvents ) {
        keepEvents = keepEvents || false;
        return jQuery(elem).clone(keepEvents)[0];
    },
    removeAttr : function( elem, attributes ) {
        this.loop( attributes.split(' '), function(attr) {
            jQuery(elem).removeAttr(attr);
        });
    },
    push : function( elem, obj ) {
        if (typeof obj.length == 'undefined') {
            obj.length = 0;
        }
        Array.prototype.push.call( obj, elem );
        return elem;
    },
    width : function( elem, outer ) {
        return this.meassure(elem, outer, 'Width');
    },
    height : function( elem, outer ) {
        return this.meassure(elem, outer, 'Height');
    },
    meassure : function(el, outer, meassure) {
        var elem = jQuery( el );
        var ret = outer ? elem['outer'+meassure](true) : elem[meassure.toLowerCase()]();
        // fix quirks mode
        if (G.QUIRK) {
            var which = meassure == "Width" ? [ "left", "right" ] : [ "top", "bottom" ];
            this.loop(which, function(s) {
                ret += elem.css('border-' + s + '-width').replace(/[^\d]/g,'') * 1;
                ret += elem.css('padding-' + s).replace(/[^\d]/g,'') * 1;
            });
        }
        return ret;
    },
    toggleClass : function( elem, className, arg ) {
        if (typeof arg !== 'undefined') {
            var fn = arg ? 'addClass' : 'removeClass';
            jQuery(elem)[fn](className);
            return this;
        }
        jQuery(elem).toggleClass(className);
        return this;
    },
    hideAll : function( el ) {
        jQuery(el).find('*').hide();
    },
    animate : function( el, options ) {
        options.complete = this.proxy(options.complete);
        var elem = jQuery(el);
        if (!elem.length) {
            return;
        }
        if (options.from) {
            elem.css(from);
        }
        elem.animate(options.to, {
            duration: options.duration || 400,
            complete: options.complete,
            easing: options.easing || 'swing'
        });
    },
    wait : function(fn, callback, err, max) {
        fn = this.proxy(fn);
        callback = this.proxy(callback);
        err = this.proxy(err);
        var ts = new Date().getTime() + (max || 3000);
        window.setTimeout(function() {
            if (fn()) {
                callback();
                return false;
            }
            if (new Date().getTime() >= ts) {
                err();
                callback();
                return false;
            }
            window.setTimeout(arguments.callee, 2);
        }, 2);
        return this;
    },
    loadScript: function(url, callback) {
       var script = document.createElement('script');
       script.src = url;
       script.async = true; // HTML5

       var done = false;
       var scope = this;

       // Attach handlers for all browsers
       script.onload = script.onreadystatechange = function() {
           if ( !done && (!this.readyState ||
               this.readyState == "loaded" || this.readyState == "complete") ) {
               done = true;
               
               if (typeof callback == 'function') {
                   callback.call(scope, this);
               }

               // Handle memory leak in IE
               script.onload = script.onreadystatechange = null;
           }
       };
       var s = document.getElementsByTagName('script')[0];
       s.parentNode.insertBefore(script, s);
       
       return this;
    },
    parseValue: function(val) {
        if (typeof val == 'number') {
            return val;
        } else if (typeof val == 'string') {
            var arr = val.match(/\-?\d/g);
            return arr && arr.constructor == Array ? arr.join('')*1 : 0;
        } else {
            return 0;
        }
    }
});

var Picture = Base.extend({
    __constructor : function(order) {
        this.image = null;
        this.elem = this.create('div', 'galleria-image');
        this.setStyle( this.elem, {
            overflow: 'hidden',
            position: 'relative' // for IE Standards mode
        } );
        this.order = order;
        this.orig = { w:0, h:0, r:1 };
    },
    
    cache: {},
    ready: false,
    
    add: function(src) {
        if (this.cache[src]) {
            return this.cache[src];
        }
        var image = new Image();
        image.src = src;
        this.setStyle(image, {display: 'block'});
        if (image.complete && image.width) {
            this.cache[src] = image;
            return image;
        }
        image.onload = (function(scope) {
            return function() {
                scope.cache[src] = image;
            };
        })(this);
        return image;
    },
    
    isCached: function(src) {
        return this.cache[src] ? this.cache[src].complete : false;
    },
    
    make: function(src) {
        var i = this.cache[src] || this.add(src);
        return this.clone(i);
    },
    
    load: function(src, callback) {
        callback = this.proxy( callback );
        this.elem.innerHTML = '';
        this.image = this.make( src );
        this.moveOut( this.image );
        this.elem.appendChild( this.image );
        this.wait(function() {
            return (this.image.complete && this.image.width);
        }, function() {
            this.orig = {
                h: this.h || this.image.height,
                w: this.w || this.image.width
            };
            callback( {target: this.image, scope: this} );
        }, function() {
            G.raise('image not loaded in 20 seconds: '+ src);
        }, 20000);
        return this;
    },
    
    scale: function(options) {
        var o = this.mix({
            width: 0,
            height: 0,
            min: undefined,
            max: undefined,
            margin: 0,
            complete: function(){},
            position: 'center',
            crop: false
        }, options);
        if (!this.image) {
            return this;
        }
        var width,height;
        this.wait(function() {
            width  = o.width || this.width(this.elem);
            height = o.height || this.height(this.elem);
            return width && height;
        }, function() {
            var nw = (width - o.margin*2) / this.orig.w;
            var nh = (height- o.margin*2) / this.orig.h;
            var rmap = {
                'true': Math.max(nw,nh),
                'width': nw,
                'height': nh,
                'false': Math.min(nw,nh)
            }
            var ratio = rmap[o.crop.toString()];
            if (o.max) {
                ratio = Math.min(o.max, ratio);
            }
            if (o.min) {
                ratio = Math.max(o.min, ratio);
            }
            this.setStyle(this.elem, {
                width: width,
                height: height
            });
            this.image.width = Math.ceil(this.orig.w * ratio);
            this.image.height = Math.ceil(this.orig.h * ratio);
            
            var getPosition = this.proxy(function(value, img, m) {
                var result = 0;
                if (/\%/.test(value)) {
                    var pos = parseInt(value) / 100;
                    result = Math.ceil(this.image[img] * -1 * pos + m * pos);
                } else {
                    result = parseInt(value);
                }
                return result;
            });
            
            var map = {
                'top': { top: 0 },
                'left': { left: 0 },
                'right': { left: '100%' },
                'bottom': { top: '100%' }
            }
            
            var pos = {};
            var mix = {};
            
            this.loop(o.position.toLowerCase().split(' '), function(p, i) {
                if (p == 'center') {
                    p = '50%';
                }
                pos[i ? 'top' : 'left'] = p;
            });

            this.loop(pos, function(val, key) {
                if (map.hasOwnProperty(val)) {
                    mix = this.mix(mix, map[val]);
                }
            });
            
            pos = pos.top ? this.mix(pos, mix) : mix;
            
            pos = this.mix({
                top: '50%',
                left: '50%'
            }, pos);

            this.setStyle(this.image, {
                position : 'relative',
                top :  getPosition(pos.top, 'height', height),
                left : getPosition(pos.left, 'width', width)
            });
            this.ready = true;
            o.complete.call(this);
        });
        return this;
    }
});

var G = window.Galleria = Base.extend({
    
    __constructor : function(options) {
        this.theme = undefined;
        this.options = options;
        this.playing = false;
        this.playtime = 5000;
        this.active = null;
        this.queue = {};
        this.data = {};
        this.dom = {};
        
        var kb = this.keyboard = {
            keys : {
                UP: 38,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39,
                RETURN: 13,
                ESCAPE: 27,
                BACKSPACE: 8
            },
            map : {},
            bound: false,
            press: this.proxy(function(e) {
                var key = e.keyCode || e.which;
                if (kb.map[key] && typeof kb.map[key] == 'function') {
                    kb.map[key].call(this, e);
                }
            }),
            attach: this.proxy(function(map) {
                for( var i in map ) {
                    var k = i.toUpperCase();
                    if ( kb.keys[k] ) {
                        kb.map[kb.keys[k]] = map[i];
                    }
                }
                if (!kb.bound) {
                    kb.bound = true;
                    this.listen(document, 'keydown', kb.press);
                }
            }),
            detach: this.proxy(function() {
                kb.bound = false;
                this.forget(document, 'keydown', kb.press);
            })
        };
        
        this.timeouts = {
            trunk: {},
            add: function(id, fn, delay, loop) {
                loop = loop || false;
                this.clear(id);
                if (loop) {
                    var self = this;
                    var old = fn;
                    fn = function() {
                        old();
                        self.add(id,fn,delay);
                    }
                }
                this.trunk[id] = window.setTimeout(fn,delay);
            },
            clear: function(id) {
                if (id && this.trunk[id]) {
                    window.clearTimeout(this.trunk[id]);
                    delete this.trunk[id];
                } else if (typeof id == 'undefined') {
                    for (var i in this.trunk) {
                        window.clearTimeout(this.trunk[i]);
                        delete this.trunk[i];
                    }
                }
            }
        };
        
        this.controls = {
            0 : null,
            1 : null,
            active : 0,
            swap : function() {
                this.active = this.active ? 0 : 1;
            },
            getActive : function() {
                return this[this.active];
            },
            getNext : function() {
                return this[Math.abs(this.active - 1)];
            }
        };
        
        var fs = this.fullscreen = {
            scrolled: 0,
            enter: this.proxy(function() {
                this.toggleClass( this.get('container'), 'fullscreen');
                fs.scrolled = jQuery(window).scrollTop();
                this.loop(fs.getElements(), function(el, i) {
                    fs.styles[i] = el.getAttribute('style');
                    el.removeAttribute('style');
                });
                this.setStyle(fs.getElements(0), {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10000
                });
                var bh = {
                    height: '100%',
                    overflow: 'hidden',
                    margin:0,
                    padding:0
                };
                this.setStyle( fs.getElements(1), bh );
                this.setStyle( fs.getElements(2), bh );
                this.attachKeyboard({
                    escape: this.exitFullscreen,
                    right: this.next,
                    left: this.prev
                });
                this.rescale(this.proxy(function() {
                    this.trigger(G.FULLSCREEN_ENTER);
                }));
                this.listen(window, 'resize', fs.scale);
            }),
            scale: this.proxy(function() {
                this.rescale();
            }),
            exit: this.proxy(function() {
                this.toggleClass( this.get('container'), 'fullscreen', false);
                if (!fs.styles.length) {
                    return;
                }
                this.loop(fs.getElements(), function(el, i) {
                    el.removeAttribute('style');
                    el.setAttribute('style', fs.styles[i]);
                });
                window.scrollTo(0, fs.scrolled);
                this.detachKeyboard();
                this.rescale(this.proxy(function() {
                    this.trigger(G.FULLSCREEN_EXIT);
                }));
                this.forget(window, 'resize', fs.scale);
            }),
            styles: [],
            getElements: this.proxy(function(i) {
                var elems = [ this.get('container'), document.body, this.getElements('html')[0] ];
                return i ? elems[i] : elems;
            })
        };
        
        var idle = this.idle = {
            trunk: [],
            bound: false,
            add: this.proxy(function(elem, styles, fn) {
                if (!elem) {
                    return;
                }
                if (!idle.bound) {
                    idle.addEvent();
                }
                elem = jQuery(elem);
                var orig = {};
                for (var style in styles) {
                    orig[style] = elem.css(style);
                }
                elem.data('idle', {
                    from: orig,
                    to: styles,
                    complete: true,
                    busy: false,
                    fn: this.proxy(fn)
                });
                idle.addTimer();
                idle.trunk.push(elem);
            }),
            remove: this.proxy(function(elem) {
                elem = jQuery(elem);
                this.loop(idle.trunk, function(el, i) {
                    if ( el && !el.not(elem).length ) {
                        idle.show(elem);
                        idle.trunk.splice(i,1);
                    }
                });
                if (!idle.trunk.length) {
                    idle.removeEvent();
                    this.clearTimer('idle');
                }
            }),
            addEvent: this.proxy(function() {
                idle.bound = true;
                this.listen( this.get('container'), 'mousemove click', idle.showAll );
            }),
            removeEvent: this.proxy(function() {
                idle.bound = false;
                this.forget( this.get('container'), 'mousemove click', idle.showAll );
            }),
            addTimer: this.proxy(function() {
                this.addTimer('idle', this.proxy(function() {
                    idle.hide();
                }),this.options.idle_time);
            }),
            hide: this.proxy(function() {
                this.trigger(G.IDLE_ENTER);
                this.loop(idle.trunk, function(elem) {
                    var data = elem.data('idle');
                    data.complete = false;
                    data.fn();
                    elem.animate(data.to, {
                        duration: 600,
                        queue: false,
                        easing: 'swing'
                    });
                });
            }),
            showAll: this.proxy(function() {
                this.clearTimer('idle');
                this.loop(idle.trunk, function(elem) {
                    idle.show(elem);
                });
            }),
            show: this.proxy(function(elem) {
                var data = elem.data('idle');
                if (!data.busy && !data.complete) {
                    data.busy = true;
                    this.trigger(G.IDLE_EXIT);
                    elem.animate(data.from, {
                        duration: 300,
                        queue: false,
                        easing: 'swing',
                        complete: function() {
                            $(this).data('idle').busy = false;
                            $(this).data('idle').complete = true;
                        }
                    });
                }
                idle.addTimer();
            })
        };
        
        var lightbox = this.lightbox = {
            w: 0,
            h: 0,
            initialized: false,
            active: null,
            init: this.proxy(function() {
                if (lightbox.initialized) {
                    return;
                }
                lightbox.initialized = true;
                var elems = 'lightbox-overlay lightbox-box lightbox-content lightbox-shadow lightbox-title ' +
                            'lightbox-info lightbox-close lightbox-prev lightbox-next lightbox-counter';
                this.loop(elems.split(' '), function(el) {
                    this.addElement(el);
                    lightbox[el.split('-')[1]] = this.get(el);
                });
                
                lightbox.image = new Galleria.Picture();
                
                this.append({
                    'lightbox-box': ['lightbox-shadow','lightbox-content', 'lightbox-close'],
                    'lightbox-info': ['lightbox-title','lightbox-counter','lightbox-next','lightbox-prev'],
                    'lightbox-content': ['lightbox-info']
                });
                document.body.appendChild( lightbox.overlay );
                document.body.appendChild( lightbox.box );
                lightbox.content.appendChild( lightbox.image.elem );
                
                lightbox.close.innerHTML = '&#215;';
                lightbox.prev.innerHTML = '&#9668;';
                lightbox.next.innerHTML = '&#9658;';
                
                this.listen( lightbox.close, 'click', lightbox.hide );
                this.listen( lightbox.overlay, 'click', lightbox.hide );
                this.listen( lightbox.next, 'click', lightbox.showNext );
                this.listen( lightbox.prev, 'click', lightbox.showPrev );
                
                if (this.options.lightbox_clicknext) {
                    this.setStyle( lightbox.image.elem, {cursor:'pointer'} );
                    this.listen( lightbox.image.elem, 'click', lightbox.showNext);
                }
                this.setStyle( lightbox.overlay, {
                    position: 'fixed', display: 'none',
                    opacity: this.options.overlay_opacity,
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: this.options.overlay_background, zIndex: 99990
                });
                this.setStyle( lightbox.box, {
                    position: 'fixed', display: 'none',
                    width: 400, height: 400, top: '50%', left: '50%',
                    marginTop: -200, marginLeft: -200, zIndex: 99991
                });
                this.setStyle( lightbox.shadow, {
                    background:'#000', opacity:.4, width: '100%', height: '100%', position: 'absolute'
                });
                this.setStyle( lightbox.content, {
                    backgroundColor:'#fff',position: 'absolute',
                    top: 10, left: 10, right: 10, bottom: 10, overflow: 'hidden'
                });
                this.setStyle( lightbox.info, {
                    color: '#444', fontSize: '11px', fontFamily: 'arial,sans-serif', height: 13, lineHeight: '13px',
                    position: 'absolute', bottom: 10, left: 10, right: 10, opacity: 0
                });
                this.setStyle( lightbox.close, {
                    background: '#fff', height: 20, width: 20, position: 'absolute', textAlign: 'center', cursor: 'pointer',
                    top: 10, right: 10, lineHeight: '22px', fontSize: '16px', fontFamily:'arial,sans-serif',color:'#444', zIndex: 99999
                });
                this.setStyle( lightbox.image.elem, {
                    top: 10, left: 10, right: 10, bottom: 30, position: 'absolute'
                });
                this.loop('title prev next counter'.split(' '), function(el) {
                    var css = { display: 'inline', 'float':'left' };
                    if (el != 'title') {
                        this.mix(css, { 'float': 'right'});
                        if (el != 'counter') {
                            this.mix(css, { cursor: 'pointer'});
                        } else {
                            this.mix(css, { marginLeft: 8 });
                        }
                    }
                    this.setStyle(lightbox[el], css);
                });
                this.loop('prev next close'.split(' '), function(el) {
                    this.listen(lightbox[el], 'mouseover', this.proxy(function() {
                        this.setStyle(lightbox[el], { color:'#000' });
                    }));
                    this.listen(lightbox[el], 'mouseout', this.proxy(function() {
                        this.setStyle(lightbox[el], { color:'#444' });
                    }));
                });
                this.trigger(G.LIGHTBOX_OPEN);
            }),
            rescale: this.proxy(function(e) {
                var w = Math.min( this.width(window), lightbox.w );
                var h = Math.min( this.height(window), lightbox.h );
                var r = Math.min( (w-60) / lightbox.w, (h-80) / lightbox.h );
                var destW = (lightbox.w * r) + 40;
                var destH = (lightbox.h * r) + 60;
                var dest = {
                    width: destW,
                    height: destH,
                    marginTop: Math.ceil(destH/2)*-1,
                    marginLeft: Math.ceil(destW)/2*-1
                }
                if (!e) {
                    this.animate( lightbox.box, {
                        to: dest,
                        duration: this.options.lightbox_transition_speed,
                        easing: 'galleria',
                        complete: function() {
                            this.trigger({
                                type: G.LIGHTBOX_IMAGE,
                                imageTarget: lightbox.image.image
                            });
                            this.moveIn( lightbox.image.image );
                            this.animate( lightbox.image.image, { to: { opacity:1 }, duration: this.options.lightbox_fade_speed } );
                            this.animate( lightbox.info, { to: { opacity:1 }, duration: this.options.lightbox_fade_speed } );
                        }
                    });
                } else {
                    this.setStyle( lightbox.box, dest );
                }
            }),
            hide: this.proxy(function() {
                lightbox.image.image = null;
                this.forget(window, 'resize', lightbox.rescale);
                this.hide( lightbox.box );
                this.setStyle( lightbox.info, { opacity: 0 } );
                this.animate( lightbox.overlay, {
                    to: { opacity: 0 },
                    duration: 200,
                    complete: function() {
                        this.hide( lightbox.overlay );
                        this.setStyle( lightbox.overlay, { opacity: this.options.overlay_opacity});
                        this.trigger(G.LIGHTBOX_CLOSE);
                    }
                });
            }),
            showNext: this.proxy(function() {
                lightbox.show(this.getNext(lightbox.active));
            }),
            showPrev: this.proxy(function() {
                lightbox.show(this.getPrev(lightbox.active));
            }),
            show: this.proxy(function(index) {
                if (!lightbox.initialized) {
                    lightbox.init();
                }
                this.forget( window, 'resize', lightbox.rescale );
                index = typeof index == 'number' ? index : this.getIndex();
                lightbox.active = index;
                
                var data = this.getData(index);
                var total = this.data.length;
                this.setStyle( lightbox.info, {opacity:0} );

                lightbox.image.load( data.image, function(o) {
                    lightbox.w = o.scope.orig.w;
                    lightbox.h = o.scope.orig.h;
                    this.setStyle(o.target, {
                        width: '100.5%',
                        height: '100.5%',
                        top:0,
                        zIndex: 99998,
                        opacity: 0
                    });
                    lightbox.title.innerHTML = data.title;
                    lightbox.counter.innerHTML = (index+1) + ' / ' + total;
                    this.listen( window, 'resize', lightbox.rescale );
                    lightbox.rescale();
                });
                this.reveal( lightbox.overlay );
                this.reveal( lightbox.box );
            })
        };
        
        this.thumbnails = { width: 0 };
        this.stageWidth = 0;
        this.stageHeight = 0;
        
        var elems = 'container stage images image-nav image-nav-left image-nav-right ' + 
                    'info info-text info-title info-description info-author ' +
                    'thumbnails thumbnails-list thumbnails-container thumb-nav-left thumb-nav-right ' +
                    'loader counter';
        elems = elems.split(' ');
        
        this.loop(elems, function(blueprint) {
            this.dom[ blueprint ] = this.create('div', 'galleria-' + blueprint);
        });
        
        this.target = this.dom.target = options.target.nodeName ? 
            options.target : this.getElements(options.target)[0];

        if (!this.target) {
             G.raise('Target not found.');
        }
    },
    
    init: function() {
        
        this.options = this.mix(G.theme.defaults, this.options);
        this.options = this.mix({
            autoplay: false,
            carousel: true,
            carousel_follow: true,
            carousel_speed: 400,
            carousel_steps: 'auto',
            clicknext: false,
            data_config : function( elem ) { return {}; },
            data_image_selector: 'img',
            data_source: this.target,
            data_type: 'auto',
            debug: false,
            extend: function(options) {},
            height: 'auto',
            idle_time: 3000,
            image_crop: false,
            image_margin: 0,
            image_pan: false,
            image_pan_smoothness: 12,
            image_position: '50%',
            keep_source: false,
            lightbox_clicknext: true,
            lightbox_fade_speed: 200,
            lightbox_transition_speed: 300,
            link_source_images: true,
            max_scale_ratio: undefined,
            min_scale_ratio: undefined,
            on_image: function(img,thumb) {},
            overlay_opacity: .85,
            overlay_background: '#0b0b0b',
            popup_links: false,
            preload: 2,
            queue: true,
            show: 0,
            show_info: true,
            show_counter: true,
            show_imagenav: true,
            thumb_crop: true,
            thumb_fit: true,
            thumb_margin: 0,
            thumb_quality: 'auto',
            thumbnails: true,
            transition: G.transitions.fade,
            transition_speed: 400
        }, this.options);
        
        var o = this.options;
        
        this.bind(G.DATA, function() {
            this.run();
        });
        
        if (o.clicknext) {
            this.loop(this.data, function(data) {
                delete data.link;
            });
            this.setStyle(this.get('stage'), { cursor: 'pointer'} );
            this.listen(this.get('stage'), 'click', this.proxy(function() {
                this.next();
            }));
        }
        
        this.bind(G.IMAGE, function(e) {
            o.on_image.call(this, e.imageTarget, e.thumbTarget);
        });
        
        this.bind(G.READY, function() {
            if (G.History) {
                G.History.change(this.proxy(function(e) {
                    var val = parseInt(e.value.replace(/\//,''));
                    if (isNaN(val)) {
                        window.history.go(-1);
                    } else {
                        this.show(val, undefined, true);
                    }
                }));
            }

            G.theme.init.call(this, o);
            o.extend.call(this, o);
            
            if (/^[0-9]{1,4}$/.test(hash) && G.History) {
                this.show(hash, undefined, true);
            } else if (typeof o.show == 'number') {
                this.show(o.show);
            }
            
            if (o.autoplay) {
                if (typeof o.autoplay == 'number') {
                    this.playtime = o.autoplay;
                }
                this.trigger( G.PLAY );
                this.playing = true;
            }
        });
        this.load();
        return this;
    },
    
    bind : function(type, fn) {
        this.listen( this.get('container'), type, this.proxy(fn) );
        return this;
    },
    
    unbind : function(type) {
        this.forget( this.get('container'), type );
    },
    
    trigger : function( type ) {
        type = typeof type == 'object' ? 
            this.mix( type, { scope: this } ) : 
            { type: type, scope: this };
        this.dispatch( this.get('container'), type );
        return this;
    },
    
    addIdleState: function() {
        this.idle.add.apply(this, arguments);
        return this;
    },
    
    removeIdleState: function() {
        this.idle.remove.apply(this, arguments);
        return this;
    },
    
    enterIdleMode: function() {
        this.idle.hide();
        return this;
    },
    
    exitIdleMode: function() {
        this.idle.show();
        return this;
    },
    
    addTimer: function() {
        this.timeouts.add.apply(this.timeouts, arguments);
        return this;
    },
    
    clearTimer: function() {
        this.timeouts.clear.apply(this.timeouts, arguments);
        return this;
    },
    
    enterFullscreen: function() {
        this.fullscreen.enter.apply(this, arguments);
        return this;
    },
    
    exitFullscreen: function() {
        this.fullscreen.exit.apply(this, arguments);
        return this;
    },
    
    openLightbox: function() {
        this.lightbox.show.apply(this, arguments);
    },
    
    closeLightbox: function() {
        this.lightbox.hide.apply(this, arguments);
    },
    
    getActive: function() {
        return this.controls.getActive();
    },
    
    getActiveImage: function() {
        return this.getActive().image || null;
    },
    
    run : function() {
        var o = this.options;
        if (!this.data.length) {
            G.raise('Data is empty.');
        }
        if (!o.keep_source && !Galleria.IE) {
            this.target.innerHTML = '';
        }
        this.loop(2, function() {
            var image = new Picture();
            this.setStyle( image.elem, {
                position: 'absolute',
                top: 0,
                left: 0
            });
            this.setStyle(this.get( 'images' ), {
                position: 'relative',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            });
            this.get( 'images' ).appendChild( image.elem );
            this.push(image, this.controls);
        }, this);
        
        if (o.carousel) {
            // try the carousel on each thumb load
            this.bind(G.THUMBNAIL, this.parseCarousel);
        }
        
        this.build();
        this.target.appendChild(this.get('container'));
        
        this.loop(['info','counter','image-nav'], function(el) {
            if ( o[ 'show_'+el.replace(/-/,'') ] === false ) {
                this.moveOut( this.get(el) );
            }
        });
        
        var w = 0;
        var h = 0;
        
        for( var i=0; this.data[i]; i++ ) {
            var thumb;
            if (o.thumbnails === true) {
                thumb = new Picture(i);
                var src = this.data[i].thumb || this.data[i].image;
                
                this.get( 'thumbnails' ).appendChild( thumb.elem );
                
                w = this.getStyle(thumb.elem, 'width', true);
                h = this.getStyle(thumb.elem, 'height', true);
                
                // grab & reset size for smoother thumbnail loads
                if (o.thumb_fit && o.thum_crop !== true) {
                    this.setStyle(thumb.elem, { width:0, height: 0});
                }
                
                thumb.load(src, this.proxy(function(e) {
                    var orig = e.target.width;
                    e.scope.scale({
                        width: w,
                        height: h,
                        crop: o.thumb_crop,
                        margin: o.thumb_margin,
                        complete: this.proxy(function() {
                            // shrink thumbnails to fit
                            var top = ['left', 'top'];
                            var arr = ['Height', 'Width'];
                            this.loop(arr, function(m,i) {
                                if ((!o.thumb_crop || o.thumb_crop == m.toLowerCase()) && o.thumb_fit) {
                                    var css = {};
                                    var opp = arr[Math.abs(i-1)].toLowerCase();
                                    css[opp] = e.target[opp];
                                    this.setStyle(e.target.parentNode, css);
                                    var css = {};
                                    css[top[i]] = 0;
                                    this.setStyle(e.target, css);
                                }
                                e.scope['outer'+m] = this[m.toLowerCase()](e.target.parentNode, true);
                            });
                            // set high quality if downscale is moderate
                            this.toggleQuality(e.target, o.thumb_quality === true || ( o.thumb_quality == 'auto' && orig < e.target.width * 3 ));
                            this.trigger({
                                type: G.THUMBNAIL,
                                thumbTarget: e.target,
                                thumbOrder: e.scope.order
                            });
                        })
                    });
                }));
                if (o.preload == 'all') {
                    thumb.add(this.data[i].image);
                }
            } else if (o.thumbnails == 'empty') {
                thumb = {
                    elem:  this.create('div','galleria-image'),
                    image: this.create('span','img')
                };
                thumb.elem.appendChild(thumb.image);
                this.get( 'thumbnails' ).appendChild( thumb.elem );
            } else {
                thumb = {
                    elem: false,
                    image: false
                }
            }
            var activate = this.proxy(function(e) {
                this.pause();
                e.preventDefault();
                var ind = e.currentTarget.rel;
                if (this.active !== ind) {
                    this.show( ind );
                }
            });
            if (o.thumbnails !== false) {
                thumb.elem.rel = i;
                this.listen(thumb.elem, 'click', activate);
            }
            if (o.link_source_images && o.keep_source && this.data[i].elem) {
                this.data[i].elem.rel = i;
                this.listen(this.data[i].elem, 'click', activate);
            }
            this.push(thumb, this.thumbnails );
        }
        this.setStyle( this.get('thumbnails'), { opacity: 0 } );
        
        if (o.height && o.height != 'auto') {
            this.setStyle( this.get('container'), { height: o.height })
        }
        
        this.wait(function() {
            // the most sensitive piece of code in Galleria, we need to have all the meassurements right to continue
            var cssHeight = this.getStyle( this.get( 'container' ), 'height', true );
            this.stageWidth = this.width(this.get( 'stage' ));
            this.stageHeight = this.height( this.get( 'stage' ));
            if (this.stageHeight < 50 && o.height == 'auto') {
                // no height detected for sure, set reasonable ratio (16/9)
                this.setStyle( this.get( 'container' ),  { 
                    height: Math.round( this.stageWidth*9/16 ) 
                } );
                this.stageHeight = this.height( this.get( 'stage' ));
            }
            return this.stageHeight && this.stageWidth;
        }, function() {
            this.listen(this.get('image-nav-right'), 'click', this.proxy(function(e) {
                if (o.clicknext) {
                    e.stopPropagation();
                }
                this.pause();
                this.next();
            }));
            this.listen(this.get('image-nav-left'), 'click', this.proxy(function(e) {
                if (o.clicknext) {
                    e.stopPropagation();
                }
                this.pause();
                this.prev();
            }));
            this.setStyle( this.get('thumbnails'), { opacity: 1 } );
            this.trigger( G.READY );
        }, function() {
            G.raise('Galleria could not load properly. Make sure stage has a height and width.');
        }, 5000);
    },
    
    mousePosition : function(e) {
        return {
            x: e.pageX - this.$('stage').offset().left + jQuery(document).scrollLeft(),
            y: e.pageY - this.$('stage').offset().top + jQuery(document).scrollTop()
        };
    },
    
    addPan : function(img) {
        var c = this.options.image_crop;
        if ( c === false ) {
            return;
        }
        if (this.options.image_crop === false) {
            return;
        }
        img = img || this.controls.getActive().image;
        if (img.tagName.toUpperCase() != 'IMG') {
            G.raise('Could not add pan');
        }
        
        var x = img.width/2;
        var y = img.height/2;
        var curX = destX = this.getStyle(img, 'left', true) || 0;
        var curY = destY = this.getStyle(img, 'top', true) || 0;
        var distX = 0;
        var distY = 0;
        var active = false;
        var ts = new Date().getTime();
        var calc = this.proxy(function(e) {
            if (new Date().getTime() - ts < 50) {
                return;
            }
            active = true;
            x = this.mousePosition(e).x;
            y = this.mousePosition(e).y;
        });
        var loop = this.proxy(function(e) {
            if (!active) {
                return;
            }
            distX = img.width - this.stageWidth;
            distY = img.height - this.stageHeight;
            destX = x / this.stageWidth * distX * -1;
            destY = y / this.stageHeight * distY * -1;
            curX += (destX - curX) / this.options.image_pan_smoothness;
            curY += (destY - curY) / this.options.image_pan_smoothness;
            if (distY > 0) {
                this.setStyle(img, { top: Math.max(distY*-1, Math.min(0, curY)) });
            }
            if (distX > 0) {
                this.setStyle(img, { left: Math.max(distX*-1, Math.min(0, curX)) });
            }
        });
        this.forget(this.get('stage'), 'mousemove');
        this.listen(this.get('stage'), 'mousemove', calc);
        this.addTimer('pan', loop, 30, true);
    },
    
    removePan: function() {
        this.forget(this.get('stage'), 'mousemove');
        this.clearTimer('pan');
    },
    
    parseCarousel : function(e) {
        var w = 0;
        var h = 0;
        var hooks = [0];
        this.loop(this.thumbnails, function(thumb,i) {
            if (thumb.ready) {
                w += thumb.outerWidth || this.width(thumb.elem, true);
                hooks[i+1] = w;
                h = Math.max(h, this.height(thumb.elem));
            }
        });
        this.toggleClass(this.get('thumbnails-container'), 'galleria-carousel', w > this.stageWidth);
        this.setStyle(this.get('thumbnails-list'), {
            overflow:'hidden',
            position: 'relative' // for IE Standards mode
        });
        this.setStyle(this.get('thumbnails'), {
            width: w,
            height: h,
            position: 'relative',
            overflow: 'hidden'
        });
        if (!this.carousel) {
            this.initCarousel();
        }
        this.carousel.max = w;
        this.carousel.hooks = hooks;
        this.carousel.width = this.width(this.get('thumbnails-list'));
        this.carousel.setClasses();
    },
    
    initCarousel : function() {
        var c = this.carousel = {
            right: this.get('thumb-nav-right'),
            left: this.get('thumb-nav-left'),
            update: this.proxy(function() {
                this.parseCarousel();
                // todo: fix so the carousel moves to the left
            }),
            width: 0,
            current: 0,
            set: function(i) {
                i = Math.max(i,0);
                while (c.hooks[i-1] + c.width > c.max && i >= 0) {
                    i--;
                }
                c.current = i;
                c.animate();
            },
            hooks: [],
            getLast: function(i) {
                i = i || c.current
                
                return i-1;
            },
            follow: function(i) {
                if (i == 0 || i == c.hooks.length-2) {
                    c.set(i);
                    return;
                }
                var last = c.current;
                while(c.hooks[last] - c.hooks[c.current] < c.width && last<= c.hooks.length) {
                    last++;
                }
                if (i-1 < c.current) {
                    c.set(i-1)
                } else if (i+2 > last) {
                    c.set(i - last + c.current + 2)
                }
            },
            max: 0,
            setClasses: this.proxy(function() {
                this.toggleClass( c.left, 'disabled', !c.current );
                this.toggleClass( c.right, 'disabled', c.hooks[c.current] + c.width > c.max );
            }),
            animate: this.proxy(function(to) {
                c.setClasses();
                this.animate( this.get('thumbnails'), {
                    to: { left: c.hooks[c.current] * -1 },
                    duration: this.options.carousel_speed,
                    easing: 'galleria',
                    queue: false
                });
            })
        };
        this.listen(c.right, 'click', this.proxy(function(e) {
            if (this.options.carousel_steps == 'auto') {
                for (var i = c.current; i<c.hooks.length; i++) {
                    if (c.hooks[i] - c.hooks[c.current] > c.width) {
                        c.set(i-2);
                        break;
                    }
                }
            } else {
                c.set(c.current + this.options.carousel_steps);
            }
        }));
        this.listen(c.left, 'click', this.proxy(function(e) {
            if (this.options.carousel_steps == 'auto') {
                for (var i = c.current; i>=0; i--) {
                    if (c.hooks[c.current] - c.hooks[i] > c.width) {
                        c.set(i+2);
                        break;
                    } else if (i == 0) {
                        c.set(0);
                        break;
                    }
                }
            } else {
                c.set(c.current - this.options.carousel_steps);
            }
        }));
    },
    addElement : function() {
        this.loop(arguments, function(b) {
            this.dom[b] = this.create('div', 'galleria-' + b );
        });
        return this;
    },
    getDimensions: function(i) {
        return {
            w: i.width,
            h: i.height,
            cw: this.stageWidth,
            ch: this.stageHeight,
            top: (this.stageHeight - i.height) / 2,
            left: (this.stageWidth - i.width) / 2
        };
    },
    attachKeyboard : function(map) {
        this.keyboard.attach(map);
        return this;
    },
    detachKeyboard : function() {
        this.keyboard.detach();
        return this;
    },
    build : function() {
        this.append({
            'info-text' :
                ['info-title', 'info-description', 'info-author'],
            'info' : 
                ['info-text'],
            'image-nav' : 
                ['image-nav-right', 'image-nav-left'],
            'stage' : 
                ['images', 'loader', 'counter', 'image-nav'],
            'thumbnails-list' :
                ['thumbnails'],
            'thumbnails-container' : 
                ['thumb-nav-left', 'thumbnails-list', 'thumb-nav-right'],
            'container' : 
                ['stage', 'thumbnails-container', 'info']
        });
        
        this.current = this.create('span', 'current');
        this.current.innerHTML = '-';
        this.get('counter').innerHTML = ' / <span class="total">' + this.data.length + '</span>';
        this.prependChild('counter', this.current);
    },
    
    appendChild : function(parent, child) {
        try {
            this.get(parent).appendChild(this.get(child));
        } catch(e) {}
    },
    
    prependChild : function(parent, child) {
        var child = this.get(child) || child;
        try {
            this.get(parent).insertBefore(child, this.get(parent).firstChild);
        } catch(e) {}
    },
    
    remove : function() {
        var a = Array.prototype.slice.call(arguments);
        this.jQuery(a.join(',')).remove();
    },
    
    append : function(data) {
        for( var i in data) {
            if (data[i].constructor == Array) {
                for(var j=0; data[i][j]; j++) {
                    this.appendChild(i, data[i][j]);
                }
            } else {
                this.appendChild(i, data[i]);
            }
        }
        return this;
    },
    
    rescale : function(width, height, callback) {
        
        var o = this.options;
        callback = this.proxy(callback);
        
        if (typeof width == 'function') {
            callback = this.proxy(width);
            width = undefined;
        }
        
        var scale = this.proxy(function() {
            this.stageWidth = width || this.width(this.get('stage'));
            this.stageHeight = height || this.height(this.get('stage'));
            this.controls.getActive().scale({
                width: this.stageWidth, 
                height: this.stageHeight, 
                crop: o.image_crop, 
                max: o.max_scale_ratio,
                min: o.min_scale_ratio,
                margin: o.image_margin,
                position: o.image_position
            });
            if (this.carousel) {
                this.carousel.update();
            }
            this.trigger(G.RESCALE)
            callback();
        });
        if ( G.WEBKIT && !width && !height ) {
            this.addTimer('scale', scale, 5);// webkit is too fast
        } else {
            scale.call(this); 
        }
    },
    
    show : function(index, rewind, history) {
        if (!this.options.queue && this.queue.stalled) {
            return;
        }
        rewind = typeof rewind != 'undefined' ? !!rewind : index < this.active;
        history = history || false;
        index = Math.max(0, Math.min(parseInt(index), this.data.length - 1));
        if (!history && G.History) {
            G.History.value(index.toString());
            return;
        }
        this.active = index;
        this.push([index,rewind], this.queue);
        if (!this.queue.stalled) {
            this.showImage();
        }
        return this;
    },
    
    showImage : function() {
        var o = this.options;
        var args = this.queue[0];
        var index = args[0];
        var rewind = !!args[1];
        if (o.carousel && this.carousel && o.carousel_follow) {
            this.carousel.follow(index);
        }
        
        var src = this.getData(index).image;
        var active = this.controls.getActive();
        var next = this.controls.getNext();
        var cached = next.isCached(src);
        var complete = this.proxy(function() {
            this.queue.stalled = false;
            this.toggleQuality(next.image, o.image_quality);
            this.setStyle( active.elem, { zIndex : 0 } );
            this.setStyle( next.elem, { zIndex : 1 } );
            this.trigger({
                type: G.IMAGE,
                index: index,
                imageTarget: next.image,
                thumbTarget: this.thumbnails[index].image
            });
            if (o.image_pan) {
                this.addPan(next.image);
            }
            this.controls.swap();
            this.moveOut( active.image );
            if (this.getData( index ).link) {
                this.setStyle( next.image, { cursor: 'pointer' } );
                this.listen( next.image, 'click', this.proxy(function() {
                    if (o.popup_links) {
                        var win = window.open(this.getData( index ).link, '_blank');
                    } else {
                        window.location.href = this.getData( index ).link;
                    }
                }));
            }
            Array.prototype.shift.call( this.queue );
            if (this.queue.length) {
                this.showImage();
            }
            this.playCheck();
        });
        if (typeof o.preload == 'number' && o.preload > 0) {
            var p,n = this.getNext();
            try {
                for (var i = o.preload; i>0; i--) {
                    p = new Picture();
                    p.add(this.getData(n).image);
                    n = this.getNext(n);
                }
            } catch(e) {}
        }
        this.trigger( {
            type: G.LOADSTART,
            cached: cached,
            index: index,
            imageTarget: next.image,
            thumbTarget: this.thumbnails[index].image
        } );
        
        jQuery(this.thumbnails[index].elem).addClass('active').siblings('.active').removeClass('active');
        
        next.load( src, this.proxy(function(e) {
            next.scale({
                width: this.stageWidth, 
                height: this.stageHeight, 
                crop: o.image_crop, 
                max: o.max_scale_ratio, 
                min: o.min_scale_ratio,
                margin: o.image_margin,
                position: o.image_position,
                complete: this.proxy(function() {
                    if (active.image) {
                        this.toggleQuality(active.image, false);
                    }
                    this.toggleQuality(next.image, false);
                    this.trigger({
                        type: G.LOADFINISH,
                        cached: cached,
                        index: index,
                        imageTarget: next.image,
                        thumbTarget: this.thumbnails[index].image
                    });
                    this.queue.stalled = true;
                    var transition = G.transitions[o.transition] || o.transition;
                    this.removePan();
                    this.setInfo(index);
                    this.setCounter(index);
                    if (typeof transition == 'function') {
                        transition.call(this, {
                            prev: active.image,
                            next: next.image,
                            rewind: rewind,
                            speed: o.transition_speed || 400
                        }, complete );
                    } else {
                        complete();
                    }
                })
            });
        }));
    },
    
    getNext : function(base) {
        base = typeof base == 'number' ? base : this.active;
        return base == this.data.length - 1 ? 0 : base + 1;
    },
    
    getPrev : function(base) {
        base = typeof base == 'number' ? base : this.active;
        return base === 0 ? this.data.length - 1 : base - 1;
    },
    
    next : function() {
        if (this.data.length > 1) {
            this.show(this.getNext(), false);
        }
        return this;
    },
    
    prev : function() {
        if (this.data.length > 1) {
            this.show(this.getPrev(), true);
        }
        return this;
    },
    
    get : function( elem ) {
        return elem in this.dom ? this.dom[ elem ] : null;
    },
    
    getData : function( index ) {
        return this.data[index] || this.data[this.active];
    },
    
    getIndex : function() {
        return typeof this.active === 'number' ? this.active : 0;
    },
    
    play : function(delay) {
        this.trigger( G.PLAY );
        this.playing = true;
        this.playtime = delay || this.playtime;
        this.playCheck();
        return this;
    },
    
    pause : function() {
        this.trigger( G.PAUSE );
        this.playing = false;
        return this;
    },
    
    playCheck : function() {
        var p = 0;
        var i = 20; // the interval
        var ts = function() {
            return new Date().getTime();
        }
        var now = ts();
        if (this.playing) {
            this.clearTimer('play');
            var fn = this.proxy(function() {
                p = ts() - now;
                if ( p >= this.playtime && this.playing ) {
                    this.clearTimer('play');
                    this.next();
                    return;
                }
                if ( this.playing ) {
                    this.trigger({
                        type: G.PROGRESS,
                        percent: Math.ceil(p / this.playtime * 100),
                        seconds: Math.floor(p/1000),
                        milliseconds: p
                    });
                    this.addTimer('play', fn, i);
                }
            });
            this.addTimer('play', fn, i);
        }
    },
    
    setActive: function(val) {
        this.active = val;
        return this;
    },
    
    setCounter: function(index) {
        index = index || this.active;
        this.current.innerHTML = index+1;
        return this;
    },
    
    setInfo : function(index) {
        var data = this.getData(index || this.active);
        this.loop(['title','description','author'], function(type) {
            var elem = this.get('info-'+type);
            var fn = data[type] && data[type].length ? 'reveal' : 'hide';
            this[fn](elem);
            if (data[type]) {
                elem.innerHTML = data[type];
            }
        });
        return this;
    },
    
    hasInfo : function(index) {
        var d = this.getData(index);
        var check = 'title description author'.split(' ');
        for ( var i=0; check[i]; i++ ) {
            if ( d[ check[i] ] && d[ check[i] ].length ) {
                return true;
            }
        }
        return false;
    },
    
    getDataObject : function(o) {
        var obj = {
            image: '',
            thumb: '',
            title: '',
            description: '',
            author: '',
            link: ''
        };
        return o ? this.mix(obj,o) : obj;
    },
    
    jQuery : function( str ) {
        var ret = [];
        this.loop(str.split(','), this.proxy(function(elem) {
            elem = elem.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
            if (this.get(elem)) {
                ret.push(elem);
            }
        }));
        var jQ = jQuery(this.get(ret.shift()));
        this.loop(ret, this.proxy(function(elem) {
            jQ = jQ.add(this.get(elem));
        }));
        return jQ;
    },
    
    $ : function( str ) {
        return this.jQuery( str );
    },
    
    toggleQuality : function(img, force) {
        if (!G.IE7 || typeof img == 'undefined' || !img) {
            return this;
        }
        if (typeof force === 'undefined') {
            force = img.style.msInterpolationMode == 'nearest-neighbor';
        }
        img.style.msInterpolationMode = force ? 'bicubic' : 'nearest-neighbor';

        return this;
    },
    
    unload : function() {
        //TODO
    },
    
    load : function() {
        var loaded = 0;
        var o = this.options;
        if (
            (o.data_type == 'auto' && 
                typeof o.data_source == 'object' && 
                !(o.data_source instanceof jQuery) && 
                !o.data_source.tagName
            ) || o.data_type == 'json' || o.data_source.constructor == Array ) {
            this.data = o.data_source;
            this.trigger( G.DATA );
            
        } else { // assume selector
            var images = jQuery(o.data_source).find(o.data_image_selector);
            var getData = this.proxy(function( elem ) {
                var i,j,anchor = elem.parentNode;
                if (anchor && anchor.nodeName == 'A') {
                    if (anchor.href.match(/\.(png|gif|jpg|jpeg)/i)) {
                        i = anchor.href;
                    } else {
                        j = anchor.href;
                    }
                }
                var obj = this.getDataObject({
                    title: elem.title,
                    thumb: elem.src,
                    image: i || elem.src,
                    description: elem.alt,
                    link: j || elem.getAttribute('longdesc'),
                    elem: elem
                });
                return this.mix(obj, o.data_config( elem ) );
            });
            this.loop(images, function( elem ) {
                loaded++;
                this.push( getData( elem ), this.data );
                if (!o.keep_source && !Galleria.IE) {
                    elem.parentNode.removeChild(elem);
                }
                if ( loaded == images.length ) {
                    this.trigger( G.DATA );
                }
            });
        }
    }
});

G.log = function() {
    try { 
        console.log.apply( console, Array.prototype.slice.call(arguments) ); 
    } catch(e) {
        try {
            opera.postError.apply( opera, arguments ); 
        } catch(er) { 
              alert( Array.prototype.join.call( arguments, " " ) ); 
        } 
    }
};

var nav = navigator.userAgent.toLowerCase();
var hash = window.location.hash.replace(/#\//,'');

G.DATA = 'data';
G.READY = 'ready';
G.THUMBNAIL = 'thumbnail';
G.LOADSTART = 'loadstart';
G.LOADFINISH = 'loadfinish';
G.IMAGE = 'image';
G.THEMELOAD = 'themeload';
G.PLAY = 'play';
G.PAUSE = 'pause';
G.PROGRESS = 'progress';
G.FULLSCREEN_ENTER = 'fullscreen_enter';
G.FULLSCREEN_EXIT = 'fullscreen_exit';
G.IDLE_ENTER = 'idle_enter';
G.IDLE_EXIT = 'idle_exit';
G.RESCALE = 'rescale';
G.LIGHTBOX_OPEN = 'lightbox_open';
G.LIGHTBOX_CLOSE = 'lightbox_cloe';
G.LIGHTBOX_IMAGE = 'lightbox_image';

G.IE8 = (typeof(XDomainRequest) !== 'undefined')
G.IE7 = !!(window.XMLHttpRequest && document.expando);
G.IE6 = (!window.XMLHttpRequest);
G.IE = !!(G.IE6 || G.IE7);
G.WEBKIT = /webkit/.test( nav );
G.SAFARI = /safari/.test( nav );
G.CHROME = /chrome/.test( nav );
G.QUIRK = (G.IE && document.compatMode && document.compatMode == "BackCompat");
G.MAC = /mac/.test(navigator.platform.toLowerCase());
G.OPERA = !!window.opera

G.Picture = Picture;

G.addTheme = function(obj) {
    var theme = {};
    var orig = ['name','author','version','defaults','init'];
    var proto = G.prototype;
    proto.loop(orig, function(val) {
        if (!obj[ val ]) {
            G.raise(val+' not specified in theme.');
        }
        if (val != 'name' && val != 'init') {
            theme[val] = obj[val];
        }
    });
    theme.init = obj.init;
    
    if (obj.css) {
        var css;
        proto.loop(proto.getElements('script'), function(el) {
            var reg = new RegExp('galleria.' + obj.name.toLowerCase() + '.js');
            if(reg.test(el.src)) {
                css = el.src.replace(/[^\/]*$/, "") + obj.css;
                proto.loadCSS(css, function() {
                    G.theme = theme;
                    jQuery(document).trigger( G.THEMELOAD );
                });
            }
        });
        if (!css) {
            G.raise('No theme CSS loaded');
        }
    }
    return theme;
};

G.raise = function(msg) {
    if ( G.debug ) {
        throw new Error( msg );
    }
};

G.loadTheme = function(src) {
    G.prototype.loadScript(src);
};

G.galleries = [];
G.get = function(index) {
    if (G.galleries[index]) {
        return G.galleries[index];
    } else if (typeof index !== 'number') {
        return G.galleries;
    } else {
        G.raise('Gallery index not found');
    }
}

jQuery.easing.galleria = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) { 
        return c/2*t*t*t*t + b;
    }
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
};

G.transitions = {
    add: function(name, fn) {
        if (name != arguments.callee.name ) {
            this[name] = fn;
        }
    },
    fade: function(params, complete) {
        jQuery(params.next).show().css('opacity',0).animate({
            opacity: 1
        }, params.speed, complete);
        if (params.prev) {
            jQuery(params.prev).css('opacity',1).animate({
                opacity: 0
            }, params.speed);
        }
    },
    flash: function(params, complete) {
        jQuery(params.next).css('opacity',0);
        if (params.prev) {
            jQuery(params.prev).animate({
                opacity: 0
            }, (params.speed/2), function() {
                jQuery(params.next).animate({
                    opacity: 1
                }, params.speed, complete);
            });
        } else {
            jQuery(params.next).animate({
                opacity: 1
            }, params.speed, complete);
        }
    },
    pulse: function(params, complete) {
        if (params.prev) {
            jQuery(params.prev).css('opacity',0);
        }
        jQuery(params.next).css('opacity',0).animate({
            opacity:1
        }, params.speed, complete);
    },
    slide: function(params, complete) {
        var image = jQuery(params.next).parent();
        var images =  this.$('images');
        var width = this.stageWidth;
        image.css({
            left: width * ( params.rewind ? -1 : 1 )
        });
        images.animate({
            left: width * ( params.rewind ? 1 : -1 )
        }, {
            duration: params.speed,
            queue: false,
            easing: 'galleria',
            complete: function() {
                images.css('left',0);
                image.css('left',0);
                complete();
            }
        });
    },
    fadeslide: function(params, complete) {
        if (params.prev) {
            jQuery(params.prev).css({
                opacity: 1,
                left: 0
            }).animate({
                opacity: 0,
                left: 50 * ( params.rewind ? 1 : -1 )
            },{
                duration: params.speed,
                queue: false,
                easing: 'swing'
            });
        }
        jQuery(params.next).css({
            left: 50 * ( params.rewind ? -1 : 1 ), 
            opacity: 0
        }).animate({
            opacity: 1,
            left:0
        }, {
            duration: params.speed,
            complete: complete,
            queue: false,
            easing: 'swing'
        });
    }
};

G.addTransition = function() {
    G.transitions.add.apply(this, arguments);
}

jQuery.fn.galleria = function(options) {
    
    options = options || {};
    var selector = this.selector;
    
    return this.each(function() {
        if ( !options.keep_source ) {
            jQuery(this).children().hide();
        }
    
        options = G.prototype.mix(options, {target: this} );
        var height = G.prototype.height(this) || G.prototype.getStyle(this, 'height', true);
        if (!options.height && height) {
            options = G.prototype.mix( { height: height }, options );
        }
    
        G.debug = !!options.debug;
    
        var gallery = new G(options);
        
        Galleria.galleries.push(gallery);
    
        if (G.theme) {
            gallery.init();
        } else {
            jQuery(document).bind(G.THEMELOAD, function() {
                gallery.init();
            });
        }
    })
};


})();

/*---------------------------------------------------------------------------
 Contents from: jquery.ui.map.full.min.js
---------------------------------------------------------------------------*/

/*! jquery-ui-map rc1 | Johan Säll Larsson */
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('(3(d){d.a=3(a,b){j c=a.w(".")[0],a=a.w(".")[1];d[c]=d[c]||{};d[c][a]=3(a,b){K.I&&2.16(a,b)};d[c][a].J=d.n({1A:c,1z:a},b);d.S[a]=3(b){j g="1y"===1D b,f=H.J.12.15(K,1),i=2;l(g&&"1C"===b.1B(0,1))9 i;2.13(3(){j h=d.Z(2,a);h||(h=d.Z(2,a,k d[c][a](b,2)));l(g&&(h=h[b].10(h,f),"4"===b||o!=h))i=h});9 i}};d.a("1x.1t",{r:{1s:"1r",1w:5},1v:3(a,b){l(b)2.r[a]=b,2.4("8").B(a,b);P 9 2.r[a]},16:3(a,b){2.C=b;a=a||{};m.n(2.r,a,{1e:2.D(a.1e)});2.1c();2.1j&&2.1j()},1c:3(){j a=2;2.q={8:k 6.7.1u(a.C,a.r),L:[],t:[],u:[]};6.7.s.1N(a.q.8,"1M",3(){d(a.C).19("1L",a.q.8)});a.F(a.r.1Q,a.q.8)},1d:3(a){j b=2.4("1i",k 6.7.1P);b.n(2.D(a));2.4("8").1O(b)},1K:3(a){j b=2.4("8").1G();9 b?b.1F(a.18()):!1},1E:3(a,b){2.4("8").1J[b].O(2.z(a))},1I:3(a,b){a.8=2.4("8");a.Y=2.D(a.Y);j c=k(a.1H||6.7.1k)(a),e=2.4("L");c.V?e[c.V]=c:e.O(c);c.1i&&2.1d(c.18());2.F(b,a.8,c);9 d(c)},y:3(a){2.G(2.4(a));2.B(a,[])},G:3(a){A(j b R a)a.U(b)&&(a[b]p 6.7.T?(6.7.s.X(a[b]),a[b].x&&a[b].x(o)):a[b]p H&&2.G(a[b]),a[b]=o)},1p:3(a,b,c){a=2.4(a);b.v=d.1l(b.v)?b.v:[b.v];A(j e R a)l(a.U(e)){j g=!1,f;A(f R b.v)l(-1<d.1n(b.v[f],a[e][b.1q]))g=!0;P l(b.11&&"1m"===b.11){g=!1;1o}c(a[e],g)}},4:3(a,b){j c=2.q;l(!c[a]){l(-1<a.2i(">")){A(j e=a.14(/ /g,"").w(">"),d=0;d<e.I;d++){l(!c[e[d]])l(b)c[e[d]]=d+1<e.I?[]:b;P 9 o;c=c[e[d]]}9 c}b&&!c[a]&&2.B(a,b)}9 c[a]},2h:3(a,b,c){j d=2.4("Q",a.2j||k 6.7.2l);d.M(a);d.2k(2.4("8"),2.z(b));2.F(c,d)},2d:3(){o!=2.4("Q")&&2.4("Q").2c()},B:3(a,b){2.q[a]=b},2e:3(){j a=2.4("8"),b=a.2g();d(a).17("2f");a.2m(b)},2r:3(){2.y("L");2.y("u");2.y("t");2.G(2.q);m.2s(2.C,2.2t)},F:3(a){a&&d.2o(a)&&a.10(2,H.J.12.15(K,1))},D:3(a){l(!a)9 k 6.7.N(0,0);l(a p 6.7.N)9 a;a=a.14(/ /g,"").w(",");9 k 6.7.N(a[0],a[1])},z:3(a){9!a?o:a p m?a[0]:a p 2n?a:d("#"+a)[0]},2q:3(a,b){j c=k 6.7[a](m.n({8:2.4("8")},b));2.4("t > "+a,[]).O(c);9 d(c)},2p:3(a,b){(!b?2.4("t > E",k 6.7.E):2.4("t > E",k 6.7.E(b,a))).M(m.n({8:2.4("8")},a))},2b:3(a,b,c){2.4("t > "+a,k 6.7.1X(b,m.n({8:2.4("8")},c)))},1W:3(a,b,c){j d=2,g=2.4("u > 1f",k 6.7.1f),f=2.4("u > 1g",k 6.7.1g);b&&f.M(b);g.1Y(a,3(a,b){"20"===b?(f.1Z(a),f.x(d.4("8"))):f.x(o);c(a,b)})},1S:3(a,b){2.4("8").1R(2.4("u > 1a",k 6.7.1a(2.z(a),b)))},1T:3(a,b){2.4("u > 1b",k 6.7.1b).1V(a,b)}});m.S.n({17:3(a){6.7.s.19(2[0],a);9 2},W:3(a,b,c){6.7&&2[0]p 6.7.T?6.7.s.1U(2[0],a,b):c?2.1h(a,b,c):2.1h(a,b);9 2},27:3(a){6.7&&2[0]p 6.7.T?a?6.7.s.26(2[0],a):6.7.s.X(2[0]):2.28(a);9 2}});m.13("2a 29 22 21 23 25 24".w(" "),3(a,b){m.S[b]=3(a,d){9 2.W(b,a,d)}})})(m);',62,154,'||this|function|get||google|maps|map|return||||||||||var|new|if|jQuery|extend|null|instanceof|instance|options|event|overlays|services|value|split|setMap|clear|_unwrap|for|set|el|_latLng|FusionTablesLayer|_call|_c|Array|length|prototype|arguments|markers|setOptions|LatLng|push|else|iw|in|fn|MVCObject|hasOwnProperty|id|addEventListener|clearInstanceListeners|position|data|apply|operator|slice|each|replace|call|_setup|triggerEvent|getPosition|trigger|StreetViewPanorama|Geocoder|_create|addBounds|center|DirectionsService|DirectionsRenderer|bind|bounds|_init|Marker|isArray|AND|inArray|break|find|property|roadmap|mapTypeId|gmap|Map|option|zoom|ui|string|pluginName|namespace|substring|_|typeof|addControl|contains|getBounds|marker|addMarker|controls|inViewport|init|bounds_changed|addListenerOnce|fitBounds|LatLngBounds|callback|setStreetView|displayStreetView|search|addListener|geocode|displayDirections|KmlLayer|route|setDirections|OK|mouseover|dblclick|mouseout|dragend|drag|clearListeners|removeEventListener|unbind|rightclick|click|loadKML|close|closeInfoWindow|refresh|resize|getCenter|openInfoWindow|indexOf|infoWindow|open|InfoWindow|setCenter|Object|isFunction|loadFusion|addShape|destroy|removeData|name'.split('|'),0,{}))

/*---------------------------------------------------------------------------
 Contents from: handlebars-1.0.rc.1.js
---------------------------------------------------------------------------*/

// lib/handlebars/base.js

/*jshint eqnull:true*/
this.Handlebars = {};

(function(Handlebars) {

Handlebars.VERSION = "1.0.rc.1";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      if (data) { data.index = i; }
      ret = ret + fn(context[i], { data: data });
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});

}(this.Handlebars));
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"DATA":27,"param":28,"STRING":29,"INTEGER":30,"BOOLEAN":31,"hashSegments":32,"hashSegment":33,"ID":34,"EQUALS":35,"pathSegments":36,"SEP":37,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",27:"DATA",29:"STRING",30:"INTEGER",31:"BOOLEAN",34:"ID",35:"EQUALS",37:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[17,1],[25,2],[25,1],[28,1],[28,1],[28,1],[28,1],[28,1],[26,1],[32,2],[32,1],[33,3],[33,3],[33,3],[33,3],[33,3],[21,1],[36,3],[36,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1]; 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]); 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]); 
break;
case 4: this.$ = new yy.ProgramNode([]); 
break;
case 5: this.$ = [$$[$0]]; 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 7: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1].inverse, $$[$0-1], $$[$0]); 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0-1].inverse, $$[$0]); 
break;
case 9: this.$ = $$[$0]; 
break;
case 10: this.$ = $$[$0]; 
break;
case 11: this.$ = new yy.ContentNode($$[$0]); 
break;
case 12: this.$ = new yy.CommentNode($$[$0]); 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 15: this.$ = $$[$0-1]; 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]); 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true); 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]); 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]); 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]]; 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null]; 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]]; 
break;
case 24: this.$ = [[$$[$0]], null]; 
break;
case 25: this.$ = [[new yy.DataNode($$[$0])], null]; 
break;
case 26: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 27: this.$ = [$$[$0]]; 
break;
case 28: this.$ = $$[$0]; 
break;
case 29: this.$ = new yy.StringNode($$[$0]); 
break;
case 30: this.$ = new yy.IntegerNode($$[$0]); 
break;
case 31: this.$ = new yy.BooleanNode($$[$0]); 
break;
case 32: this.$ = new yy.DataNode($$[$0]); 
break;
case 33: this.$ = new yy.HashNode($$[$0]); 
break;
case 34: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 35: this.$ = [$$[$0]]; 
break;
case 36: this.$ = [$$[$0-2], $$[$0]]; 
break;
case 37: this.$ = [$$[$0-2], new yy.StringNode($$[$0])]; 
break;
case 38: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])]; 
break;
case 39: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])]; 
break;
case 40: this.$ = [$$[$0-2], new yy.DataNode($$[$0])]; 
break;
case 41: this.$ = new yy.IdNode($$[$0]); 
break;
case 42: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 43: this.$ = [$$[$0]]; 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,27:[1,24],34:[1,26],36:25},{17:27,21:23,27:[1,24],34:[1,26],36:25},{17:28,21:23,27:[1,24],34:[1,26],36:25},{17:29,21:23,27:[1,24],34:[1,26],36:25},{21:30,34:[1,26],36:25},{1:[2,1]},{6:31,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,32],21:23,27:[1,24],34:[1,26],36:25},{10:33,20:[1,34]},{10:35,20:[1,34]},{18:[1,36]},{18:[2,24],21:41,25:37,26:38,27:[1,45],28:39,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25},{18:[2,25]},{18:[2,41],27:[2,41],29:[2,41],30:[2,41],31:[2,41],34:[2,41],37:[1,48]},{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],37:[2,43]},{18:[1,49]},{18:[1,50]},{18:[1,51]},{18:[1,52],21:53,34:[1,26],36:25},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:54,34:[1,26],36:25},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:41,26:55,27:[1,45],28:56,29:[1,42],30:[1,43],31:[1,44],32:40,33:46,34:[1,47],36:25},{18:[2,23]},{18:[2,27],27:[2,27],29:[2,27],30:[2,27],31:[2,27],34:[2,27]},{18:[2,33],33:57,34:[1,58]},{18:[2,28],27:[2,28],29:[2,28],30:[2,28],31:[2,28],34:[2,28]},{18:[2,29],27:[2,29],29:[2,29],30:[2,29],31:[2,29],34:[2,29]},{18:[2,30],27:[2,30],29:[2,30],30:[2,30],31:[2,30],34:[2,30]},{18:[2,31],27:[2,31],29:[2,31],30:[2,31],31:[2,31],34:[2,31]},{18:[2,32],27:[2,32],29:[2,32],30:[2,32],31:[2,32],34:[2,32]},{18:[2,35],34:[2,35]},{18:[2,43],27:[2,43],29:[2,43],30:[2,43],31:[2,43],34:[2,43],35:[1,59],37:[2,43]},{34:[1,60]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,61]},{18:[1,62]},{18:[2,21]},{18:[2,26],27:[2,26],29:[2,26],30:[2,26],31:[2,26],34:[2,26]},{18:[2,34],34:[2,34]},{35:[1,59]},{21:63,27:[1,67],29:[1,64],30:[1,65],31:[1,66],34:[1,26],36:25},{18:[2,42],27:[2,42],29:[2,42],30:[2,42],31:[2,42],34:[2,42],37:[2,42]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,36],34:[2,36]},{18:[2,37],34:[2,37]},{18:[2,38],34:[2,38]},{18:[2,39],34:[2,39]},{18:[2,40],34:[2,40]}],
defaultActions: {16:[2,1],24:[2,25],38:[2,23],55:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2:
                                   if(yy_.yytext.slice(-1) !== "\\") this.popState();
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1);
                                   return 14;
                                 
break;
case 3: return 24; 
break;
case 4: return 16; 
break;
case 5: return 20; 
break;
case 6: return 19; 
break;
case 7: return 19; 
break;
case 8: return 23; 
break;
case 9: return 23; 
break;
case 10: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 11: return 22; 
break;
case 12: return 35; 
break;
case 13: return 34; 
break;
case 14: return 34; 
break;
case 15: return 37; 
break;
case 16: /*ignore whitespace*/ 
break;
case 17: this.popState(); return 18; 
break;
case 18: this.popState(); return 18; 
break;
case 19: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 29; 
break;
case 20: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 29; 
break;
case 21: yy_.yytext = yy_.yytext.substr(1); return 27; 
break;
case 22: return 31; 
break;
case 23: return 31; 
break;
case 24: return 30; 
break;
case 25: return 34; 
break;
case 26: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 34; 
break;
case 27: return 'INVALID'; 
break;
case 28: return 5; 
break;
}
};
lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[} ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@[a-zA-Z]+)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:[0-9]+(?=[}\s]))/,/^(?:[a-zA-Z0-9_$-]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"mu":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"INITIAL":{"rules":[0,1,28],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.Parser = handlebars.Parser;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
    } else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
    this.type = "mustache";
    this.escaped = !unescaped;
    this.hash = hash;

    var id = this.id = rawParams[0];
    var params = this.params = rawParams.slice(1);

    // a mustache is an eligible helper if:
    // * its id is simple (a single part, not `this` or `..`)
    var eligibleHelper = this.eligibleHelper = id.isSimple;

    // a mustache is definitely a helper if:
    // * it is an eligible helper, and
    // * it has at least one parameter or hash segment
    this.isHelper = eligibleHelper && (params.length || hash);

    // if a mustache is an eligible helper but not a definite
    // helper, it is ambiguous, and will be resolved in a later
    // pass or at runtime.
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
    this.inverse  = inverse;

    if (this.inverse && !this.program) {
      this.isInverse = true;
    }
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;

    // an ID is simple if it only has one part, and that part is not
    // `..` or `this`.
    this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
  };

  Handlebars.AST.DataNode = function(id) {
    this.type = "DATA";
    this.id = id;
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js

/*jshint eqnull:true*/
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  // the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, out = [], params, param;

      for (var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if (opcode.opcode === 'DECLARE') {
          out.push("DECLARE " + opcode.name + "=" + opcode.value);
        } else {
          params = [];
          for (var j=0; j<opcode.args.length; j++) {
            param = opcode.args[j];
            if (typeof param === "string") {
              param = "\"" + param.replace("\n", "\\n") + "\"";
            }
            params.push(param);
          }
          out.push(opcode.opcode + " " + params.join(" "));
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var type = this.classifyMustache(mustache);

      if (type === "helper") {
        this.helperMustache(mustache, program, inverse);
      } else if (type === "simple") {
        this.simpleMustache(mustache);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{}');
        this.opcode('blockValue');
      } else {
        this.ambiguousMustache(mustache, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('pushLiteral', '{}');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var options = this.options;
      var type = this.classifyMustache(mustache);

      if (type === "simple") {
        this.simpleMustache(mustache);
      } else if (type === "helper") {
        this.helperMustache(mustache);
      } else {
        this.ambiguousMustache(mustache);
      }

      if(mustache.escaped && !options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousMustache: function(mustache, program, inverse) {
      var id = mustache.id, name = id.parts[0];

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.opcode('invokeAmbiguous', name);
    },

    simpleMustache: function(mustache, program, inverse) {
      var id = mustache.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperMustache: function(mustache, program, inverse) {
      var params = this.setupFullMustacheParams(mustache, program, inverse),
          name = mustache.id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.knownHelpersOnly) {
        throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
      } else {
        this.opcode('invokeHelper', params.length, name);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts[0]);
      }

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      this.opcode('lookupData', data.id);
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('pushLiteral', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: [].slice.call(arguments, 1) });
    },

    declare: function(name, value) {
      this.opcodes.push({ opcode: 'DECLARE', name: name, value: value });
    },

    addDepth: function(depth) {
      if(isNaN(depth)) { throw new Error("EWOT"); }
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifyMustache: function(mustache) {
      var isHelper   = mustache.isHelper;
      var isEligible = mustache.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      if (isEligible && !isHelper) {
        var name = mustache.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    setupMustacheParams: function(mustache) {
      var params = mustache.params;
      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushLiteral', '{}');
      }

      return params;
    },

    // this will replace setupMustacheParams when we're done
    setupFullMustacheParams: function(mustache, program, inverse) {
      var params = mustache.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if(mustache.hash) {
        this.hash(mustache.hash);
      } else {
        this.opcode('pushLiteral', '{}');
      }

      return params;
    }
  };

  var Literal = function(value) {
    this.value = value;
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      }
      else {
        return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { }
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.registers = { list: [] };
      this.compileStack = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = opcodes[this.i];

        if(opcode.opcode === 'DECLARE') {
          this[opcode.name] = opcode.value;
        } else {
          this[opcode.opcode].apply(this, opcode.args);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function() {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + 1];
      return opcodes[this.i + 1];
    },

    eat: function(opcode) {
      this.i = this.i + 1;
    },

    preamble: function() {
      var out = [];

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if (this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        if (this.options.data) { copies = copies + " data = data || {};"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars.concat(this.registers.list);

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = [];
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      this.replaceStack(function(current) {
        params.splice(1, 0, current);
        return current + " = blockHelperMissing.call(" + params.join(", ") + ")";
      });
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = ["depth0"];
      this.setupParams(0, params);

      var current = this.topStack();
      params.splice(1, 0, current);

      this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      var opcode = this.nextOpcode(), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode && opcode.opcode === 'appendContent') {
        extra = " + " + this.quotedString(opcode.args[0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(name) {
      this.pushStack(this.nameLookup('depth' + this.lastContext, name, 'context'));
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral('depth' + this.lastContext);
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.context.aliases.functionType = '"function"';

      this.replaceStack(function(current) {
        return "typeof " + current + " === functionType ? " + current + "() : " + current;
      });
    },

    // [lookup]
    //
    // On stack, before: value, ...
    // On stack, after: value[name], ...
    //
    // Replace the value on the stack with the result of looking
    // up `name` on `value`
    lookup: function(name) {
      this.replaceStack(function(current) {
        return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, 'context');
      });
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data[id], ...
    //
    // Push the result of looking up `id` on the current data
    lookupData: function(id) {
      this.pushStack(this.nameLookup('data', id, 'data'));
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string) {
      this.pushStackLiteral('depth' + this.lastContext);
      this.pushString(string);
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.pushStack(expr);
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name) {
      this.context.aliases.helperMissing = 'helpers.helperMissing';

      var helper = this.lastHelper = this.setupHelper(paramSize, name);
      this.register('foundHelper', helper.name);

      this.pushStack("foundHelper ? foundHelper.call(" +
        helper.callParams + ") " + ": helperMissing.call(" +
        helper.helperMissingParams + ")");
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.pushStack(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name) {
      this.context.aliases.functionType = '"function"';

      this.pushStackLiteral('{}');
      var helper = this.setupHelper(0, name);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');
      this.register('foundHelper', helperName);

      var nonHelper = this.nameLookup('depth' + this.lastContext, name, 'context');
      var nextStack = this.nextStack();

      this.source.push('if (foundHelper) { ' + nextStack + ' = foundHelper.call(' + helper.callParams + '); }');
      this.source.push('else { ' + nextStack + ' = ' + nonHelper + '; ' + nextStack + ' = typeof ' + nextStack + ' === functionType ? ' + nextStack + '() : ' + nextStack + '; }');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + name + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.context.aliases.self = "this";
      this.pushStack("self.invokePartial(" + params.join(", ") + ");");
    },

    // [assignToHash]
    //
    // On stack, before: value, hash, ...
    // On stack, after: hash, ...
    //
    // Pops a value and hash off the stack, assigns `hash[key] = value`
    // and pushes the hash back onto the stack.
    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      this.context.aliases.self = "this";

      if(guid == null) {
        return "self.noop";
      }

      var child = this.environment.children[guid],
          depths = child.depths.list, depth;

      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      this.compileStack.push(new Literal(item));
      return item;
    },

    pushStack: function(item) {
      this.source.push(this.incrStack() + " = " + item + ";");
      this.compileStack.push("stack" + this.stackSlot);
      return "stack" + this.stackSlot;
    },

    replaceStack: function(callback) {
      var item = callback.call(this, this.topStack());

      this.source.push(this.topStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function(skipCompileStack) {
      var name = this.incrStack();
      this.compileStack.push("stack" + this.stackSlot);
      return name;
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      var item = this.compileStack.pop();

      if (item instanceof Literal) {
        return item.value;
      } else {
        this.stackSlot--;
        return item;
      }
    },

    topStack: function() {
      var item = this.compileStack[this.compileStack.length - 1];

      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    },

    setupHelper: function(paramSize, name) {
      var params = [];
      this.setupParams(paramSize, params);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        name: foundHelper,
        callParams: ["depth0"].concat(params).join(", "),
        helperMissingParams: ["depth0", this.quotedString(name)].concat(params).join(", ")
      };
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(paramSize, params) {
      var options = [], contexts = [], param, inverse, program;

      options.push("hash:" + this.popStack());

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          this.context.aliases.self = "this";
          program = "self.noop";
        }

        if (!inverse) {
         this.context.aliases.self = "this";
          inverse = "self.noop";
        }

        options.push("inverse:" + inverse);
        options.push("fn:" + program);
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          contexts.push(this.popStack());
        }
      }

      if (this.options.stringParams) {
        options.push("contexts:[" + contexts.join(",") + "]");
      }

      if(this.options.data) {
        options.push("data:data");
      }

      params.push("{" + options.join(",") + "}");
      return params.join(", ");
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
      return true;
    }
    return false;
  };

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {};

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  options = options || {};

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;


/*---------------------------------------------------------------------------
 Contents from: purl-2.2.1.js
---------------------------------------------------------------------------*/

/*
 * JQuery URL Parser plugin, v2.2.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */ 

;(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD available; use anonymous module
		if ( typeof jQuery !== 'undefined' ) {
			define(['jquery'], factory);	
		} else {
			define([], factory);
		}
	} else {
		// No AMD available; mutate global vars
		if ( typeof jQuery !== 'undefined' ) {
			factory(jQuery);
		} else {
			factory();
		}
	}
})(function($, undefined) {
	
	var tag2attr = {
			a       : 'href',
			img     : 'src',
			form    : 'action',
			base    : 'href',
			script  : 'src',
			iframe  : 'src',
			link    : 'href'
		},
		
		key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query
		
		aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability
		
		parser = {
			strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
			loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
		},
		
		toString = Object.prototype.toString,
		
		isint = /^[0-9]+$/;
	
	function parseUri( url, strictMode ) {
		var str = decodeURI( url ),
		res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
		uri = { attr : {}, param : {}, seg : {} },
		i   = 14;
		
		while ( i-- ) {
			uri.attr[ key[i] ] = res[i] || '';
		}
		
		// build query and fragment parameters		
		uri.param['query'] = parseString(uri.attr['query']);
		uri.param['fragment'] = parseString(uri.attr['fragment']);
		
		// split path and fragement into segments		
		uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');     
		uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
		
		// compile a 'base' domain attribute        
		uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';      
		  
		return uri;
	};
	
	function getAttrName( elm ) {
		var tn = elm.tagName;
		if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
		return tn;
	}
	
	function promote(parent, key) {
		if (parent[key].length == 0) return parent[key] = {};
		var t = {};
		for (var i in parent[key]) t[i] = parent[key][i];
		parent[key] = t;
		return t;
	}

	function parse(parts, parent, key, val) {
		var part = parts.shift();
		if (!part) {
			if (isArray(parent[key])) {
				parent[key].push(val);
			} else if ('object' == typeof parent[key]) {
				parent[key] = val;
			} else if ('undefined' == typeof parent[key]) {
				parent[key] = val;
			} else {
				parent[key] = [parent[key], val];
			}
		} else {
			var obj = parent[key] = parent[key] || [];
			if (']' == part) {
				if (isArray(obj)) {
					if ('' != val) obj.push(val);
				} else if ('object' == typeof obj) {
					obj[keys(obj).length] = val;
				} else {
					obj = parent[key] = [parent[key], val];
				}
			} else if (~part.indexOf(']')) {
				part = part.substr(0, part.length - 1);
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
				// key
			} else {
				if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
				parse(parts, obj, part, val);
			}
		}
	}

	function merge(parent, key, val) {
		if (~key.indexOf(']')) {
			var parts = key.split('['),
			len = parts.length,
			last = len - 1;
			parse(parts, parent, 'base', val);
		} else {
			if (!isint.test(key) && isArray(parent.base)) {
				var t = {};
				for (var k in parent.base) t[k] = parent.base[k];
				parent.base = t;
			}
			set(parent.base, key, val);
		}
		return parent;
	}

	function parseString(str) {
		return reduce(String(str).split(/&|;/), function(ret, pair) {
			try {
				pair = decodeURIComponent(pair.replace(/\+/g, ' '));
			} catch(e) {
				// ignore
			}
			var eql = pair.indexOf('='),
				brace = lastBraceInKey(pair),
				key = pair.substr(0, brace || eql),
				val = pair.substr(brace || eql, pair.length),
				val = val.substr(val.indexOf('=') + 1, val.length);

			if ('' == key) key = pair, val = '';

			return merge(ret, key, val);
		}, { base: {} }).base;
	}
	
	function set(obj, key, val) {
		var v = obj[key];
		if (undefined === v) {
			obj[key] = val;
		} else if (isArray(v)) {
			v.push(val);
		} else {
			obj[key] = [v, val];
		}
	}
	
	function lastBraceInKey(str) {
		var len = str.length,
			 brace, c;
		for (var i = 0; i < len; ++i) {
			c = str[i];
			if (']' == c) brace = false;
			if ('[' == c) brace = true;
			if ('=' == c && !brace) return i;
		}
	}
	
	function reduce(obj, accumulator){
		var i = 0,
			l = obj.length >> 0,
			curr = arguments[2];
		while (i < l) {
			if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
			++i;
		}
		return curr;
	}
	
	function isArray(vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	}
	
	function keys(obj) {
		var keys = [];
		for ( prop in obj ) {
			if ( obj.hasOwnProperty(prop) ) keys.push(prop);
		}
		return keys;
	}
		
	function purl( url, strictMode ) {
		if ( arguments.length === 1 && url === true ) {
			strictMode = true;
			url = undefined;
		}
		strictMode = strictMode || false;
		url = url || window.location.toString();
	
		return {
			
			data : parseUri(url, strictMode),
			
			// get various attributes from the URI
			attr : function( attr ) {
				attr = aliases[attr] || attr;
				return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
			},
			
			// return query string parameters
			param : function( param ) {
				return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
			},
			
			// return fragment parameters
			fparam : function( param ) {
				return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
			},
			
			// return path segments
			segment : function( seg ) {
				if ( typeof seg === 'undefined' ) {
					return this.data.seg.path;
				} else {
					seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.path[seg];                    
				}
			},
			
			// return fragment segments
			fsegment : function( seg ) {
				if ( typeof seg === 'undefined' ) {
					return this.data.seg.fragment;                    
				} else {
					seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
					return this.data.seg.fragment[seg];                    
				}
			}
	    	
		};
	
	};
	
	if ( typeof $ !== 'undefined' ) {
		
		$.fn.url = function( strictMode ) {
			var url = '';
			if ( this.length ) {
				url = $(this).attr( getAttrName(this[0]) ) || '';
			}    
			return purl( url, strictMode );
		};
		
		$.url = purl;
		
	} else {
		window.purl = purl;
	}

});



/*---------------------------------------------------------------------------
 Contents from: akvo-maps.js
---------------------------------------------------------------------------*/

/*jslint browser: true*/
/*global $, jQuery, Handlebars, google*/

(function () {
    "use strict";

    // When included akvo-maps.js will query the page for elements with
    // class ".akvo_map". These elements should be generated by the maps
    // Django template tag. Each map element will have a div element and
    // a JavaScript literal with data which are used to create a map with
    // corresponding locations from the RSR API
    // There are currently three kinds of maps:
    //      "static" is used on the RSR home page where we want a world map with small markers
    //      "small" is used for the single object maps for projects and organisations
    //      "dynamic" are the large all-object maps for projects and organisations

    var addMap, addPin, populateMap, mapOptions, prepareNextRequest, getResourceUrl;


    // For each .akvo_map element on the page, read options
    // and kick of the creation of a new map
    $(document).ready(function () {
        $('.akvo_map').each(function () {
            var mapId = $(this).attr('id');
            addMap({
                mapId: mapId,
                mapElement: document.getElementById(mapId),
                mapOpts: window[mapId]
            });
        });
    });


    // Creates the map with options and makes the initial AJAX request
    addMap = function (map) {
        $(map.mapElement).gmap(mapOptions(map.mapOpts.type)).bind('init', function () {
            // use $.ajax to be able to setup jsonp with a named callback, "callback",
            // and set cache: true to suppress the "_=<random number>" query string variable jQuery adds by default
            $.ajax({
                url: getResourceUrl(map),
                dataType: "jsonp",
                jsonp: 'callback',
                jsonpCallback: 'callback',
                cache: true,
                success: function(data) {
                    populateMap(map, data);
                }
            });
        });
    };


    // Creates resource URLS based on map options
    getResourceUrl = function (map) {
        var opts, url, limit;
        opts = map.mapOpts;
        // call /api/v1/map_for_project/ or /api/v1/map_for_organisation/ resources
        //TODO: derive the host from the current page URL instead maybe?
        url = opts.host + 'api/v1/' + opts.resource + '/';
        //limit = 0 means all objects. If this becomes too heavy limit can be set to get the objects in multiple chunks
        limit = 0;
        if (opts.object_id) {
            // if object_id holds a value then that's the ID of the object we want to fetch
            url += opts.object_id + '/?format=jsonp&depth=1';
        } else {
            // otherwise we want all objects of the resource's type
            url += '?format=jsonp&limit=' + limit;
        }
        return url;
    };

    // Populates the map with data
    populateMap = function (map, data) {
        var objects, opts, pinTmpl, addOrganisationData, addProjectData;
        opts = map.mapOpts;

        // Since API resources that list multiple objects (projects or organisations) include
        // an objects array we need to add the single project or organisation to an array. This Since
        // we want to keep using the same logic for both cases
        if (opts.object_id === "") {
            objects = data.objects;
        } else {
            objects = [data];
        }

        pinTmpl = Handlebars.compile(
            '<div class="mapInfoWindow" style="height:150px; min-height:150px; max-height:150px; overflow:hidden;">' +
                '<a class="small" href="{{url}}">{{title}}</a>' +
                '{{#if thumb}}' +
                    '<div style="text-align: center; margin-top: 5px;">' +
                        '<a href="{{url}}" title="{{title}}">' +
                            '<img src="{{thumb}}" alt="">' +
                        '</a>' +
                    '</div>' +
                '{{/if}}' +
            '</div>'
        );

        // populate the location object with data from an Organisation model object
        addOrganisationData = function (object, location) {
            location.url = object.absolute_url;
            location.title = object.name;
            try {
                location.thumb = object.logo.thumbnails.map_thumb;
            } catch (e0) { location.thumb = ''; }
            return location;
        };

        // populate the location object with data from a Project model object
        addProjectData = function (object, location) {
            location.url = object.absolute_url;
            location.title = object.title;
            try {
                location.thumb = object.current_image.thumbnails.map_thumb;
            } catch (e1) { location.thumb = ''; }
            return location;
        };

        $.each(objects, function (i, object) {
            if (opts.object_id) {
                // for single objects show all locations
                $.each(object.locations, function (k, location) {
                    //TODO: extend this for additional resource types
                    if (opts.resource === 'organisation') {
                        location = addOrganisationData(object, location);
                    } else {
                        location = addProjectData(object, location);
                    }
                    addPin(map, location, pinTmpl);
                });
            } else {
                // if we're displaying multiple objects we only show the primary locations
                var location;
                location = object.primary_location;
                if (location) {
                    if (opts.resource === 'organisation') {
                        location = addOrganisationData(object, location);
                    } else {
                        location = addProjectData(object, location);
                    }
                    addPin(map, location, pinTmpl);
                }
            }
        });

        // If we are rendering multiple objects and there are more objects to
        // grab from the API
        if (isNaN(opts.object) && data.meta.next !== null) {
            prepareNextRequest(map, data.meta.next);
        }
    };

    // Add a single pin
    addPin = function (map, location, template) {
        var marker, opts;
        opts = map.mapOpts;
        marker = opts.host + 'rsr/media/core/img/';

        // get a custom marker if there is one, otherwise it's red for organisations and blue for projects
        if (opts.marker_icon) {
            marker = marker + opts.marker_icon;
        } else if (opts.resource === 'organisation') {
            marker = marker + 'redMarker.png';
        } else {
            marker = marker + 'blueMarker.png';
        }

        if (opts.type === 'static' || opts.type === 'small') {
            // shrink the marker for "static" maps
            if (opts.type === 'static') {
                marker = new google.maps.MarkerImage(marker, null, null, null, new google.maps.Size(10.5, 17));
            }
            $(map.mapElement).gmap('addMarker', {
                'position': new google.maps.LatLng(location.latitude, location.longitude),
                'clickable': false,
                'icon': marker,
                'bounds': true
            });
            // if the map is zoomed in a lot we zoom out a bit
            if ($(map.mapElement).gmap('get', 'map').getZoom() > 8) {
                $(map.mapElement).gmap('get', 'map').setZoom(8);
            }
        // "dynamic"
        } else {
            $(map.mapElement).gmap('addMarker', {
                'position': new google.maps.LatLng(location.latitude, location.longitude),
                'icon': marker,
                'bounds': true
            }).click(function () {
                $(map.mapElement).gmap('openInfoWindow', {
                    'content': template(location)
                }, this);
            });
        }
    };


    // Since we need to update the callback parameters we don't use the meta.next
    // but create a new resource url
    prepareNextRequest = function (map, resource) {
        var url = $.url(resource),
            urlTmpl = Handlebars.compile('{{host}}{{path}}?format=jsonp&depth=1&limit={{limit}}&offset={{offset}}'),
            newUrl = urlTmpl({
                'host': url.attr('host'),
                'path': url.attr('path'),
                'limit': Number(url.param('limit')),
                'offset': Number(url.param('offset'))
            });
        $.ajax({
            url: newUrl,
            dataType: "jsonp",
            jsonp: 'callback',
            jsonpCallback: 'callback',
            cache: true,
            success: function(data) {
                populateMap(map, data);
            }
        });
    };

    mapOptions = function (mapType) {
        var options;
        // "static" and "small" are set to zoom 0 to begin with so that you see a world map until it has been populated
        // scroll wheel zoom is only enabled for the large "dynamic" maps
        if (mapType === 'static') {
            options = {
                'draggable': false,
                'mapTypeControl': false,
                'navigationControl': true,
                'scaleControl': false,
                'scrollwheel': false,
                'streetViewControl': false,
                'zoom': 0,
                'zoomControl': false //removes the (non-functional) zoom buttons
            };
        } else if (mapType === 'small') {
            options = {
                'draggable': true,
                'mapTypeControl': false,
                'navigationControl': true,
                'scaleControl': true,
                'scrollwheel': false,
                'streetViewControl': false,
                'zoom': 0
            };
        } else {
            options = {
                'draggable': true,
                'mapTypeControl': true,
                'navigationControl': true,
                'scaleControl': true,
                'scrollwheel': true,
                'streetViewControl': false,
                'zoom': 2
            };
        }
        return options;
    };
}());
