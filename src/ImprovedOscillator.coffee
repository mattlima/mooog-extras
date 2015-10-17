###

  Experimental ScriptProcessor versions of basic waveforms
  with duty cycle controls. There are aliasing problems
  with the square wave that make it unusable as a sound
  source (but OK for LFOs).


###

class ImprovedOscillator extends Mooog.MooogAudioNode
  constructor: (config)->
    super

  before_config: (config)->

    Object.defineProperty @, 'type', {
      get: ->
        @__type
      set: (t) =>
        @__type = t
        if t is 'sawtooth'
          @duty_cycle = 1.0
        if t is 'triangle'
          @duty_cycle = 0.5
        if t is 'square'
          @duty_cycle = 0.5
        @onaudioprocess = @[t]
      enumerable: true
      configurable: true
    }
    p = @context.createScriptProcessor(null,0,1)
    @insert_node p, 0
    @last = 0
    @frequency = 440
    @dc = 0
    @phase = 0
    @duty_cycle = 0.5
    @tau = Math.PI * 2
    @b = 0.1

  after_config: (config)->
    @type ?= 'sine'
    @sample_rate = @_instance.context.sampleRate
    @secs_per_sample = 1/@sample_rate


  sine: (e) =>
    outb = e.outputBuffer
    l = outb.length
    m = @secs_per_sample * 2 * Math.PI * @frequency
    for c in [0..(outb.numberOfChannels-1)]
      outputData = outb.getChannelData(c)
      for x,i in outputData
        real_val = Math.sin( @phase )
        @phase = @phase + m
        outputData[i] = real_val
    null


  triangle: (e) =>
    outb = e.outputBuffer
    l = outb.length
    m = @secs_per_sample * @tau * @frequency
    for c in [0..(outb.numberOfChannels-1)]
      outputData = outb.getChannelData(c)
      for x,i in outputData
        p_phase = (@phase % (@tau)) / (@tau)
        if p_phase < @duty_cycle
          p_duty = p_phase / @duty_cycle
          real_val = p_duty * 2 - 1
        else
          p_duty = (p_phase - @duty_cycle) / (1 - @duty_cycle)
          real_val = (1 - p_duty) * 2 - 1
        @phase = @phase + m
        outputData[i] = real_val
    null

  sawtooth: @.prototype.triangle

  square: (e) =>
    outb = e.outputBuffer
    l = outb.length
    m = @secs_per_sample * @tau * @frequency
    for c in [0..(outb.numberOfChannels-1)]
      outputData = outb.getChannelData(c)
      for x,i in outputData
        p_phase = (@phase % (@tau)) / (@tau)
        if p_phase <= @duty_cycle
          localphase = p_phase / @duty_cycle
          real_val = -1 - Math.cos(localphase * @tau * @frequency * @b) * 0.2 *
          Math.pow(Math.abs(localphase - 0.5) * 2, 3)
        else if p_phase >= @duty_cycle
          localphase = (p_phase - @duty_cycle) / (1 - @duty_cycle)
          real_val = 1 +  Math.cos(localphase * @tau * @frequency * @b) * 0.2 *
          Math.pow(Math.abs(localphase - 0.5) * 2, 3)
        @phase = @phase + m
        outputData[i] = real_val
    null



  noise: (e) =>
    outb = e.outputBuffer
    l = outb.length
    for c in [0..(outb.numberOfChannels-1)]
      outputData = outb.getChannelData(c)
      for c,i in outputData
        outputData[i] = Math.random() + @dc
    null


Mooog.extend_with "ImprovedOscillator", ImprovedOscillator
