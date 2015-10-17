###

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


###


class DC extends Mooog.MooogAudioNode
  constructor: (@_instance, config)->
    super


  before_config: (config)->
    @_thru = @context.createGain()
    @_dc1buffer = @context.createBuffer(1, 2, @context.sampleRate)
    @_dc1buffer.getChannelData(0).set([ 1, 1 ])

    @_bs = @context.createBufferSource()
    @_bs.buffer = @_dc1buffer
    @_bs.loop = true
    @_bs.start(@context.currentTime)
    @_dc = @context.createGain()

    @insert_node @_thru, 0
    @_bs.connect(@_dc)
    @_dc.connect(@_thru)


  after_config: (config)->
    console.log(config)
    @_thru.dc = @_dc.gain
    @_dc.gain.value = config.gain if config.gain?

    null





Mooog.extend_with "DC", DC
