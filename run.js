const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Value       = require('@giantleap/Value'),
	Nrpn        = require('@giantleap/Nrpn'),
	Chord       = require('@giantleap/Chord'),
	Clock       = require('@giantleap/Clock'),
	Device      = require('@giantleap/Device'),
	Instrument  = require('@giantleap/Instrument'),
	Electribe   = require('@giantleap/Electribe'),
	Out         = require('@giantleap/Out'),
	MidiOut     = require('@giantleap/MidiOut'),
	JSON        = require('@giantleap/JSON'),
	RingBuffer  = require('@giantleap/utils/RingBuffer')
;

const ensoniq   = () => new Instrument('MIDIMATE II 16:0', 1);

const evolver   = () => new Instrument('MIDIMATE II 16:1', 2);
const electribe = () => new Electribe ('MIDIMATE II 16:1', 2);
const yamaha    = () => new Instrument('MIDIMATE II 16:1', 3);

const arp       = () => new Instrument('ARPODYSSEY-FS 32:0', 1);
const doepfer   = () => new Instrument('USB Device 0x7cd:0xfe06 36:0', 1);

const bpm = 120;
const m120 = () => new Metronome(bpm, 4);
const m120_n = (n) => new Metronome(bpm, n);

const midiClock = availablePorts => availablePorts
	.forEach(port => (new Metronome(bpm, 24))
		.pipe(new Clock())
		.pipe(new Device(port))
		.pipe(new Out())
	)
;
midiClock(Object.values(MidiOut.availablePorts()));

m120()
	.pipe(new Pattern([
		'x==============.'
	]))
	.pipe(new Chord([
		['C3', 'D#3', 'G3'],
		// ['C3', 'D#3', 'G3'],
		// ['C3', 'D#3', 'G3'],
		// ['D3', 'F3', 'A3'],
		// ['C3', 'D#3', 'G3'],
		// ['C3', 'D#3', 'G3'],
		// ['C3', 'D#3', 'G3'],
		// ['A#2', 'D3', 'F3'],
	], 1))
	// .pipe(new Note('C3', 1))
	.pipe(yamaha())
	.pipe(new Out())
;

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

//
m120()
	.pipe(new Pattern('..x.'))
	.pipe(new Note('F#3'))
	.pipe(ensoniq())
	.pipe(new Out())
;
// m120()
// 	.pipe(new Pattern([
// 		'....x.......x...',
// 		'....x....x..x...',
// 		'....x.......x...',
// 		'....x.......x..x'
//
// 	]))
// 	.pipe(new Note(Electribe.S2))
// 	.pipe(electribe())
// 	.pipe(new Out())
// ;

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
