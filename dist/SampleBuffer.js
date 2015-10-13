(function() {
  var SampleBuffer,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SampleBuffer = (function(superClass) {
    extend(SampleBuffer, superClass);

    function SampleBuffer(_instance, config) {
      this._instance = _instance;
      this.sample = bind(this.sample, this);
      SampleBuffer.__super__.constructor.apply(this, arguments);
    }

    SampleBuffer.prototype.before_config = function(config) {
      var p;
      p = this.context.createScriptProcessor();
      p.onaudioprocess = this.sample;
      this.insert_node(p, 0);
      return this.data = new Array;
    };

    SampleBuffer.prototype.after_config = function(config) {};

    SampleBuffer.prototype.sample = function(e) {
      var c, i, inb, inputData, j, k, l, len, outb, ref, s;
      inb = e.inputBuffer;
      outb = e.outputBuffer;
      l = inb.length;
      for (c = j = 0, ref = outb.numberOfChannels - 1; 0 <= ref ? j <= ref : j >= ref; c = 0 <= ref ? ++j : --j) {
        inputData = inb.getChannelData(c);
        this.onaudioprocess = null;
        for (i = k = 0, len = inputData.length; k < len; i = ++k) {
          s = inputData[i];
          this.data[i] = inputData[i];
        }
      }
      return null;
    };

    return SampleBuffer;

  })(Mooog.MooogAudioNode);

  Mooog.extend_with("SampleBuffer", SampleBuffer);

}).call(this);
