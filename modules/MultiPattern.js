const { Transform } = require('stream'),
  RingBuffer = require('@giantleap/utils/RingBuffer'),
  {noteStrToNr, MsgrError} = require('./utils/Msgr'),
  Electribe    = require('@giantleap/Electribe')
;

class MultiPatternError extends Error {
  constructor(msg) {
    super(`MultiPatternError: ${msg}`);
  }
}

const log = (msg) => console.log(`MultiPattern: ${msg}`);



class MultiPattern extends Transform {

  /**
   *
   * @param pattern
   * @param mapping A label/notenr/notestr mapping, e.g. {CLAP:'22', 'HHC':21, ...}
   */
  constructor(pattern, mapping) {
    super({objectMode:true});
    console.log(mapping)
    this.tracks = {
      // For example:
      // 'C#3' : {prevStep:false, ringBuffer:RingBuffer(['x', '=', '=', ''])}
    };
    const tracks = pattern.split('\n');
    for(const track of tracks) {
      try {

      // The head of the track is the piano key, for example 'C3 :x==.'
      let pianoKey = track.match(/^(.*?):/)[1].trim();
      console.log(pianoKey)
      if(mapping) {
        if (mapping && !(pianoKey in mapping)) {
          throw new MsgrError(`No mapping for: ${pianoKey}`);
        }
        pianoKey = mapping[pianoKey];
      } else {
        // Check if is valid piano key or throw error and which will skip the track thanks to the the catch
        noteStrToNr(pianoKey);
      }

      const pianoPattern = track.match(/^.*?:(.*)/)[1].trim().split('');

        if(this.tracks[pianoKey]) throw new MultiPatternError(`Double key in pattern: ${pianoKey}`);
        if(pianoPattern.length % 8 > 0) throw new MultiPatternError(`Track length must be a multiple of 8 for pattern: ${pianoKey}`);

        this.tracks[pianoKey] = {
          prevStep: false,
          hit: null,
          ringBuffer: RingBuffer(pianoPattern)
        };
      } catch(e) {
        if(e instanceof MsgrError) {
          log(`Skipping track: ${track.slice(0, 10)}`);
        } else {
          throw e;
        }
      }
    }
  }

  _transform(step, encoding, done) {

    const pianoKeys = Object.keys(this.tracks);
    for(const pianoKey of pianoKeys) {

      const {prevStep, hit, ringBuffer} = this.tracks[pianoKey];
      const thisStep = ringBuffer.next().value;

      switch (thisStep) {
        case 'x':
          if(prevStep === 'x' || prevStep === '=') {
            // There must be a tiny delay between noteOff and noteOn or machines start to expose undesirable
            // behaviour, like hanging notes. 3ms seems long enough for our machines to react, and it is short
            // enough for us humans to not notice.
            hit.tEnd = step.t - 3000000n;
            this.push(Object.assign({}, hit));
          }
          this.tracks[pianoKey].hit = Object.assign({}, step, { msg: 'note', key: pianoKey });
          break;
        case '.':
          if(prevStep === '=' || prevStep === 'x') {
            hit.tEnd = step.t - 3000000n;
            this.push(Object.assign({}, hit));
            this.tracks[pianoKey].hit = null;
          }
          break;
      }
      this.tracks[pianoKey].prevStep = thisStep;
    }

    done();
  }

}

MultiPattern.ElectribeMapping = {
  S1      :Electribe.S1,
  S2      :Electribe.S2,
  S3      :Electribe.S3,
  S4      :Electribe.S4,
  HH_CLOSE:Electribe.HH_CLOSE,
  HH_OPEN :Electribe.HH_OPEN,
  CRASH   :Electribe.CRASH,
  CLAP    :Electribe.CLAP,
}

module.exports = MultiPattern;