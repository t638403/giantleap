const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),

	Note        = require('@giantleap/Note'),
	Chord       = require('@giantleap/Chord'),

	Ctrl        = require('@giantleap/Ctrl'),
	Nrpn        = require('@giantleap/Nrpn'),
	Value       = require('@giantleap/Value'),
	SampleRepeat       = require('@giantleap/SampleRepeat'),

	Clock       = require('@giantleap/Clock'),
	Device      = require('@giantleap/Device'),
	Instrument  = require('@giantleap/Instrument'),
	Electribe   = require('@giantleap/Electribe'),
	Uc33        = require('@giantleap/Uc33'),

	Stitch      = require('@giantleap/Stitch'),
	MidiMsgr    = require('@giantleap/MidiMsgr'),
	MidiOut     = require('@giantleap/MidiOut'),

	range       = require('@giantleap/utils/underdash/range')
;

/**
 * Make up a reg exp for selecting the right midi device. Midi devices are listed when running this file.
 *
 * @returns {Instrument}
 */
const ensoniq1   = () => new Instrument(/MIDIMATE II \d+:0/, 1);
const ensoniq2   = () => new Instrument(/MIDIMATE II \d+:0/, 2);
const ensoniq3   = () => new Instrument(/MIDIMATE II \d+:0/, 3);

const electribe  = () => new Electribe (/MIDIMATE II \d+:1/, 2);
const yamaha     = () => new Instrument(/MIDIMATE II \d+:1/, 3);

const arp        = () => new Instrument(/ARPODYSSEY-FS \d+:0/, 1);
const doepfer    = () => new Instrument(/USB Device 0x7cd:0xfe06 \d+:0/, 1);
const smplv1     = () => new Instrument(/samplv1 \d+:0/, 1);
const synthv1    = () => new Instrument(/synthv1 \d+:0/, 1);

const out = new MidiOut();

// Input devices
const uc33       = () => new Uc33(/UC-33 USB MIDI Controller \d+:0/);
const akai       = () => new Instrument(/Akai MPK25 \d+:1/, 1);

/**
 * Get midi clocks for all connected devices
 *
 * @param bpm {number} The BPM, say 120
 * @returns {Readable[]}
 */
const getMidiClocks = (bpm) => Object
	.values(MidiOut.availablePorts())
	.map(port => (new Metronome(bpm, 24))
		.pipe(new Clock())
		.pipe(new Device(port))
	)
;

const randSelect = (l, values) => {
	const selection = [];
	for(let i = 0; i < l; i++) {
		selection.push(values[Math.floor(Math.random() * values.length)]);
	}
	console.log(`[${selection.map(v => `'${v}'`).join(',')}]`);
	return selection;
};

// CLOCK ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const bpm = 120;
const m120 = () => new Metronome(bpm, 4);
const m80 = () => new Metronome(80, 4);
const m120_n = (n) => new Metronome(bpm, n);

