const midi = require('midi');

// Set up a new output.
const output = new midi.output();

// Count the available output ports.
const ports = output.getPortCount();


const allNotesOff = (channelNr) => {
	const Bn = parseInt('0xB0', 16) + (channelNr - 1);
	return [Bn, parseInt('0x7B', 16), 0];
};

for(let p=0; p<ports; p++) {
	console.log(output.getPortName(p));
	output.openPort(0);
	for(let c=1; c<=16; c++) {
		output.sendMessage(allNotesOff(c))
	}
	output.closePort();
}

