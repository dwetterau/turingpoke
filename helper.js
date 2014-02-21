function add_controls() {
    // add in mousetrap
    var item = document.createElement('script');
        item.type = 'text/javascript';
        item.async = true;
        item.src = 'http://cdn.craig.is/js/mousetrap/mousetrap.min.js?9d308';
    var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(item, s);

    // delay necessary for Mousetrap to register
    setTimeout(function() {
    console.log('added');

    // bind regulars
    Mousetrap.bind('a', function() { post('a'); })
    Mousetrap.bind('b', function() { post('b'); })
    Mousetrap.bind('left', function() { post('l'); })
    Mousetrap.bind('right', function() { post('r'); })
    Mousetrap.bind('up', function() { post('u'); })
    Mousetrap.bind('down', function() { post('d'); })
    Mousetrap.bind('s', function() { post('start'); })

    // extras
    Mousetrap.bind('z', function() { post('a'); })
    Mousetrap.bind('x', function() { post('b'); })

    }, 50);
    var lock = 0;
    // clear lock every 5 seconds JIC a request fails
    setInterval(function() {
      lock = 0;
    }, 5000);
    function post (command) {
        if (lock > 0) {
          return;
        }
        lock += 1;
        var data = {
            command: command,
            name: $('#name').val(),
            code: $('#code').val()
        };
        $.post('/command', {
            data: data,
            success: function() {
              lock -= 1;
            }
        });
    }
}
