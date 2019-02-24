/***********************************************************************************************************************
 * GIANT LEAP - A step sequencer built on streams
 *
 * General concept:
 *
 * There exists a `Metronome` being a readable stream. It generates objects with a time
 * property consistent with the supplied beats per minute, say 120.
 *
 * Several transform streams can be applied to extend the message with extra properties, like note information, e.g. a C#
 * with a length of 5 seconds.
 *
 * Finally the properties are transformed to a message that can streamed to the final write stream `MidiOut` which wraps
 * the npm module node-midi really and keeps track of messages and if it is time to play them.
 *
 * So to sum up, messages are basic js objects. The `Metronome` creates messages and ads a time property. Any following
 * transform streams add on to this object. Finally its written by `MidiOut` to `/dev/midi` somehow via `node-midi/RtMidi`.
 *
 * When I mention a *message* I refer to a the plain old js object representing the message.
 *
 * Warning: Do **NOT** reuse any instantiated streams like the metronome. Just instantiate another one if you need it. The
 * reason for this is that stream handlers communicate to each other. You don't want to mess with this communication.
 **********************************************************************************************************************/

/***********************************************************************************************************************
 * 1. Create a metronome
 **********************************************************************************************************************/
const Metronome = require('@giantleap/Metronome');
const metronome = new Metronome(120, 4);

/***********************************************************************************************************************
 * 1. Create a pattern
 **********************************************************************************************************************/
const Pattern = require('@giantleap/Pattern');
const pattern = new Pattern([
	'x=..x=..x=..x=..x=..x=..x=..x=..',
	'x=..x=..x===....x=..x=..x===....',
	'x=x=x=x=x=..x=..x=x=x=x=x=..x=..',
	'x=..x=..x===....x=..x=..x===....'
]);

/***********************************************************************************************************************
 * 2. Create some notes
 **********************************************************************************************************************/
const Note = require('@giantleap/Note');
const notes = new Note([
	'C3','D3','E3','C3',
	'C3','D3','E3','C3',
	'E3','F3','G3',
	'E3','F3','G3',
	'G3','A3','G3','F3','E3','C3',
	'G3','A3','G3','F3','E3','C3',
	'C3','G2','C3',
	'C3','G2','C3',
]);

/***********************************************************************************************************************
 * 4. Create an instrument
 **********************************************************************************************************************/
const midiChannel = 1;
const deviceName = /synthv1 \d+:0/;
const Instrument = require('@giantleap/Instrument');
const synthv1 = new Instrument(deviceName, midiChannel);

/***********************************************************************************************************************
 * 5. Stitch together
 **********************************************************************************************************************/
const MidiMsgr = require('@giantleap/MidiMsgr');
const MidiOut = require('@giantleap/MidiOut');
metronome
	.pipe(pattern)
	.pipe(notes)
	.pipe(synthv1)
	.pipe(new MidiMsgr())
	.pipe(new MidiOut())
;
