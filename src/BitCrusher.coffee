###

  Cheap BitCrusher supporting both downsampling and
  bitdepth modulation via the parameters

  \downsample - defaults to one. Take every nth sample.
  \bitdepth - defaults to 8. Fractional bitdepths are possible, YMMV.

###

class BitCrusher extends Mooog.MooogAudioNode
  constructor: (@_instance, config)->
    super


  before_config: (config)->
    p = @context.createScriptProcessor()
    p.onaudioprocess = @crush
    @insert_node p, 0
    @bitdepth = 8
    @downsample = 1
    null

  after_config: (config)->
    @sample_rate = @_instance.context.sampleRate
    null

  crush: (e) =>
    inb = e.inputBuffer
    outb = e.outputBuffer
    l = inb.length
    for c in [0..(outb.numberOfChannels-1)]
      inputData = inb.getChannelData(c)
      outputData = outb.getChannelData(c)
      for s, i in inputData
        outputData[i] = Math.round(
          inputData[ Math.floor( (i / @downsample) ) * @downsample ]* @bitdepth
          ) / @bitdepth
    null



Mooog.extend_with "BitCrusher", BitCrusher
