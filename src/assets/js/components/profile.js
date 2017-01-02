var live_field;
var live_value;
var xhrValidateUsername = false;

function UM_check_password_matched() {
  $(document).on('keyup', 'input[data-key=user_password],input[data-key=confirm_user_password]', function(e) {
    var value = $('input[data-key=user_password]').val();
    var match = $('input[data-key=confirm_user_password]').val();
    var field = $('input[data-key=user_password],input[data-key=confirm_user_password]');
    if (!value && !match) {
      field.removeClass('um-validate-matched').removeClass('um-validate-not-matched');
    } else if (value !== match) {
      field.removeClass('um-validate-matched').addClass('um-validate-not-matched');
    } else {
      field.removeClass('um-validate-not-matched').addClass('um-validate-matched');
    }
  });
}
$(document).ready(function() {
  if ($('input[data-key=user_password],input[data-key=confirm_user_password]').length == 2) {
    UM_check_password_matched();
  }
});

$(function() {
  $(".um-search form *").keypress(function(e) {
    if (e.which == 13) {
      $('.um-search form').submit();
      return false;
    }
  });
});
var current_tab = $('.um-account-main').attr('data-current_tab');
if (current_tab) {
  $('.um-account-tab[data-tab=' + current_tab + ']').show();
}
$(document).on('input change', '.um-field input[type=text]', function() {
  live_field = $(this).parents('.um-field').data('key');
  live_value = $(this).val();
});

$('.um-field input[type=text]').trigger('input');

$(document).on('change', '.um-field select, .um-field input[type=radio], .um-field input[type=checkbox]', function() {
  live_field = $(this).parents('.um-field').data('key');
  live_value = $(this).val();
  if ($(this).is(':checkbox')) {
    if ($(this).parents('.um-field').find('input:checked').length > 1) {
      live_value = '';
      $(this).parents('.um-field').find('input:checked').each(function() {
        live_value = live_value + $(this).val() + ' ';
      });
    } else {
      live_value = $(this).parents('.um-field').find('input:checked').val();
    }
  }
  if ($(this).is(':radio')) {
    live_value = $(this).parents('.um-field').find('input[type=radio]:checked').val();
  }
});
$('.um-field select, .um-field input[type=radio], .um-field input[type=checkbox]').trigger('change');
$('.um-member-connect').each(function() {
  if ($(this).find('a').length == 0) {
    $(this).remove();
  }
});
$('.um-member-meta-main').each(function() {
  if ($(this).find('.um-member-metaline').length == 0 && $(this).find('.um-member-connect').find('a').length == 0) {
    $(this).remove();
  }
});

$(document).on('click', 'a[data-modal^="um_"], span[data-modal^="um_"], .um-modal a', function(e) {
  e.preventDefault();
  return false;
});
$(document).on('click', '.um-modal .um-single-file-preview a.cancel', function(e) {
  e.preventDefault();
  var parent = $(this).parents('.um-modal-body');
  var src = $(this).parents('.um-modal-body').find('.um-single-fileinfo a').attr('href');
  parent.find('.um-single-file-preview').hide();
  parent.find('.ajax-upload-dragdrop').show();
  parent.find('.um-modal-btn.um-finish-upload').addClass('disabled');
  jQuery.ajax({
    url: um_scripts.ajaxurl,
    type: 'post',
    data: {
      action: 'ultimatemember_remove_file',
      src: src
    }
  });
  return false;
});
$(document).on('click', '.um-modal .um-single-image-preview a.cancel', function(e) {
  e.preventDefault();
  var parent = $(this).parents('.um-modal-body');
  var src = $(this).parents('.um-modal-body').find('.um-single-image-preview img').attr('src');
  parent.find('.um-single-image-preview img').attr('src', '');
  parent.find('.um-single-image-preview').hide();
  parent.find('.ajax-upload-dragdrop').show();
  parent.find('.um-modal-btn.um-finish-upload').addClass('disabled');
  jQuery.ajax({
    url: um_scripts.ajaxurl,
    type: 'post',
    data: {
      action: 'ultimatemember_remove_file',
      src: src
    }
  });
  return false;
});
$(document).on('click', '.um-finish-upload.file', function() {
  var key = $(this).attr('data-key');
  var preview = $(this).parents('.um-modal-body').find('.um-single-file-preview').html();
  $('.um-single-file-preview[data-key=' + key + ']').fadeIn().html(preview);
  $('.um-single-file-preview[data-key=' + key + ']').parents('.um-field').find('.um-btn-auto-width').html($(this).attr('data-change'));
  $('.um-single-file-preview[data-key=' + key + ']').parents('.um-field').find('input[type=hidden]').val($('.um-single-file-preview[data-key=' + key + ']').parents('.um-field').find('.um-single-fileinfo a').attr('href'));
});

