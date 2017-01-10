var viewport = {
  viewPorts: [
    'xs',
    'sm',
    'md',
    'lg'
  ],
  viewPortSize: function () {
    return window.getComputedStyle(document.body, ':before')
                 .content.replace(/"/g, '');
  },
  isSize: function (size) {
    if (this.viewPorts.indexOf(size) == -1) {
      throw "no valid viewport name given";
    }
    return this.viewPortSize() == size;
  },
  isEqualOrGreaterThan: function (size) {
    if (this.viewPorts.indexOf(size) == -1) {
      throw "no valid viewport name given";
    }
    return this.viewPorts.indexOf(this.viewPortSize()) >= this.viewPorts.indexOf(size);
  }
};

module.exports = viewport;