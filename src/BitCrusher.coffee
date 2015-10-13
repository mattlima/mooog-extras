

class BitCrusher extends Mooog.MooogAudioNode
  constructor: (@_instance, config)->
    super


  before_config: (config)->
    p = @context.createScriptProcessor()
    p.onaudioprocess = @crush
    @insert_node p, 0
    @resolution = 8
    @downsample = 1

  after_config: (config)->
    @sample_rate = @_instance.context.sampleRate


  crush: (e) =>
    inb = e.inputBuffer
    outb = e.outputBuffer
    l = inb.length
    for c in [0..(outb.numberOfChannels-1)]
      inputData = inb.getChannelData(c)
      outputData = outb.getChannelData(c)
      for s, i in inputData
        outputData[i] = Math.round(
          inputData[ Math.floor( (i / @downsample) ) * @downsample ]* @resolution) / @resolution
    null



Mooog.extend_with "BitCrusher", BitCrusher
