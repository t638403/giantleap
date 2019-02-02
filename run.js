const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Value       = require('@giantleap/Value'),
	Nrpn        = require('@giantleap/Nrpn'),
	Chord       = require('@giantleap/Chord'),
	Ctrl        = require('@giantleap/Ctrl'),
	Clock       = require('@giantleap/Clock'),
	Device      = require('@giantleap/Device'),
	Instrument  = require('@giantleap/Instrument'),
	Electribe   = require('@giantleap/Electribe'),
	Out         = require('@giantleap/Out'),
	MidiOut     = require('@giantleap/MidiOut'),
	JSON        = require('@giantleap/JSON'),
	RingBuffer  = require('@giantleap/utils/RingBuffer')
;

const ensoniq1   = () => new Instrument(/MIDIMATE II \d\d:0/, 1);
const ensoniq2   = () => new Instrument(/MIDIMATE II \d\d:0/, 2);
const ensoniq3   = () => new Instrument(/MIDIMATE II \d\d:0/, 3);

const evolver   = () => new Instrument(/MIDIMATE II \d\d:1/, 2);
const electribe = () => new Electribe (/MIDIMATE II \d\d:1/, 2);
const yamaha    = () => new Instrument(/MIDIMATE II \d\d:1/, 3);

const arp       = () => new Instrument(/ARPODYSSEY-FS \d\d:0/, 1);
const doepfer   = () => new Instrument(/USB Device 0x7cd:0xfe06 \d\d:0/, 1);

const sendMidiClock = (bpm) => Object
	.values(MidiOut.availablePorts())
	.forEach(port => (new Metronome(bpm, 24))
		.pipe(new Clock())
		.pipe(new Device(port))
		.pipe(new Out())
	)
;

// CLOCK ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const bpm = 120;
sendMidiClock(bpm);
const m120 = () => new Metronome(bpm, 4);
const m120_n = (n) => new Metronome(bpm, n);

// SONG ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// m120()
// 	.pipe(new Pattern([
// 		'x==============.'
// 	]))
// 	.pipe(new Chord([
// 		['C3', 'D#3', 'G3'],
// 		// ['C3', 'D#3', 'G3'],
// 		// ['C3', 'D#3', 'G3'],
// 		// ['D3', 'F3', 'A3'],
// 		// ['C3', 'D#3', 'G3'],
// 		// ['C3', 'D#3', 'G3'],
// 		// ['C3', 'D#3', 'G3'],
// 		// ['A#2', 'D3', 'F3'],
// 	], 1))
// 	// .pipe(new Note('C3', 1))
// 	.pipe(yamaha())
// 	.pipe(new Out())
// ;

// m120()
// 	.pipe(new Pattern([
// 		'x...x..x.x..x....x..x..xxxxxx...',
// 		'..x..x..x.....x.....x.x..x..x.x.',
// 		'x...x..x.x..x.x.x...x..x.x..x.x.',
// 		'..x..x..x..x.x....x..x..x.x.x...'
// 	]))
// 	.pipe(new Velocity('837957385478539278560478'))
// 	.pipe(new Note([
// 		'C2', 'D#3', 'A5', 'A#6', 'G3',
// 		'C2', 'D#3', 'A5', 'A#6', 'G3',
// 		'C2', 'D#3', 'A5', 'A#6', 'G3',
// 		'F1', 'F#2', 'G3', 'F2', 'G#3',
// 		'F1', 'F#2', 'G3', 'F2', 'G#3',
// 		'F1', 'F#2', 'G3', 'F2', 'G#3',
// 	]))
// 	.pipe(evolver())
// 	.pipe(new Out())
// ;
//
// const values = RingBuffer('11214121'.split('').map(v => Math.round(parseInt(v, 10) / 10 * 127 )));
// m120_n(8)
// 	.pipe(new Value())
// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Pitch')))
// 	// .pipe(JSON.stringify)
// 	// .pipe(process.stdout)
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;

m120()
	.pipe(new Pattern('xxxxxxxx'))
	.pipe(new Note([
		Electribe.S1,
		Electribe.HH_CLOSE,
		Electribe.HH_OPEN,
		Electribe.HH_CLOSE,
		Electribe.S1,
		Electribe.HH_CLOSE,
		Electribe.HH_OPEN,
		Electribe.HH_CLOSE,
	]))
	.pipe(electribe())
	.pipe(new Out())
;

m120()
	.pipe(new Pattern('..x..x.x..x..x.x..x..x.x..x..x..'))
	.pipe(new Note(Electribe.CLAP))
	.pipe(electribe())
	.pipe(new Out())
;

m120()
	.pipe(new Pattern([
		'..x..x.x..x..x.x..x..x.x..x.x.x...x.'
	]))
	.pipe(new Note('C3'))
	.pipe(arp())
	.pipe(new Out())
;

m120()
	.pipe(new Pattern([
		'....x.......x....x.......x..x.......x....x..x....x..x..x.x..x...'
	]))
	.pipe(new Velocity('1'))
	.pipe(new Note('C7'))
	.pipe(ensoniq1())
	.pipe(new Out())
;

m120()
	.pipe(new Pattern([
		'..x.'
	]))
	.pipe(new Velocity('1'))
	.pipe(new Note('A#3'))
	.pipe(ensoniq1())
	.pipe(new Out())
;

m120()
	.pipe(new Pattern([
		'x...'
	]))
	.pipe(new Velocity('9'))
	.pipe(new Note('C2'))
	.pipe(ensoniq2())
	.pipe(new Out())
;

m120()
	.pipe(new Pattern([
		'........x..x..x=',
		'============....'
	]))
	.pipe(new Chord([
		// ['F2', 'G#2', 'A#2', 'C#3', 'E3']
		['E4', 'F#4', 'G#4', 'A4'],
		['E4', 'F#4', 'G#4', 'A4'],
		['G3', 'A#3', 'C4', 'D4'],
	], 1))
	.pipe(yamaha())
	.pipe(new Out())
;

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
