const { Transform } = require('stream'),
  StepSequencer = require('@giantleap/utils/StepSequencer'),
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
    for(const stepSequencer of this.tracks) {

      // Walk over all key strikes (and silences) (x direction)
      // The step sequencer returns an array of 0, 1 or 2 partial (midi)
      // messages.
      const msgs = stepSequencer.next(step.t);

      for(const msg of msgs) {
        // Assign to new object or note key will be overwritten due to pointer of step. I mean use the {} in
        // Object.assign.
        this.push(Object.assign({}, step, msg));
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