$(document).on('click', 'a[data-modal^="um_"], span[data-modal^="um_"]', function(e) {
  var size;
  var modal_id = $(this).attr('data-modal');
  if ($(this).data('modal-size')) {
    size = $(this).data('modal-size');
  } else {
    size = 'normal';
  }
  if ($(this).data('modal-copy')) {
    $('#' + modal_id).html($(this).parents('.um-field').find('.um-modal-hidden-content').html());
    if ($(this).parents('.um-profile-photo').attr('data-user_id')) {
      $('#' + modal_id).attr('data-user_id', $(this).parents('.um-profile-photo').attr('data-user_id'));
    }
    if ($(this).parents('.um-cover').attr('data-ratio')) {
      $('#' + modal_id).attr('data-ratio', $(this).parents('.um-cover').attr('data-ratio'));
    }
    if ($(this).parents('.um-cover').attr('data-user_id')) {
      $('#' + modal_id).attr('data-user_id', $(this).parents('.um-cover').attr('data-user_id'));
    }
  } else {}
});
$('.um-profile.um-viewing .um-profile-body .um-row').each(function() {
  var this_row = $(this);
  if (this_row.find('.um-field').length == 0) {
    this_row.prev('.um-row-heading').remove();
    this_row.remove();
  }
});
if ($('.um-profile.um-viewing .um-profile-body').length && $('.um-profile.um-viewing .um-profile-body').find('.um-field').length == 0) {
  $('.um-row-heading,.um-row').remove();
  $('.um-profile-note').show();
}
$(document).on('click', '.um-profile-save', function(e) {
  e.preventDefault();
  $(this).parents('.um').find('form').submit();
  return false;
});
$(document).on('click', '.um-profile-edit-a', function(e) {
  $(this).addClass('active');
});
$(document).on('click', '.um-cover a, .um-photo a', function(e) {
  e.preventDefault();
  return false;
});
$(document).on('click', '.um-reset-profile-photo', function(e) {
  $('.um-profile-photo-img img').attr('src', $(this).attr('data-default_src'));
  var user_id = $(this).attr('data-user_id');
  var metakey = 'profile_photo';
  $.ajax({
    url: um_scripts.ajaxurl,
    type: 'post',
    data: {
      action: 'ultimatemember_delete_profile_photo',
      metakey: metakey,
      user_id: user_id
    }
  });
});
$(document).on('click', '.um-reset-cover-photo', function(e) {
  $('.um-cover-overlay').hide();
  $('.um-cover-e').html('<a href="#" class="um-cover-add um-manual-trigger" data-parent=".um-cover" data-child=".um-btn-auto-width"><span class="um-cover-add-i"><i class="um-icon-plus um-tip-n" title="Upload a cover photo"></i></span></a>');
  $('.um-dropdown').hide();
  var user_id = $(this).attr('data-user_id');
  var metakey = 'cover_photo';
  $.ajax({
    url: um_scripts.ajaxurl,
    type: 'post',
    data: {
      action: 'ultimatemember_delete_cover_photo',
      metakey: metakey,
      user_id: user_id
    }
  });
});

