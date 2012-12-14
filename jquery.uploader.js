$(function() {
    jQuery.extend({
        uploader: {
            frame : function (c) {
                var n = 'f' + Math.floor(Math.random() * 99999);
                var d  = '<div><iframe id="'+ n +'" style="height:0px;width:0px;display:none;" src="about:blank" name="'+n+'" onload="$.uploader.loaded(\''+n+'\')"></iframe></div>';
                $("body").append(d);
                if (c && typeof(c.onComplete) == 'function') {
                    document.getElementById(n).onComplete = c.onComplete;
                }
                return n;
            },

            /**
             * Submits a form
             * @param form {String|JQuery Element}
             * @param callback {Object}
             * @param callback.onComplete(result) {Fucntion}
             *      @param result {String} The http respose
             * @param callback.onStart() {Function} calls when its submitting
             * the form, if returns a falsy value, it won't submit the form
             */

            submit : function (form, callback) {
                if (typeof form === 'string') {
                    form = $('#' + form);
                }

                form.attr('method', 'POST');
                form.attr('enctype', 'multipart/form-data');

                if (callback && typeof callback.onStart === 'function') {
                    if (!callback.onStart()) {
                        return;
                    }
                }

                var n = $.uploader.frame(callback);
                form.attr('target', n);
                form.submit();
            },
            
            refresh: function (){
                $('.fo-close').click();
            },

            loaded : function (id) {
                var $frame, d, frame = document.getElementById(id);

                d = frame.contentDocument ||
                    ( frame.contentWindow ?
                        frame.contentWindow.document :
                        window.frames[id].document )

                if (d.location.href === "about:blank") {
                   return;
                }

                $frame = $(frame);

                if (typeof frame.onComplete === 'function') {
                    frame.onComplete($frame.contents().text());
                }

                if ($.browser.mozilla) {
                    setInterval(function () {
                        $(frame).parent().remove();
                    }, 500);
                } else {
                    $frame.parent().remove();
                }
            }
        }
    });
});