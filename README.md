# Giant Leap
![mertonome-event-midi-device](./explanation.png)

*- A step sequencer built on [streams](https://nodejs.org/docs/latest-v11.x/api/stream.html).*

# General concept
Like the header image. There exists a `Metronome` being a readable stream. It generates objects with a time
property consistent with the supplied beats per minute, say 120.

Several transform streams can be applied to extend the message with extra properties, like note information, e.g. a C#
with a length of 5 seconds.

Finally the properties are transformed to a message that can streamed to the final write stream `MidiOut` which wraps
the npm module node-midi really and keeps track of messages and if it is time to play them.

So to sum up, messages are basic js objects. The `Metronome` creates messages and ads a time property. Any following
transform streams add on to this object. Finally it written by `MidiOut` to `/dev/midi` somehow via `node-midi/RtMidi`.

When I mension a *message* I refer to a message it is really a plain old js object.

Warning: Do **NOT** reuse any instantiated streams like the metronome. Just instantiate another one if you need it.

# Getting started

Dependencies:

- Linux
- Node 11.9 or higher
- [node-midi](https://github.com/justinlatimer/node-midi) / [RtMidi](https://github.com/thestk/rtmidi)

```
$ git clone git@github.com:t638403/giantleap.git
$ cd giantleap
$ npm install
$ touch myFirstSong.js
```
A symlink `@giantleap` is created in `node_modules`, so the modules from this project can be referenced this way.

Open `myFirstSong.js` in an editor.

### 1. Create a metronome
```
const Metronome = require('@giantleap/Metronome');
const metronome = new Metronome(120, 4);
```

### 2. Create a pattern
```
const Pattern = require('@giantleap/Pattern');
cont pattern = new Pattern([
	'x...x...x...x...x...x...x...x...',
	'x...x...x.......x...x...x.......',
	'x.x.x.x.x...x...x.x.x.x.x...x...',
	'x...x...x.......x...x...x.......'
]);
```

### 2. Create some notes
Add notes in an array, and it will play the round
```
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
```
### 3. Find out midi devices
If you have no midi hardware you can still download dozens of virtual devices like [synthv1](https://synthv1.sourceforge.io/).
Once installed run `synthv1` and run the following js lines. Do not forget to connect the plugin to your sound cards
output. I use [Patchage](https://drobilla.net/software/patchage) to do so.
```
const MidiOut = require('@giantleap/MidiOut');
MidiOut.displayAvailablePorts();
```
You'll see something like this. 
```
0: Midi Through 14:0
1: synthv1 129:0
```

### 4. Create an instrument
An instrument adds two keys to the message, device and midi channel.
```
const midiChannel = 1;
const deviceName = /synthv1 \d+:0/;
const Instrument = require('@giantleap/Instrument');
const synthv1 = new Instrument(deviceName, midiChannel);
``` 
Note 1: I use a short reg exp notation to select the device, since numbers seem to change.
Note 2: ALSA makes sensible device names like Jack does not.
Note 3: You can compile node-midi for jack by changing the binding.gyp file in the npm package. You'll find 
`__LINUX_ALSA__` somewhere. Change it to `	__UNIX_JACK__` or [rfm](https://www.music.mcgill.ca/~gary/rtmidi/#compiling). 

### 5. Stitch together
```
const MidiMsgr = require('@giantleap/MidiMsgr');
metronome
	.pipe(pattern)
	.pipe(notes)
	.pipe(synthv1)
	.pipe(new MidiMsgr())
	.pipe(new MidiOut())
;
```
