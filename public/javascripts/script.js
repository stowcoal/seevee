function appendElement(element, container) {
  element.clone().appendTo(container);
}

function changeTab() {
    if($('.nav-tabs a[href="' + window.location.hash + '"]').length > 0)
      $('.nav-tabs a[href="' + window.location.hash + '"]').tab('show');
    else
      $('.nav-tabs a:first').tab('show');
}
