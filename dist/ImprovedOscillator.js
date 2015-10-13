(function() {
  var ImprovedOscillator,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ImprovedOscillator = (function(superClass) {
    extend(ImprovedOscillator, superClass);

    function ImprovedOscillator(config) {
      this.noise = bind(this.noise, this);
      this.square = bind(this.square, this);
      this.triangle = bind(this.triangle, this);
      this.sine = bind(this.sine, this);
      ImprovedOscillator.__super__.constructor.apply(this, arguments);
    }

    ImprovedOscillator.prototype.before_config = function(config) {
      var p;
      Object.defineProperty(this, 'type', {
        get: function() {
          return this.__type;
        },
        set: (function(_this) {
          return function(t) {
            _this.__type = t;
            if (t === 'sawtooth') {
              _this.duty_cycle = 1.0;
            }
            if (t === 'triangle') {
              _this.duty_cycle = 0.5;
            }
            if (t === 'square') {
              _this.duty_cycle = 0.5;
            }
            return _this.onaudioprocess = _this[t];
          };
        })(this),
        enumerable: true,
        configurable: true
      });
      p = this.context.createScriptProcessor(null, 0, 1);
      this.insert_node(p, 0);
      this.last = 0;
      this.frequency = 440;
      this.dc = 0;
      this.phase = 0;
      this.duty_cycle = 0.5;
      this.tau = Math.PI * 2;
      return this.b = 0.1;
    };

    ImprovedOscillator.prototype.after_config = function(config) {
      if (this.type == null) {
        this.type = 'sine';
      }
      this.sample_rate = this._instance.context.sampleRate;
      return this.secs_per_sample = 1 / this.sample_rate;
    };

    ImprovedOscillator.prototype.sine = function(e) {
      var c, i, j, k, l, len, m, outb, outputData, real_val, ref, x;
      outb = e.outputBuffer;
      l = outb.length;
      m = this.secs_per_sample * 2 * Math.PI * this.frequency;
      for (c = j = 0, ref = outb.numberOfChannels - 1; 0 <= ref ? j <= ref : j >= ref; c = 0 <= ref ? ++j : --j) {
        outputData = outb.getChannelData(c);
        for (i = k = 0, len = outputData.length; k < len; i = ++k) {
          x = outputData[i];
          real_val = Math.sin(this.phase);
          this.phase = this.phase + m;
          outputData[i] = real_val;
        }
      }
      return null;
    };

    ImprovedOscillator.prototype.triangle = function(e) {
      var c, i, j, k, l, len, m, outb, outputData, p_duty, p_phase, real_val, ref, x;
      outb = e.outputBuffer;
      l = outb.length;
      m = this.secs_per_sample * this.tau * this.frequency;
      for (c = j = 0, ref = outb.numberOfChannels - 1; 0 <= ref ? j <= ref : j >= ref; c = 0 <= ref ? ++j : --j) {
        outputData = outb.getChannelData(c);
        for (i = k = 0, len = outputData.length; k < len; i = ++k) {
          x = outputData[i];
          p_phase = (this.phase % this.tau) / this.tau;
          if (p_phase < this.duty_cycle) {
            p_duty = p_phase / this.duty_cycle;
            real_val = p_duty * 2 - 1;
          } else {
            p_duty = (p_phase - this.duty_cycle) / (1 - this.duty_cycle);
            real_val = (1 - p_duty) * 2 - 1;
          }
          this.phase = this.phase + m;
          outputData[i] = real_val;
        }
      }
      return null;
    };

    ImprovedOscillator.prototype.sawtooth = ImprovedOscillator.prototype.triangle;

    ImprovedOscillator.prototype.square = function(e) {
      var c, i, j, k, l, len, localphase, m, outb, outputData, p_phase, real_val, ref, x;
      outb = e.outputBuffer;
      l = outb.length;
      m = this.secs_per_sample * this.tau * this.frequency;
      for (c = j = 0, ref = outb.numberOfChannels - 1; 0 <= ref ? j <= ref : j >= ref; c = 0 <= ref ? ++j : --j) {
        outputData = outb.getChannelData(c);
        for (i = k = 0, len = outputData.length; k < len; i = ++k) {
          x = outputData[i];
          p_phase = (this.phase % this.tau) / this.tau;
          if (p_phase <= this.duty_cycle) {
            localphase = p_phase / this.duty_cycle;
            real_val = -1 - Math.cos(localphase * this.tau * this.frequency * this.b) * 0.2 * Math.pow(Math.abs(localphase - 0.5) * 2, 3);
          } else if (p_phase >= this.duty_cycle) {
            localphase = (p_phase - this.duty_cycle) / (1 - this.duty_cycle);
            real_val = 1 + Math.cos(localphase * this.tau * this.frequency * this.b) * 0.2 * Math.pow(Math.abs(localphase - 0.5) * 2, 3);
          }
          this.phase = this.phase + m;
          outputData[i] = real_val;
        }
      }
      return null;
    };

    ImprovedOscillator.prototype.noise = function(e) {
      var c, i, j, k, l, len, outb, outputData, ref;
      outb = e.outputBuffer;
      l = outb.length;
      for (c = j = 0, ref = outb.numberOfChannels - 1; 0 <= ref ? j <= ref : j >= ref; c = 0 <= ref ? ++j : --j) {
        outputData = outb.getChannelData(c);
        for (i = k = 0, len = outputData.length; k < len; i = ++k) {
          c = outputData[i];
          outputData[i] = Math.random() + this.dc;
        }
      }
      return null;
    };

    return ImprovedOscillator;

  })(Mooog.MooogAudioNode);

  Mooog.extend_with("ImprovedOscillator", ImprovedOscillator);

}).call(this);
