
/*

Adds DC to the input. Control via the 'dc' AudioParam exposed on the DC object


        +            +-----------------+
        |            |BufferSource(_bs)|
        |            |buffer: [1,1]    |
        |            |loop: true       |
        |            +-----------------+
        |                  |            
        |            +----------+       
        |            |Gain(_dc) |       
        |            +----------+       
+---------------+          |            
| Gain(_thru)   <----------+            
+---------------+                       
        |
 */

(function() {
  var DC,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  DC = (function(superClass) {
    extend(DC, superClass);

    function DC(_instance, config) {
      this._instance = _instance;
      DC.__super__.constructor.apply(this, arguments);
    }

    DC.prototype.before_config = function(config) {
      this._thru = this.context.createGain();
      this._dc1buffer = this.context.createBuffer(1, 2, this.context.sampleRate);
      this._dc1buffer.getChannelData(0).set([1, 1]);
      this._bs = this.context.createBufferSource();
      this._bs.buffer = this._dc1buffer;
      this._bs.loop = true;
      this._bs.start(this.context.currentTime);
      this._dc = this.context.createGain();
      this.insert_node(this._thru, 0);
      this._bs.connect(this._dc);
      return this._dc.connect(this._thru);
    };

    DC.prototype.after_config = function(config) {
      console.log(config);
      this.dc = this._dc.gain;
      if (config.gain != null) {
        this._dc.gain.value = config.gain;
      }
      return null;
    };

    return DC;

  })(Mooog.MooogAudioNode);

  Mooog.extend_with("DC", DC);

}).call(this);
