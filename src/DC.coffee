
class DC extends Mooog.MooogAudioNode
  constructor: (@_instance, config)->
    super


  before_config: (config)->
    p = @context.createScriptProcessor()
    p.onaudioprocess = @apply_dc
    @insert_node p, 0
    @dc = 0

  after_config: (config)->


  apply_dc: (e) =>
    inb = e.inputBuffer
    outb = e.outputBuffer
    l = inb.length
    for c in [0..(outb.numberOfChannels-1)]
      inputData = inb.getChannelData(c)
      outputData = outb.getChannelData(c)
      for s, i in inputData
        outputData[i] = inputData[i] + @dc
    null



Mooog.extend_with "DC", DC
