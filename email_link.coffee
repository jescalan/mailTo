$.fn.extend
  encode_email: (b64) ->
    
    # decode base64
    txt = window.atob(b64)
    
    # if it wasn't called on an input, turn it into one, keep all the attrs, and re-call the plugin
    if !this.is('input')
      attributes = {}
      $.each this[0].attributes, (index, attr) ->
        attributes[attr.name] = attr.value
      this.after("<input id='zc-text' type='text' />")
      elm = this.next()
      $.each attributes, (k,v) ->
        elm.attr(k,v)
      this.remove()
      elm.encode_email(b64)
    else
      this.attr('id', 'zc-text')
    
      # turn the input into normal-looking text
      this.val(txt)
          .css({ border: 'none', margin: 0, padding: 0, 'font-family': this.parent().css('font-family'), 'font-size': this.parent().css('font-size'),'font-weight': 'bold', outline: 0, background: 'none' })
      
      # flash detection script
      flash_detect = ->
        a ='Shockwave'
        b = 'Flash'
        try
            a = new ActiveXObject(a+b+'.'+a+b);
        catch e
            a = navigator.plugins[a+' '+b];
        return !!a
      
      has_flash = flash_detect()
    
      if has_flash
        try
          clip = new ZeroClipboard.Client()
          this.after("<div id='zc-container' style='display: inline-block'></div>").next().append(this)
          clip.setText(this.val())
          clip.glue('zc-text', 'zc-container')
          el = this
          clip.addEventListener 'onMouseDown', ->
            $('.zc-notify').remove()
            el.focus().select().after("<div class='zc-notify'>copied to clipboard!</div>")
            notification = el.parent().find('.zc-notify')
            center_pad = (el.width() - notification.width())/2 - 14
            notification.hide().css('left', center_pad).fadeIn(300).delay(1000).fadeOut 500, ->
              $(this).remove()
        catch e
          alert('There is a problem with zclipboard - probaby you just forgot to include it')
      else
        this.click ->
          $(this).focus().select()
    
