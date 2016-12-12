var $$ = require('domtastic');
var serialize = require('form-serialize');
var reqwest = require('reqwest');


function AjaxForm(options) {

  this.elem = $$(options.elem);
  this.elemID = this.elem.attr('id');
  this.ajax_complete = options.ajax_complete;
  this.current_page = 1;

  this.results_preloader = $$(this.getOption('resultsPreloader'));
  this.results_container = $$(this.getOption('resultsContainer'));

  this.button_load = $$(this.getOption('buttonLoad'));
  this.storage = null;
  this.storege_key = "wpasInstance_" + this.elemID;
  this.show_default = this.getOption('showDefaultResults');
  
  this.init();
  
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
  this.current_page = pagenum;
  var elemPageField = this.elem.find('#wpas-paged');
  elemPageField[0].value = pagenum
};

AjaxForm.prototype.submitForm = function() {

  this.setPage(1);
  this.setRequest(this.getSerialize());
  this.results_container.empty();
  this.sendRequest(this.request_data, this.current_page);
};

AjaxForm.prototype.setRequest = function() {
  this.request_data = this.getSerialize();
};

AjaxForm.prototype.storeInstance = function(requestResults) {

  var instance = {
    request: this.request_data,
    form: this.getSerialize({
      hash: true
    }),
    results: {
      html: this.results_container.html(),
      ajax: requestResults
    },
    page: this.current_page
  };
  instance = JSON.stringify(instance);
  localStorage.setItem(this.storege_key, instance);

};

AjaxForm.prototype.preloaderInit = function() {

  this.loadingImage = $$("<img id='wpas-loading-img' src='" + this.getOption('loadingImageURL') + "'>");

  this.results_preloader.append(this.loadingImage.addClass('hide'));
};

AjaxForm.prototype.appendResContainer = function(res) {
  return this.results_container.append(res);
};

AjaxForm.prototype.urlHash = function () {
  return this.getOption('urlHash');
};

AjaxForm.prototype.respData = function (resp) {
  this.resp_data = JSON.parse(resp.data);
  return this.resp_data
};



AjaxForm.prototype.sendRequest = function(data, page) {

  var _this = this;

  this.hideEl(this.button_load);
  this.showEl(this.loadingImage);
  
  reqwest({
    url: upages_params.ajaxurl,
    method: 'post',
    type: 'json',
    data: {
      action: 'wpas_ajax_load',
      page: page,
      form_data: data
    },
    success: function(resp) {
      var res = _this.respData(resp);
      
      _this.appendResContainer(res.results);
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
      if (_this.ajax_complete){
        var _resp = _this.respData(resp);
        _this.ajax_complete.apply(_resp, [_resp]);
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
};

AjaxForm.prototype.init = function() {
  
  var _this = this;
  this.preloaderInit();
  if (window.location.hash.slice(1) == this.urlHash()) {
    this.storage = JSON.parse(localStorage.getItem("wpasInstance_" + this.elemID));
  }

  this.setPage(1);
  this.setRequest(this.getSerialize());

  if (this.results_container.length) {
    if (this.storage !== null) {
      this.results_container.html(this.storage.results.html);
      
      if (this.ajax_complete){
        var _resp = this.storage.results.ajax;
        this.ajax_complete.apply(_resp, [_resp]);
      }
    } else if (this.show_default) {
      this.sendRequest(this.request_data, this.current_page);
    }
  }

  this.elem.on('submit', function(e) {
    e.preventDefault();
    if (_this.formLocked()) {
      return;
    }
    _this.lockForm();
    _this.submitForm();
  })
};

module.exports = AjaxForm;