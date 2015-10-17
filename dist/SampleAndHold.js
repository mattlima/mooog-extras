
/*

  A noise-generator-style sample and hold:
  outputs random value between -1 and 1 updated at `frequency`.

  Weaknesses of the current implementation:
  - sampling rate frequency upper bound is
  bufferLength/sampleRate seconds ( about 45Hz at 1024/44100 )
  - Only generates noise samples (no provision for sampling
  arbitrary inputs




                                +--------------------+
                                | Oscillator(input)  |
                                | type:sine          |
+------------------+            +----------+---------+
| BufferSource(bs) |                       |
| buffer: [1,1]    |            +----------+--------------------+
| loop:true        |            | ScriptProcessor(p)            |
+--------+---------+            | set out.gain to random value  |
         |               +------+ whenever the Oscillator value |
         |               |      | passes from <0 to >0          |
         |               |      |                               |
         |               |      +---------------+---------------+
         |               |                      |
         |               |                      |
         |               |                      |
         |               |      +---------------+----------------+
         |               |      | Gain(out_null)                 |
         |               |      | A silent connection to         |
    +----+-----+         |      | the destination node, required |
    | Gain(out)<---------+      | for the ScriptProcessor to     |
    +----+-----+                | receive onaudioprocess events  |
         |                      |                                |
         v                      +--------------------------------+
 */

(function() {
  var SampleAndHold,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SampleAndHold = (function(superClass) {
    extend(SampleAndHold, superClass);

    function SampleAndHold(_instance, config) {
      this._instance = _instance;
      this.check_freq = bind(this.check_freq, this);
      SampleAndHold.__super__.constructor.apply(this, arguments);
    }

    SampleAndHold.prototype.before_config = function(config) {
      this.input = this.context.createOscillator();
      this.p = this.context.createScriptProcessor();
      this.out_null = this.context.createGain();
      this.out_null.gain.value = 0;
      this.b = this.context.createBuffer(1, 2, this.context.sampleRate);
      this.b.getChannelData(0).set([1, 1]);
      this.bs = this.context.createBufferSource();
      this.out = this.context.createGain();
      this.bs.buffer = this.b;
      this.bs.loop = true;
      this.p.onaudioprocess = this.check_freq;
      this.input.frequency.value = 2;
      this.last = 0;
      this.insert_node(this.input, 0);
      this.insert_node(this.out, 1);
      return null;
    };

    SampleAndHold.prototype.after_config = function(config) {
      this.input.disconnect(this.out);
      this.input.connect(this.p);
      this.p.connect(this.out_null);
      this.out_null.connect(this.out);
      this.bs.connect(this.out);
      this.input.start();
      this.bs.start();
      return null;
    };

    SampleAndHold.prototype.check_freq = function(e) {
      var i, inb, inputData, j, l, len, s;
      inb = e.inputBuffer;
      l = inb.length;
      inputData = inb.getChannelData(0);
      for (i = j = 0, len = inputData.length; j < len; i = ++j) {
        s = inputData[i];
        if ((inputData[i] === 0) || ((this.last < 0) && (inputData[i] > 0))) {
          this.out.gain.value = Math.random() * 2 - 1;
        }
        this.last = inputData[i];
      }
      return null;
    };

    return SampleAndHold;

  })(Mooog.MooogAudioNode);

  Mooog.extend_with("SampleAndHold", SampleAndHold);

}).call(this);
