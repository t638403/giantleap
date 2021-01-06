const RingBuffer = require('@giantleap/utils/RingBuffer');

class StepSequencerError extends Error {
  constructor(msg) {
    super(`StepSequencerError: ${msg}`);
  }
}

const StepSequencer = (key, aSequence) => {
  const sequence = RingBuffer(aSequence);
  let prevStep = '.';
  let step = sequence.next().value;
  let prevVelocity = 127;
  let velocity = 127;
  let noteOffGap = 3000000n;
  return {

    next(t) {

      const msgs = [];

      if(/^[0-9a-f]$/i.test(step)) {
        velocity = parseInt(step, 16) * 0x8;
        step = 'x';
      }
      switch(`${prevStep}${step}`) {
        case '=.':
        case 'x.':
          msgs.push({t:t - noteOffGap, msg:'noteOff', key, velocity:prevVelocity});
          prevVelocity = velocity;
          velocity = 127;
          break;
        case 'xx':
        case '=x':
          // There must be a tiny delay between noteOff and noteOn or machines
          // start to behave strange, like hanging notes. 3ms seems long enough
          // for the machines, and it is short enough for us humans to not
          // notice.
          msgs.push({t: t - noteOffGap, msg:'noteOff', key, velocity:prevVelocity});
          msgs.push({t, msg:'noteOn', key, velocity});
          prevVelocity = velocity;
          velocity = 127;
          break;
        case '.x':
          msgs.push({t, msg:'noteOn', key, velocity});
          prevVelocity = velocity;
          velocity = 127;
          break;
      }

      // Finally
      prevStep = step;
      step = sequence.next().value;
      return msgs;
    }
  }
}

StepSequencer.parse = (pianoNoteGrid, pianoKeyMapping) => pianoNoteGrid
  .split('\n')
  .filter(track =>
    /^(.*?):([0-9a-fx=.])*$/.test(track) // Something like C#2 :x..x..x.x..x..x
    && !/^(.*?):([.])*$/.test(track)     // Skip empty tracks
    && !/^\/\//.test(track)              // Skip comment, e.g. //...
  )
  .map(track => ({
    // Match anything before and after the colon.
    key: track.match(/^(.*?):/)[1].trim(),
    track: track.match(/^.*?:(.*)/)[1].trim()
  }))
  .filter(({key, track}) => (pianoKeyMapping && pianoKeyMapping[key]) || /^[CDEFGAB](#|)\d$/.test(key) || (() => {throw new StepSequencerError(`Invalid key ${key}`)})())
  .map(({key, track}) => ({
    key:(pianoKeyMapping && pianoKeyMapping[key]) ? pianoKeyMapping[key] : key,
    track
  }))
  .map(({key, track}) => StepSequencer(key, track.split('')))
;

module.exports = StepSequencer;