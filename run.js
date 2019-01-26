const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Clock       = require('@giantleap/Clock'),
	Instrument  = require('@giantleap/Instrument'),
	Out         = require('@giantleap/Out')
;

// electribe notes
const en = require('./modules/instruments/electribe').notes;
const electribe = () => new Instrument(2, 2);
const yamaha = () => new Instrument(2, 3);
const arp = () => new Instrument(3, 1);
const doepfer = () => new Instrument(4, 1);

const bpm = 120;
const m120 = () => new Metronome(bpm, 4);
const midiClock = () => new Metronome(bpm, 24);

[
	electribe(),
	yamaha(),
	doepfer()
].forEach(inst => {
	midiClock()
		.pipe(new Clock())
		.pipe(inst)
		.pipe(new Out())
});

m120()
	.pipe(new Pattern([
		'x...'
	]))
	.pipe(new Note('C2'))
	.pipe(electribe())
	.pipe(new Out())
;

// m120()
// 	.pipe(new Pattern([
// 		'x...'
// 	]))
// 	.pipe(new Note(en.S1))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'x..x'
// 	]))
// 	.pipe(new Velocity('036'))
// 	.pipe(new Note(en.HH_CLOSE))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'..x.'
// 	]))
// 	.pipe(new Note(en.HH_OPEN))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'....x...'
// 	]))
// 	.pipe(new Note(en.CLAP))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'x'
// 	]))
// 	.pipe(new Velocity('123454321'))
// 	.pipe(new Note(en.S2))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'x..x..x...x.xx..x..x..x...x.x...'
// 	]))
// 	.pipe(new Velocity('787987968697968'))
// 	.pipe(new Note(en.S3))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
