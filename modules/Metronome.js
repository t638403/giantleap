const { Readable } = require('stream');

class Metronome extends Readable {

	/**
	 * Create a metronome and specify for example quarter notes
	 *
	 * @param bpm {number} Beats per minute
	 * @param ticksPerBeat {int} Note type, for example 4 for quarter notes
	 * @param swing {float} Percentage of swing, for example 0.5 for 50% swing on every other note
	 * @param offset {int} schedule al notes a little later
	 */
	constructor(bpm, ticksPerBeat, swing = 0, offset = 0n) {
		super({objectMode:true});
		this.beatIndex = 0n;
		this.bpm = bpm;
		this.ticksPerBeat = ticksPerBeat;
		const interval = (60000000000 / (ticksPerBeat * bpm));
		this.interval = BigInt( Math.round(interval) );
		this.swing    = BigInt( Math.round( swing * interval ) );
		this.isSwingBeat = false;
		this.play = false;
		this.offset = BigInt(offset);
		this.start;
	}
	_read() {
		if(!this.isSwingBeat) {
			this.push( { t: this.offset + (this.beatIndex * this.interval), bpm:this.bpm, tpb:this.ticksPerBeat });
		} else {
			this.push( { t: this.offset + (( this.beatIndex * this.interval ) + this.swing), bpm:this.bpm, tpb:this.ticksPerBeat  } );
		}
		this.isSwingBeat = !this.isSwingBeat;
		this.beatIndex++;
	}
}

module.exports = Metronome;