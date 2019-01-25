const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Instrument  = require('@giantleap/Instrument'),
	Stitch      = require('@giantleap/Stitch'),
	MidiMsgr    = require('@giantleap/MidiMsgr'),
	MidiOut     = require('@giantleap/MidiOut'),
	TimeSort    = require('@giantleap/TimeSort'),
	Tap         = require('@giantleap/Tap'),
	Json        = require('@giantleap/JSON')
;

const out = new Stitch();
out
	// .pipe(new Tap())
	.pipe(new TimeSort())
	.pipe(new MidiOut())
;

// electribe notes
const en = require('./modules/instruments/electribe').notes;
const electribe = () => new Instrument(3, 2);
const arp = () => new Instrument(1, 1);
const m120 = () => new Metronome(120, 4);


m120()
	.pipe(new Pattern([
		'x...'
	]))
	.pipe(new Note('C2'))
	.pipe(arp())
	.pipe(new MidiMsgr())
	.pipe(out)
;

m120()
	.pipe(new Pattern([
		'x...'
	]))
	.pipe(new Note(en.S1))
	.pipe(electribe())
	.pipe(new MidiMsgr())
	.pipe(out)
;

m120()
	.pipe(new Pattern([
		'x..x'
	]))
	.pipe(new Velocity('036'))
	.pipe(new Note(en.HH_CLOSE))
	.pipe(electribe())
	.pipe(new MidiMsgr())
	.pipe(out)
;

m120()
	.pipe(new Pattern([
		'..x.'
	]))
	.pipe(new Note(en.HH_OPEN))
	.pipe(electribe())
	.pipe(new MidiMsgr())
	.pipe(out)
;

m120()
	.pipe(new Pattern([
		'....x...'
	]))
	.pipe(new Note(en.CLAP))
	.pipe(electribe())
	.pipe(new MidiMsgr())
	.pipe(out)
;

m120()
	.pipe(new Pattern([
		'x'
	]))
	.pipe(new Velocity('123454321'))
	.pipe(new Note(en.S2))
	.pipe(electribe())
	.pipe(new MidiMsgr())
	.pipe(out)
;

m120()
	.pipe(new Pattern([
		'x..x..x...x.xx..x..x..x...x.x...'
	]))
	.pipe(new Velocity('787987968697968'))
	.pipe(new Note(en.S3))
	.pipe(electribe())
	.pipe(new MidiMsgr())
	.pipe(out)
;