// SONG ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const streams = [

	...getMidiClocks(bpm),

	m120()
		.pipe(new Pattern([
			'x'
		]))
		.pipe(new Note(Electribe.S1))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'x..x...x..x...x.'
		], {
			4: 'x..x...x..x...xx',
			8: 'xxx....xx.xx..xx',
			16:'.xx..x.x..x..x.x'
		}))
		.pipe(new Note(Electribe.S2))
		.pipe(electribe()),

	// m120()

	m120()
		.pipe(new Value(Value.rand(bpm, 1/4, 1/2, -0.1)))
		.pipe(new SampleRepeat(32))
		.pipe(new Nrpn(Electribe.nrpn('S1', 'Decay')))
		.pipe(electribe()),

	m120()
		.pipe(new Value(Value.saw(bpm, 1/3, 0.6, 0.1)))
		.pipe(new Nrpn(Electribe.nrpn('*', 'Delay Depth')))
		.pipe(electribe()),

	m120()
		.pipe(new Value(Value.cosine(bpm, 1/32, 1/8, 0.75)))
		.pipe(new SampleRepeat(32))
		.pipe(new Nrpn(Electribe.nrpn('S1', 'Mod Speed')))
		.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x..x....'
	// 	], {
	// 		4:'x..x..x.',
	// 		16:'xx.x..xx',
	// 		32:'x.x.x.x.'
	// 	}))
	// 	.pipe(new Note(Electribe.S1))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	], {
	// 		4:'....x..x',
	// 		16:'..x.xx.x'
	// 	}))
	// 	.pipe(new Note(Electribe.S2))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	], {
	// 		4:'....x.x.',
	// 		16:'.x..x...'
	// 	}))
	// 	.pipe(new Note(Electribe.CLAP))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x..x..xx..xx..xx'
	// 	], {
	// 		4:'xx.xx.xx..xx...x',
	// 		16:'xx.xx.xx..xxxxxx'
	// 	}))
	// 	.pipe(new Note(Electribe.HH_CLOSE))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Value('0000001000010001001110000001000000001001111010000000100000000011'))
	// 	.pipe(new Ctrl(21))
	// 	.pipe(doepfer()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x'
	// 	]))
	// 	.pipe(new Note([
	// 		'F#3','F#3','F#3','F#3','F#3','F#3','F#3','F#3','F#3','F#3',
	// 		'F#3','F#3','F#3','F#3','F#3','F#3',
	// 		'G3','G3','G3','G3','G3','G3','G3','G3',
	// 		'E3','E3','E3','E3','E3','E3','E3','E3',
	// 	]))
	// 	.pipe(arp()),
	
	// m120()
	// 	.pipe(new Pattern([
	// 		'x=x=xx=xx=xx=xx=x=x=xx=xx=xx=xxx'
	// 	]))
	// 	.pipe(new Note([
	// 		'F#3','F#4','F#3','F#4','F#3','F#4','F#3','F#4','F#3','F#4',
	// 		'G3','G4','G3','G4','E3','E4','G3','E4','E3','E4','E3'
	// 	]))
	// 	.pipe(arp()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S4))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note('C3'))
	// 	.pipe(arp()),

	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S2))
	// 	.pipe(electribe()),

	//
	// m120()
	// 	.pipe(new Value(Value.rand(bpm, 0.5, 0.8)))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Pitch')))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x.......'
	// 	]))
	// 	.pipe(new Note(Electribe.S2))
	// 	.pipe(electribe()),
	//
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'..x'
	// 	]))
	// 	.pipe(new Note(Electribe.S3))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Value(Value.rand(bpm, 1/16, 0.6)))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(new Nrpn(Electribe.nrpn('S3', 'Pitch')))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S4))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'..x...x.'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_CLOSE))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_OPEN))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note('C4'))
	// 	.pipe(doepfer()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'.......x========'
	// 	]))
	// 	.pipe(new Note([
	// 		'C4', 'D#3'
	// 	]))
	// 	.pipe(arp()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S1))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...',
	// 		'.x..x...',
	// 		'....x...',
	// 		'....x...',
	// 	]))
	// 	.pipe(new Note(Electribe.CLAP))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'..x.',
	// 		'..x.',
	// 		'..x.',
	// 		'..x.',
	// 		'..x.',
	// 		'..x.',
	// 		'..x.',
	// 		'..xx',
	// 	]))
	// 	.pipe(new Note(Electribe.HH_OPEN))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	]))
	// 	.pipe(new Note(Electribe.CLAP))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S2))
	// 	.pipe(electribe()),

	//

	//
	// m120()
	// 	.pipe(new Value(
	// 		'33888833888888335555333366666666'
	// 	))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(new Pattern([
	// 		'x.x...x.x.....x.x...x...x.......'
	// 	]))
	// 	.pipe(new Note(Electribe.S1))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x.......'
	// 	]))
	// 	.pipe(new Note(Electribe.S1))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_CLOSE))
	// 	.pipe(electribe()),


	// m120()
	// 	.pipe(new Pattern([
	// 		'x==============='
	// 	]))
	// 	.pipe(new Note([
	// 		'C4',
	// 		'A3',
	// 		'C5',
	// 		'A5'
	// 		]))
	// 	.pipe(doepfer()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note('C3'))
	// 	.pipe(doepfer()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'..x.'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_OPEN))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	]))
	// 	.pipe(new Note(Electribe.CLAP))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'.........x......',
	// 		'................'
	// 	]))
	// 	.pipe(new Note(Electribe.S3))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_CLOSE))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note('C2'))
	// 	.pipe(ensoniq1()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x..x..x.x..x..x.'
	// 	]))
	// 	// .pipe(new Value([0.2, 0.3, 0.5, 0]))
	// 	.pipe(new Note([
	// 		'G3', 'G3', 'D#3', 'D3', 'D3', 'D#3'
	// 	]))
	// 	.pipe(arp()),

	// m120()
	// 	.pipe(new Value(Value.randPat(bpm, 1/16, 0.25, 0.5)))
	// 	.pipe(new Nrpn(Electribe.nrpn('CLAP', 'Pitch')))
	// 	.pipe(new SampleRepeat(32))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'..x.'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_CLOSE))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	  ]))
	// 	.pipe(new Note('C3'))
	// 	.pipe(arp()),

	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'xx.xx.xx.x.x.x.xx.xx.xx.x.x.xxxx'
	// 	]))
	// 	.pipe(new Note([
	// 		'A#2',
	// 		'A#3',
	// 		'E2',
	// 		'E3',
	// 	]))
	// 	.pipe(yamaha()),

	// m120()
	// 	.pipe(new Value(Value.rand(bpm, 1/4, 1/8, 1/2)))
	// 	.pipe(new SampleRepeat(8))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Pitch')))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Note([
	// 		'C4', 'D4','D#4',
	// 		'C4', 'D4','D#4',
	// 		'C4', 'D4','D#4',
	// 		'C4', 'D4','D#4',
	// 		'C4', 'D4','D#4',
	// 		'C4', 'D4','D#4',
	// 		'C4', 'D4','D#4',
	// 		'C4', 'D4','D#4',
	// 		'F4', 'G4','G#4',
	// 		'F4', 'G4','G#4',
	// 		'F4', 'G4','G#4',
	// 		'F4', 'G4','G#4',
	// 		'F4', 'G4','G#4',
	// 		'F4', 'G4','G#4',
	// 		'F4', 'G4','G#4',
	// 		'F4', 'G4','G#4',
	// 	]))
	// 	.pipe(new Pattern([
	// 		'x.x......x.xx.x.',
	// 		'.....x.x.....x.x'
	//
	// 	]))
	// 	.pipe(arp()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x'
	// 	]))
	// 	.pipe(new Value(Value.randPat(bpm )))
	// 	.pipe(new Note('F3'))
	//
	// 	.pipe(ensoniq1()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'....',
	// 		'....',
	// 		'....',
	// 		'....',
	// 		'....',
	// 		'....',
	// 		'....',
	// 		'..x='
	// 	]))
	// 	.pipe(new Note('F#3'))
	// 	.pipe(ensoniq1()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x.x..x..'
	// 	]))
	// 	.pipe(new Note('C2'))
	// 	.pipe(ensoniq1()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'..x.'
	// 	]))
	// 	.pipe(new Note('G5'))
	// 	.pipe(ensoniq1()),


	// m120()
	// 	.pipe(new Pattern([
	// 		'x.....x=======..',
	// 		'x===..x======.x.'
	// 	]))
	// 	.pipe(new Value(Value.rand(bpm, 1/8, 0.7, 0.2)))
	// 	// .pipe(new Note(['G#2','G2','G#2','G#2','G2'], 1))
	// 	.pipe(new Note([
	// 		'F2', 'F#2',
	// 		'G2', 'G#2', 'G2',
	// 		'A2', 'A#2',
	// 		'D2', 'D#2', 'D2', 'D#2', 'D2',
	// 	]))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(arp()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S1))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'.x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S2))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Value(Value.ramp(bpm, 1/8, 1/2, 0)))
	// 	.pipe(new Nrpn(Electribe.nrpn('S2', 'Pitch')))
	// 	// .pipe(new SampleRepeat(32))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Value(Value.slope(bpm, 1/16, 1/2, 0)))
	// 	.pipe(new Nrpn(Electribe.nrpn('S2', 'Mod Depth')))
	//
	// 	// .pipe(new SampleRepeat(32))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'.x..............'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_CLOSE))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'..x.'
	// 	]))
	// 	.pipe(new Note(Electribe.HH_OPEN))
	// 	.pipe(electribe()),
	//
	//
	// m120()
	// 	.pipe(new Value(Value.randPat(bpm)))
	// 	.pipe(new Pattern([
	// 		'x'
	// 	]))
	// 	.pipe(new Note([].concat(
	// 		range(32 * 3).map(_ => 'F3'),
	// 		range(32 * 3).map(_ => 'D#3'),
	// 	), 1))
	// 	.pipe(doepfer()),
	//
	// m120()
	// 	.pipe(new Value(Value.randPat(bpm)))
	// 	.pipe(new Ctrl(21))
	// 	.pipe(doepfer()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'..x..'
	// 	]))
	// 	.pipe(new Value(Value.rand(bpm, 1/8, 0.7, 0.2)))
	// 	// .pipe(new Note(['G#2','G2','G#2','G#2','G2'], 1))
	// 	.pipe(new Note('D6'))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(yamaha()),


	// m120()
	// 	.pipe(new Value(Value.sine(bpm, 1/8, 0.5, 0.1)))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Mod Depth')))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Value(Value.sine(bpm, 1/8, 0.5, 0.1)))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Mod Depth')))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x..x..x...x..x...x.x..x.x.x.x...'
	// 	]))
	// 	.pipe(new Note(Electribe.S1))
	// 	.pipe(electribe()),

	// m120()
	// 	.pipe(new Value(Value.rand(bpm, 1/8, 1/2, 0.3)))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Mod Depth')))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Value(Value.rand(bpm, 1/8, 1/8, 0.7)))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Mod Speed')))
	// 	.pipe(new SampleRepeat(8))
	// 	.pipe(electribe()),
	//

	//
	// m120()
	// 	.pipe(new Value(Value.rand(bpm, 1/3, 1/8, 0.20)))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Pitch')))
	// 	.pipe(new SampleRepeat(16))
	// 	.pipe(electribe()),

];

/**
 * All streams get stitched together here into one single (transform) stream and then sent to the MidiMsgr which in turn
 * converts the message into a real midi message that can be sent using the npm module `midi`.
 *
 * Finally the MidiOut write stream measures the time and sends a MIDI message if the time is right.
 */
(new Stitch(streams))
	.pipe(new MidiMsgr())
	.pipe(out)
;
