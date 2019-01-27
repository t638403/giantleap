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

const sendMidiClock = (bpm) => Object
	.values(MidiOut.availablePorts())
	.forEach(port => (new Metronome(bpm, 24))
		.pipe(new Clock())
		.pipe(new Device(port))
		.pipe(new Out())
	)
;

module.exports = (song) => song({
		ensoniq,
		evolver,
		electribe,
		yamaha,
		arp,
		doepfer
	}, {
		Metronome,
		Pattern,
		Velocity,
		Note,
		Value,
		Nrpn,
		Chord,
		Clock,
		Device,
		Instrument,
		Electribe,
		Out,
		MidiOut,
		JSON,
		RingBuffer,
		sendMidiClock
	})
;