
$.fn.extend({
  encode_email: function(b64) {
    var attributes, clip, el, elm, flash_detect, has_flash, text_width, txt;
    b64 = b64.replace(/\=/g, "");
    txt = window.atob(b64);
    if (!this.is('input')) {
      attributes = {};
      $.each(this[0].attributes, function(index, attr) {
        return attributes[attr.name] = attr.value;
      });
      this.after("<input id='zc-text' type='text' />");
      elm = this.next();
      $.each(attributes, function(k, v) {
        return elm.attr(k, v);
      });
      this.remove();
      return elm.encode_email(b64);
    } else {
      this.attr('id', 'zc-text');
      this.after("<div class='widthtest'>" + txt + "</div>");
      text_width = this.next().width() + this.next().width() / 10;
      this.next().remove();
      this.val(txt).css({
        border: 'none',
        margin: 0,
        padding: 0,
        'font-family': this.parent().css('font-family'),
        'font-size': this.parent().css('font-size'),
        'font-weight': 'bold',
        outline: 0,
        background: 'none',
        width: text_width
      });
      flash_detect = function() {
        var a, b;
        a = 'Shockwave';
        b = 'Flash';
        try {
          a = new ActiveXObject(a + b + '.' + a + b);
        } catch (e) {
          a = navigator.plugins[a + ' ' + b];
        }
        return !!a;
      };
      has_flash = flash_detect();
      if (has_flash) {
        try {
          clip = new ZeroClipboard.Client();
          this.after("<div id='zc-container' style='display: inline-block'></div>").next().append(this);
          clip.setText(this.val());
          clip.glue('zc-text', 'zc-container');
          el = this;
          return clip.addEventListener('onMouseDown', function() {
            var center_pad, notification;
            $('.zc-notify').remove();
            el.focus().select().after("<div class='zc-notify'>copied to clipboard!</div>");
            notification = el.parent().find('.zc-notify');
            center_pad = (el.width() - notification.width()) / 2 - 14;
            return notification.hide().css('left', center_pad).fadeIn(300).delay(1000).fadeOut(500, function() {
              return $(this).remove();
            });
          });
        } catch (e) {
          return alert('There is a problem with zclipboard - probaby you just forgot to include it');
        }
      } else {
        return this.click(function() {
          return $(this).focus().select();
        });
      }
    }
  }
});
