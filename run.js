const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Instrument  = require('@giantleap/Instrument'),
	MidiMsgr    = require('@giantleap/MidiMsgr'),
	MidiOut     = require('@giantleap/MidiOut'),
	TimeSort    = require('@giantleap/TimeSort'),
	Json        = require('@giantleap/JSON')
;

const out = new MidiOut();
const ts  = new TimeSort();

// electribe notes
const en = require('./modules/instruments/electribe').notes;
const electribe = new Instrument(2, 2);
const m = new Metronome(120, 4);

m
	.pipe(new Pattern([
		'x.xx'
	]))
	.pipe(new Velocity('036'))
	.pipe(new Note(en.HH_CLOSE))
	.pipe(electribe)
	.pipe(new MidiMsgr())
	.pipe(ts)
	.pipe(out)
;

m
	.pipe(new Pattern([
		'....x...'
	]))
	// .pipe(new Velocity('123454321'))
	.pipe(new Note(en.CLAP))
	.pipe(electribe)
	.pipe(new MidiMsgr())
	.pipe(ts)
	.pipe(out)
;

m
	.pipe(new Pattern([
		'x'
	]))
	.pipe(new Velocity('123454321'))
	.pipe(new Note(en.S2))
	.pipe(electribe)
	.pipe(new MidiMsgr())
	.pipe(ts)
	.pipe(out)
;

m
	.pipe(new Pattern([
		'x..x..x...x.xx..x..x..x...x.x...'
	]))
	.pipe(new Velocity('787987968697968'))
	.pipe(new Note(en.S3))
	.pipe(electribe)
	.pipe(new MidiMsgr())
	.pipe(ts)
	.pipe(out)
;