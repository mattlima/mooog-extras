


class SampleBuffer extends Mooog.MooogAudioNode
  constructor: (@_instance, config)->
    super


  before_config: (config)->
    p = @context.createScriptProcessor()
    p.onaudioprocess = @sample
    @insert_node p, 0
    @data = new Array

  after_config: (config)->


  sample: (e) =>
    inb = e.inputBuffer
    outb = e.outputBuffer
    l = inb.length
    for c in [0..(outb.numberOfChannels-1)]
      inputData = inb.getChannelData(c)
      @onaudioprocess = null

      for s, i in inputData
        @data[i] = inputData[i]
    null



Mooog.extend_with "SampleBuffer", SampleBuffer