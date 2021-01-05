const { Transform } = require('stream'),
  StepSequencer = require('@giantleap/util/StepSequencer'),
  Electribe    = require('@giantleap/Electribe')
;

class MultiPattern extends Transform {

  /**
   *
   * @param pianoNoteGrid
   * @param pianoKeyMapping A label/notenr/notestr mapping, e.g. {CLAP:'22', 'HHC':21, ...}
   */
  constructor(pianoNoteGrid, pianoKeyMapping) {
    super({objectMode:true});
    this.tracks = StepSequencer.parse(pianoNoteGrid, pianoKeyMapping);
  }

  _transform(step, encoding, done) {

    // Walk over all piano keys of the multi pattern (y direction)
    const pianoKeys = Object.keys(this.tracks);
    for(const pianoKey of pianoKeys) {

      // Walk over all key strikes (and silences) (x direction)
      const stepSequencer = this.tracks[pianoKey];

      // The step sequencer returns an array of 0, 1 or 2 partial (midi)
      // messages.
      const msgs = stepSequencer.next(step.t);

      for(const msg of msgs) {
        this.push(Object.assign(step, msg));
      }

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