function um_update_bio_countdown() {
  if (typeof $('textarea[id=um-meta-bio]').val() !== 'undefined') {
    var um_bio_limit = $('textarea[id=um-meta-bio]').attr("data-character-limit");
    var remaining = um_bio_limit - $('textarea[id=um-meta-bio]').val().length;
    $('span.um-meta-bio-character span.um-bio-limit').text(remaining);
    if (remaining < 5) {
      $('span.um-meta-bio-character').css('color', 'red');
    } else {
      $('span.um-meta-bio-character').css('color', '');
    }
  }
}
um_update_bio_countdown();
$('textarea[id=um-meta-bio]').change(um_update_bio_countdown);
$('textarea[id=um-meta-bio]').keyup(um_update_bio_countdown);

$(document).on('click', '.um-dropdown a', function(e) {
  return false;
});

$(document).on('click', '.um-trigger-menu-on-click', function(e) {
  $('.um-dropdown').hide();
  var menu = $(this).find('.um-dropdown');
  menu.show();
  return false;
});
$(document).on('click', 'a.um-manual-trigger', function() {
  var child = $(this).attr('data-child');
  var parent = $(this).attr('data-parent');
  $(this).parents(parent).find(child).trigger('click');
});
$(document).on('change', '.um-field-area input[type=radio]', function() {
  var field = $(this).parents('.um-field-area');
  var this_field = $(this).parents('label');
  field.find('.um-field-radio').removeClass('active');
  field.find('.um-field-radio').find('i').removeClass().addClass('um-icon-android-radio-button-off');
  this_field.addClass('active');
  this_field.find('i').removeClass().addClass('um-icon-android-radio-button-on');
});
$(document).on('change', '.um-field-area input[type=checkbox]', function() {
  var field = $(this).parents('.um-field-area');
  var this_field = $(this).parents('label');
  if (this_field.hasClass('active')) {
    this_field.removeClass('active');
    this_field.find('i').removeClass().addClass('um-icon-android-checkbox-outline-blank');
  } else {
    this_field.addClass('active');
    this_field.find('i').removeClass().addClass('um-icon-android-checkbox-outline');
  }
});
$(document).on('click', '.um .um-single-image-preview a.cancel', function(e) {
  e.preventDefault();
  var parent = $(this).parents('.um-field');
  var src = $(this).parents('.um-field').find('.um-single-image-preview img').attr('src');
  parent.find('.um-single-image-preview img').attr('src', '');
  parent.find('.um-single-image-preview').hide();
  parent.find('.um-btn-auto-width').html('Upload');
  parent.find('input[type=hidden]').val('');
  jQuery.ajax({
    url: um_scripts.ajaxurl,
    type: 'post',
    data: {
      action: 'ultimatemember_remove_file',
      src: src
    }
  });
  return false;
});

$(document).on('click', '.um .um-single-file-preview a.cancel', function(e) {
  e.preventDefault();
  var parent = $(this).parents('.um-field');
  var src = $(this).parents('.um-field').find('.um-single-fileinfo a').attr('href');
  parent.find('.um-single-file-preview').hide();
  parent.find('.um-btn-auto-width').html('Upload');
  parent.find('input[type=hidden]').val('');
  jQuery.ajax({
    url: um_scripts.ajaxurl,
    type: 'post',
    data: {
      action: 'ultimatemember_remove_file',
      src: src
    }
  });
  return false;
});

