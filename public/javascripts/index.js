(function() {

  'use strict';

  ace.require("ace/ext/language_tools");

  var editor = ace.edit("code-editor");
  editor.setTheme("ace/theme/dreamweaver");
  editor.getSession().setMode("ace/mode/sql");
  editor.setOptions({
    enableBasicAutocompletion: true
    //,enableSnippets: true
  });

  editor.commands.addCommand({
    name: 'Submit shortcut',
    bindKey: {
      win: 'Ctrl-Enter',
      mac: 'Command-Enter'
    },
    exec: function(editor) {
      $('#queryBtn').click();
    }
  });

  var appNotifier = new AppNotifier('Blazing Squirrel', '/images/bs-notification.ico');

  appNotifier.requestPermission();

  var tipCycle = {

    counter: 0,

    tips: window.APP_TIPS || [],

    cycle: function() {

      if (tipCycle.counter >= tipCycle.tips.length) {
        tipCycle.counter = 0;
      }

      $('#tips > span').hide().html(tipCycle.tips[tipCycle.counter++]).fadeIn();

      setTimeout(tipCycle.cycle, 5000);
    }
  };

  function recalcHeightFillers(root) {
    $('[data-is-height-filler]', typeof root === 'string' || root instanceof jQuery ? root : null).each(function() {
      var mod = parseInt(this.getAttribute('data-height-modifier'), 10) || 0;
      var $el = $(this);
      $el.height($(window).height() - mod - $el.offset().top - 2);
    });
    root = null;
  }

  $(function($) {
    $('input[name="user"]').val(store.get('db_user') || '');
    $('input[name="password"]').val(store.get('db_pass') || '');
    var lastQuery = store.get('last_query');
    if (lastQuery) editor.setValue(lastQuery, 0);

    $('#queryBtn').click(function() {
      $('#queryForm').submit();
    });

    tipCycle.cycle();
    recalcHeightFillers();

    $('[data-trigger-editor-size]').mouseenter(function() {
      var $el = $('#code-editor');
      var originalH = $el.data('original-height');
      if (!originalH) {
        $el.data('original-height', originalH = $el.height());
      }
      var halfWinHeight = $(window).height() * 0.5;
      $el.stop();
      if (halfWinHeight * 0.5 > originalH) {
        $el.css({
          height: halfWinHeight
        });
        editor.resize(true);
        recalcHeightFillers();
      }
    }).mouseleave(function() {
      var $el = $('#code-editor');
      $el.css('height', $el.data('original-height'));
      editor.resize(true);
      recalcHeightFillers();

    });

    $(window).resize(recalcHeightFillers);
  });

  function getFormData() {
    return 'query=' + encodeURIComponent(editor.getCopyText() || editor.getValue()) + '&' + $('#queryForm').serialize();
  }

  function saveLocalData() {
    store.set('db_user', $('input[name="user"]').val());
    store.set('db_pass', $('input[name="password"]').val());
    store.set('last_query', editor.getValue());
  }

  function display(content, callback) {
    $('#result').hide().html(content).show(200, function() {
      recalcHeightFillers();
      if (typeof callback === 'function') callback.apply(this, arguments);
    });
  }

  var lastExecuteXHR = null;
  var lastResultWorker;

  $('#queryForm').submit(function(event) {

    $('#queryBtn').prop('disabled', true);

    if (lastExecuteXHR) {
      lastExecuteXHR.abort();
    }

    display('<h4><span class="label label-default">' + APP_MSGS.EXECUTING + '</span></h4>')

    Pace.track(function() {
      lastExecuteXHR = $.ajax({

        type: 'post',
        url: '/sql/query',
        dataType: 'json',
        cache: false,
        data: getFormData()

      }).done(function(data) {

        display(

          '<h4><span class="label label-primary">' + APP_MSGS.PREPARING_PRESENTATION + '</span></h4>',

          function() {

            var document = window.document;

            if ($.type(data) !== 'array') {
              if (data && data.isError && data.error) {
                return display('<h4><span class="label label-danger">' + APP_MSGS.ERROR_TITLE + '</span></h4>' + data.error);
              } else {
                return display('<h4><span class="label label-danger">' + APP_MSGS.ERROR_TITLE + '</span></h4>' + APP_MSGS.UNDEFINED_DRIVER_ERROR);
              }
            } else if (!data.length) {
              return display('<h4><span class="label label-warning">' + APP_MSGS.NO_REGISTER + '</span></h4>');
            }

            saveLocalData();

            if (typeof Worker !== 'undefined') {
              if (lastResultWorker) {
                lastResultWorker.terminate();
              }

              var data2HTMLResultWorker = new Worker('/javascripts/Data2HTMLResultWorker.js');

              data2HTMLResultWorker.addEventListener('message', function(e) {
                display('<h4><span class="label label-success">' + APP_MSGS.RENDERING + '</span></h4>', function() {
                  display('<p><span class="label label-default">' + e.data.count + ' ' + APP_MSGS.REGISTERS + '.</span></p>' + e.data.html);
                });

                appNotifier.show(null, APP_MSGS.RESPONSE_RECEIVED, true);
              });

              data2HTMLResultWorker.postMessage([data, 'table table-bordered table-hover table-condensed table-striped small']);

              lastResultWorker = data2HTMLResultWorker;
            } else {
              display('<h4><span class="label label-success">' + APP_MSGS.RENDERING + '</span></h4>', function() {
                var data = new Data2HTMLResultBuilder().build(data, 'table table-bordered table-hover table-condensed table-striped small');
                display('<p><span class="label label-default">' + data.count + ' ' + APP_MSGS.REGISTERS + '.</span></p>' + data.html);
              });
              appNotifier.show(null, APP_MSGS.RESPONSE_RECEIVED, true);
            }

            data = null;
          }
        );

      })
        .fail(function(jqXHR, textStatus, errorThrown) {
          if (!errorThrown.message && jqXHR.status === 400) {
            display('<h4><span class="label label-danger">' + APP_MSGS.ERROR_TITLE + '</span></h4>' + APP_MSGS.NO_CONNECTION);
          }
          display('<h4><span class="label label-danger">' + APP_MSGS.ERROR_TITLE + '</span></h4>' + (errorThrown.message || textStatus + ' (' + jqXHR.status + ')'));
        })
        .always(function() {
          $('#queryBtn').prop('disabled', false);
        });
    });


    return false;
  });

})();