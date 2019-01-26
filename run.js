const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Value       = require('@giantleap/Value'),
	Nrpn        = require('@giantleap/Nrpn'),
	Chord       = require('@giantleap/Chord'),
	Clock       = require('@giantleap/Clock'),
	Instrument  = require('@giantleap/Instrument'),
	Electribe   = require('@giantleap/Electribe'),
	Out         = require('@giantleap/Out'),
	JSON        = require('@giantleap/JSON')
;

// electribe notes
const en = require('./modules/instruments/electribe').notes;
const electribe = () => new Electribe(2, 2);
const yamaha = () => new Instrument(2, 3);
const arp = () => new Instrument(3, 1);
const doepfer = () => new Instrument(4, 1);

const bpm = 120;
const m120 = () => new Metronome(bpm, 4);
const m120_32 = () => new Metronome(bpm, 32);
const midiClock = (...instruments) => instruments
	.forEach(inst => (new Metronome(bpm, 24))
		.pipe(new Clock())
		.pipe(inst())
		.pipe(new Out())
	)
;

midiClock(electribe, yamaha, doepfer);

// m120()
// 	.pipe(new Pattern([
// 		'x..x====.x.x...x'
// 	]))
// 	.pipe(new Chord([
// 		['C3', 'D#3', 'G3'],
// 		['C3', 'D#3', 'G3'],
// 		['C3', 'D#3', 'G3'],
// 		['D3', 'F3', 'A3'],
// 		['C3', 'D#3', 'G3'],
// 		['C3', 'D#3', 'G3'],
// 		['C3', 'D#3', 'G3'],
// 		['A#2', 'D3', 'F3'],
// 	], 1))
// 	// .pipe(new Note('C3', 1))
// 	.pipe(yamaha())
// 	.pipe(new Out())
// ;

m120()
	.pipe(new Pattern([
		'x...'
	]))
	.pipe(new Note(Electribe.S1))
	.pipe(electribe())
	.pipe(new Out())
;

m120()
	.pipe(new Value())
	.pipe(new Nrpn(Electribe.nrpn('S1', 'Pitch')))
	// .pipe(JSON.stringify)
	// .pipe(process.stdout)
	.pipe(electribe())
	.pipe(new Out())
;

//
// m120()
// 	.pipe(new Pattern([
// 		'x..x'
// 	]))
// 	.pipe(new Velocity('036'))
// 	.pipe(new Note(Electribe.HH_CLOSE))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'..x.'
// 	]))
// 	.pipe(new Note(Electribe.HH_OPEN))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'....x...'
// 	]))
// 	.pipe(new Note(Electribe.CLAP))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'x'
// 	]))
// 	.pipe(new Velocity('123454321'))
// 	.pipe(new Note(Electribe.S2))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
//
// m120()
// 	.pipe(new Pattern([
// 		'x..x..x...x.xx..x..x..x...x.x...'
// 	]))
// 	.pipe(new Velocity('787987968697968'))
// 	.pipe(new Note(Electribe.S3))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;
