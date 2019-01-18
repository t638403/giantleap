const {Readable} = require('stream')
;

class Metronome extends Readable {

	/**
	 * Create a metronome and specify for example quarter notes
	 *
	 * @param bpm {number} Beats per minute
	 * @param ticksPerBeat {times} Note type, for example 4 for quarter notes
	 * @param swing {number} Percentage of swing, for example 0.5 for 50% swing on every other note
	 */
	constructor(bpm, ticksPerBeat, swing = 0) {
		super({objectMode:true});
		this.beatIndex = BigInt(0);
		const interval = (60000000000 / (ticksPerBeat * bpm));
		this.interval = BigInt( Math.round(interval) );
		this.swing    = BigInt( Math.round( swing * interval ) );
		this.isSwingBeat = false;
		this.play = false;
		this.start;
	}
	_read() {
		if(this.beatIndex >= 4) {
			return this.push(null);
		}
		if(!this.isSwingBeat) {
			this.push( { t: (this.beatIndex * this.interval) });
		} else {
			this.push( { t: (( this.beatIndex * this.interval ) + this.swing) } );
		}
		this.isSwingBeat = !this.isSwingBeat;
		this.beatIndex++;
	}
}

module.exports = Metronome;