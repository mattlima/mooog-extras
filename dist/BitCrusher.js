(function() {
  var BitCrusher,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BitCrusher = (function(superClass) {
    extend(BitCrusher, superClass);

    function BitCrusher(_instance, config) {
      this._instance = _instance;
      this.crush = bind(this.crush, this);
      BitCrusher.__super__.constructor.apply(this, arguments);
    }

    BitCrusher.prototype.before_config = function(config) {
      var p;
      p = this.context.createScriptProcessor();
      p.onaudioprocess = this.crush;
      this.insert_node(p, 0);
      this.resolution = 8;
      return this.downsample = 1;
    };

    BitCrusher.prototype.after_config = function(config) {
      return this.sample_rate = this._instance.context.sampleRate;
    };

    BitCrusher.prototype.crush = function(e) {
      var c, i, inb, inputData, j, k, l, len, outb, outputData, ref, s;
      inb = e.inputBuffer;
      outb = e.outputBuffer;
      l = inb.length;
      for (c = j = 0, ref = outb.numberOfChannels - 1; 0 <= ref ? j <= ref : j >= ref; c = 0 <= ref ? ++j : --j) {
        inputData = inb.getChannelData(c);
        outputData = outb.getChannelData(c);
        for (i = k = 0, len = inputData.length; k < len; i = ++k) {
          s = inputData[i];
          outputData[i] = Math.round(inputData[Math.floor(i / this.downsample) * this.downsample] * this.resolution) / this.resolution;
        }
      }
      return null;
    };

    return BitCrusher;

  })(Mooog.MooogAudioNode);

  Mooog.extend_with("BitCrusher", BitCrusher);

}).call(this);
