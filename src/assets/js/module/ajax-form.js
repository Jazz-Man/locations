var $$ = require('domtastic');
var serialize = require('form-serialize');
var reqwest = require('reqwest');
var template = require('../module/template');

var AutoComplete = require('./autoComplete');


function AjaxForm(options) {
  var _this = this;
  
  _this.elem = $$(options.elem);
  if (_this.elem.length){
    _this.elemID = _this.elem.attr('id');
    _this.ajax_complete = options.ajax_complete;
    _this.current_page = 1;
  
    _this.results_preloader = $$(_this.getOption('resultsPreloader'));
    _this.results_container = $$(_this.getOption('resultsContainer'));
  
    _this.button_load = $$(_this.getOption('buttonLoad'));
    _this.storage = null;
    _this.storege_key = "wpasInstance_" + _this.elemID;
    _this.show_default = _this.getOption('showDefaultResults');
  
    _this.init();
  }

}

AjaxForm.prototype.showEl = function(el) {
  el.addClass('active show')
    .removeClass('hide');
};

AjaxForm.prototype.hideEl = function(el) {
  el.removeClass('active show')
    .addClass('hide');
};


AjaxForm.prototype.lockForm = function() {
  this.elem.addClass('wpas-locked')
    .find('[type="submit"]')
    .attr('disabled', 'disabled');
};

AjaxForm.prototype.formLocked = function() {
  return this.elem.hasClass('wpas-locked');
};

AjaxForm.prototype.unlockForm = function() {
  this.elem.removeClass('wpas-locked')
    .find('[type="submit"]')
    .removeAttr('disabled');
};

AjaxForm.prototype.getOption = function(option) {

  var elOption = JSON.parse(this.elem.attr('data-ajax-form-option'));

  if (elOption[option] !== null) {
    return elOption[option];
  } else {
    return {};
  }
};

AjaxForm.prototype.getSerialize = function(option) {
  option = option || {
    hash: false,
    disabled: false,
    empty: false
  };

  return serialize(this.elem[0], option);
};

AjaxForm.prototype.setPage = function(pagenum) {
  var _this = this;
  _this.current_page = pagenum;
  var elemPageField = _this.elem.find('#wpas-paged');
  elemPageField[0].value = pagenum
};

AjaxForm.prototype.submitForm = function() {
  var _this = this;
  
  _this.setPage(1);
  _this.setRequest(_this.getSerialize());
  _this.results_container.empty();
  _this.sendRequest(this.request_data, _this.current_page);
};

AjaxForm.prototype.setRequest = function() {
  this.request_data = this.getSerialize();
};

AjaxForm.prototype.storeInstance = function(requestResults) {
  var _this = this;
  var instance = {
    request: _this.request_data,
    form: _this.getSerialize({
      hash: true
    }),
    results: {
      html: _this.results_container.html(),
      ajax: requestResults
    },
    page: _this.current_page
  };
  instance = JSON.stringify(instance);
  localStorage.setItem(_this.storege_key, instance);

};

AjaxForm.prototype.preloaderInit = function() {
  var _this = this;
  
  _this.loadingImage = $$("<img id='wpas-loading-img' src='" + _this.getOption('loadingImageURL') + "'>");
  
  _this.results_preloader.append(_this.loadingImage.addClass('hide'));
};

AjaxForm.prototype.appendResContainer = function(res) {
  return this.results_container.append(res);
};

AjaxForm.prototype.urlHash = function() {
  return this.getOption('urlHash');
};

AjaxForm.prototype.respData = function(resp) {
  var _this = this;
  _this.resp_data = JSON.parse(resp.data);
  return _this.resp_data
};

AjaxForm.prototype.sendRequest = function(data, page) {

  var _this = this;
  
  _this.hideEl(_this.button_load);
  _this.showEl(_this.loadingImage);

  reqwest({
    url: upages_params.ajaxurl,
    method: 'post',
    data: {
      action: 'wpas_ajax_load',
      page: page,
      form_data: data
    },
    success: function(resp) {
      var res = _this.respData(resp);
  
      var posts = res.query.posts;
  
      var listingItemTemplate = '';

      posts.forEach(function (item) {
        listingItemTemplate += template('map-listing-item', item);
      });
      _this.appendResContainer(listingItemTemplate);
      _this.hideEl(_this.loadingImage);
      _this.current_page = res.current_page;
      var max_page = res.max_page;

      if (max_page < 1 || this.current_page == max_page) {
        _this.hideEl(_this.button_load);
      } else {
        _this.showEl(_this.button_load);
      }
      window.location.hash = _this.urlHash();
      _this.storeInstance(res);
      _this.unlockForm();
    },
    complete: function(resp) {
      if (_this.ajax_complete) {
        var _resp = _this.respData(resp);
        _this.ajax_complete.apply(_resp, [_resp]);
  
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
};

AjaxForm.prototype.autoComplete = function() {
  var _this = this;
  var inputs = _this.elem.find('input[type="text"]');

  inputs.forEach(function(e) {
    var complete = new AutoComplete({
      selector: e,
      minChars: 1,
      source: function(term, suggest) {
        term = term.toLowerCase();
        var autocomplete_data = $$(e).attr('data-auto-complete');
        var choices;
        reqwest({
          url: upages_params.ajaxurl,
          method: 'post',
          data: {
            action: 'listing_autocomplete',
            autocomplete_data: autocomplete_data
          },
          success:function (resp) {
            choices = resp.data;
            var suggestions = [];
            if (choices.length){
              choices.forEach(function (e) {
                if (~e.toLowerCase().indexOf(term)) {
                  suggestions.push(e);
                }
              });
            }
  
            suggest(suggestions);
          },
          error: function(err) {
            console.log(err);
          }
        });
        
      },
      onSelect: function(e, term, item){
        e.preventDefault();
        if (_this.formLocked()) {
          return;
        }
        _this.lockForm();
        _this.submitForm();
      }
    });
  });
};

AjaxForm.prototype.init = function() {

  var _this = this;
  _this.preloaderInit();
  if (window.location.hash.slice(1) == _this.urlHash()) {
    _this.storage = JSON.parse(localStorage.getItem("wpasInstance_" + _this.elemID));
  }
  _this.autoComplete();
  _this.setPage(1);
  _this.setRequest(_this.getSerialize());

  if (_this.results_container.length) {
    if (_this.storage !== null) {
      _this.results_container.html(_this.storage.results.html);

      if (_this.ajax_complete) {
        var _resp = _this.storage.results.ajax;
        _this.ajax_complete.apply(_resp, [_resp]);
      }
    } else if (_this.show_default) {
      _this.sendRequest(_this.request_data, _this.current_page);
    }
  }
  
  var allInput = _this.elem.find('[type="text"]');
  
  if (_this.storage !== null){
    allInput.forEach(function (e) {
      var _e = $$(e);
      var _id = _e.attr('id');
      var storage = _this.storage.form;
      if (_id in storage){
        var _val =  [storage][0][_id];
        _e.val(_val);
      }
      
    });
  }
  
  _this.elem.on('submit', function(e) {
    e.preventDefault();
    if (_this.formLocked()) {
      return;
    }
    _this.lockForm();
    _this.submitForm();
  });
  
  this.button_load.on('click',function () {
    _this.setPage(parseInt(_this.current_page) + 1);
    _this.sendRequest(_this.request_data, _this.current_page);
  })
};

module.exports = AjaxForm;