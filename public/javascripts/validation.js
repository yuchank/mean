$('#addReview').submit(e => {
  $('.alert.alert-danger').hide();
  if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
    if ($('.alert.alert-danger').length) {
      $('.alert.alert-danger').show();
    }
    else {
      // https://github.com/airbnb/javascript/issues/389
      $(e.currentTarget).prepend('<div role="alert" class="alert alert-danger">All fields required, please try again</div>');
    }
    return false;
  }
});