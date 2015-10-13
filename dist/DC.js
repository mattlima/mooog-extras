(function() {
  var DC,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  DC = (function(superClass) {
    extend(DC, superClass);

    function DC(_instance, config) {
      this._instance = _instance;
      this.apply_dc = bind(this.apply_dc, this);
      DC.__super__.constructor.apply(this, arguments);
    }

    DC.prototype.before_config = function(config) {
      var p;
      p = this.context.createScriptProcessor();
      p.onaudioprocess = this.apply_dc;
      this.insert_node(p, 0);
      return this.dc = 0;
    };

    DC.prototype.after_config = function(config) {};

    DC.prototype.apply_dc = function(e) {
      var c, i, inb, inputData, j, k, l, len, outb, outputData, ref, s;
      inb = e.inputBuffer;
      outb = e.outputBuffer;
      l = inb.length;
      for (c = j = 0, ref = outb.numberOfChannels - 1; 0 <= ref ? j <= ref : j >= ref; c = 0 <= ref ? ++j : --j) {
        inputData = inb.getChannelData(c);
        outputData = outb.getChannelData(c);
        for (i = k = 0, len = inputData.length; k < len; i = ++k) {
          s = inputData[i];
          outputData[i] = inputData[i] + this.dc;
        }
      }
      return null;
    };

    return DC;

  })(Mooog.MooogAudioNode);

  Mooog.extend_with("DC", DC);

}).call(this);