$(document).on('click', '.um-field-group-head:not(.disabled)', function() {
  var field = $(this).parents('.um-field-group');
  var limit = field.data('max_entries');
  if (field.find('.um-field-group-body').is(':hidden')) {
    field.find('.um-field-group-body').show();
  } else {
    field.find('.um-field-group-body:first').clone().appendTo(field);
  }
  var increase_id = 0;
  field.find('.um-field-group-body').each(function() {
    increase_id++;
    $(this).find('input').each(function() {
      var input = $(this);
      input.attr('id', input.data('key') + '-' + increase_id);
      input.attr('name', input.data('key') + '-' + increase_id);
      input.parent().parent().find('label').attr('for', input.data('key') + '-' + increase_id);
    });
  });
  if (limit > 0 && field.find('.um-field-group-body').length == limit) {
    $(this).addClass('disabled');
  }
});
$(document).on('click', '.um-field-group-cancel', function(e) {
  e.preventDefault();
  var field = $(this).parents('.um-field-group');
  var limit = field.data('max_entries');
  if (field.find('.um-field-group-body').length > 1) {
    $(this).parents('.um-field-group-body').remove();
  } else {
    $(this).parents('.um-field-group-body').hide();
  }
  if (limit > 0 && field.find('.um-field-group-body').length < limit) {
    field.find('.um-field-group-head').removeClass('disabled');
  }
  return false;
});

$(document).on('click', '.um-ajax-action', function(e) {
  e.preventDefault();
  var hook = $(this).data('hook');
  var user_id = $(this).data('user_id');
  var arguments = $(this).data('arguments');
  if ($(this).data('js-remove')) {
    $(this).parents('.' + $(this).data('js-remove')).fadeOut('fast');
  }
  jQuery.ajax({
    url: um_scripts.ajaxurl,
    type: 'post',
    data: {
      action: 'ultimatemember_muted_action',
      hook: hook,
      user_id: user_id,
      arguments: arguments
    },
    success: function(data) {}
  });
  return false;
});


var um_select_options_cache = {};
$('select[data-um-parent]').each(function() {
  var me = $(this);
  var parent_option = me.data('um-parent');
  var um_ajax_url = me.data('um-ajax-url');
  var um_ajax_source = me.data('um-ajax-source');

  me.attr('data-um-init-field', true);
  $(document).on('change', 'select[name="' + parent_option + '"]', function() {
    var parent = $(this);
    var form_id = parent.closest('form').find('input[type=hidden][name=form_id]').val();
    var arr_key = parent.val();
    if (parent.val() != '' && typeof um_select_options_cache[arr_key] != 'object') {
      jQuery.ajax({
        url: um_ajax_url,
        type: 'post',
        data: {
          action: 'ultimatemember_ajax_select_options',
          parent_option: parent.val(),
          child_callback: um_ajax_source,
          child_name: me.attr('name'),
          form_id: form_id,
        },
        success: function(data) {
          if (data.status == 'success' && parent.val() != '') {
            um_field_populate_child_options(me, data, arr_key);
          }
          if (typeof data.debug !== 'undefined') {
            console.log(data);
          }
        },
        error: function(e) {
          console.log(e);
        }
      });
    }
    if (parent.val() != '' && typeof um_select_options_cache[arr_key] == 'object') {
      var data = um_select_options_cache[arr_key];
      um_field_populate_child_options(me, data, arr_key);
    }
    if (parent.val() == '') {
      me.find('option[value!=""]').remove();
      me.val('').trigger('change');
    }
  });
  $('select[name="' + parent_option + '"]').trigger('change');
});

function um_field_populate_child_options(me, data, arr_key, arr_items) {
  var parent_option = me.data('um-parent');
  var child_name = me.attr('name');
  var parent_dom = $('select[name="' + parent_option + '"]');
  me.find('option[value!=""]').remove();
  if (!me.hasClass('um-child-option-disabled')) {
    me.removeAttr('disabled');
  }
  var arr_items = [];
  jQuery.each(data.items, function(k, v) {
    arr_items.push({
      id: k,
      text: v
    });
  });
  if (typeof data.field.default !== 'undefined' && !me.data('um-original-value')) {
    me.val(data.field.default).trigger('change');
  } else if (me.data('um-original-value') != '') {
    me.val(me.data('um-original-value')).trigger('change');
  }
  if (data.field.editable == 0) {
    me.addClass('um-child-option-disabled');
    me.attr('disabled', 'disabled');
  }
  um_select_options_cache[arr_key] = data;
}