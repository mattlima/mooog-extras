###

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



###


class SampleAndHold extends Mooog.MooogAudioNode
  constructor: (@_instance, config)->
    super


  before_config: (config)->

    @input = @context.createOscillator()
    @p = @context.createScriptProcessor()
    @out_null = @context.createGain()
    @out_null.gain.value = 0
    @b = @context.createBuffer(1,2,@context.sampleRate)
    @b.getChannelData(0).set([1,1])
    @bs = @context.createBufferSource()
    @out = @context.createGain()

    @bs.buffer = @b
    @bs.loop = true
    @p.onaudioprocess = @check_freq
    @input.frequency.value = 2
    @last = 0

    @insert_node @input, 0
    @insert_node @out, 1
    null

  after_config: (config)->
    @input.disconnect @out

    @input.connect @p
    @p.connect @out_null
    @out_null.connect @out
    @bs.connect @out

    @input.start()
    @bs.start()

    null


  check_freq: (e) =>
    inb = e.inputBuffer
    l = inb.length
    inputData = inb.getChannelData(0)
    for s, i in inputData
      if (inputData[i] is 0) or ((@last < 0) and (inputData[i] > 0))
        @out.gain.value = Math.random() * 2 - 1
      @last = inputData[i]
    null



Mooog.extend_with "SampleAndHold", SampleAndHold
