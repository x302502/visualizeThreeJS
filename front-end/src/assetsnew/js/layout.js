$(document).ready(function () {
  $('.data-layout').each(function(index, obj){
    $.get('layout/' + $(obj).data('layout'), function(data) {
      $(obj).html(data);
    }, 'text');
  });
  $('input[type="text"], textarea').on('focus', function(){
    $(this).parent().addClass('active');
    $(this).parent().removeClass('no-shadow');
  }).on('blur', function(){
    if($(this).val().trim() == ''){
      $(this).parent().removeClass('active');
      $(this).parent().removeClass('no-shadow');
    }
    else {
      $(this).parent().addClass('no-shadow');
    }
  });
  $('.btn:not([data-toggle="modal"])').click(function(){
    $.notify({
      title: 'Alert',
      message: 'Message box',
      icon: 'fa fa-question'
    },{
      showProgressbar: true,
      type: 'info',
      placement: {
        from: "bottom",
        align: "right"
      },
    });
  });
  $(".typeahead").typeahead({
    source: [
      {id: "someId1", name: "Display name 1"},
      {id: "someId2", name: "Display name 2"}
    ],
    autoSelect: true
  });
  window.onbeforeunload = function(event){
    return false;
  }
});
