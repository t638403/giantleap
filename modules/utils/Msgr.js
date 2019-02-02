const isNumber = require('lodash/isNumber');
const isString = require('lodash/isString');

const noteOn = (channelNr, noteName_or_noteNr, velocity) => {
	const note_on = 143 + channelNr;
	const note_number = (typeof noteName_or_noteNr === 'string')?getNoteNumber(noteName_or_noteNr):noteName_or_noteNr;
	return [note_on, note_number, velocity];
};

const noteOff = (channelNr, noteName_or_noteNr, velocity) => {
	const note_off = 127 + channelNr;
	const note_number = (typeof noteName_or_noteNr === 'string')?getNoteNumber(noteName_or_noteNr):noteName_or_noteNr;
	return [note_off, note_number, velocity];
};

/**
 * Get a pitch bend message
 *
 * @param channelNr {number} 1-16
 * @param amount {number} 0-127
 * @returns {*[]}
 */
const pitchBend127 = (channelNr, amount) => {
	return pitchBend(channelNr, Math.round( (amount/127) * 16383));
};

/**
 * Get a pitch bend message
 *
 * @param channelNr {number} 1-16
 * @param amount {number} 0-16383
 * @returns {*[]} An array of messages
 */
const pitchBend = (channelNr, amount) => {
	amount = amount.toString(2);
	while(amount.length < 14) {
		amount = '0' + amount;
	}
	const msb = '0' + amount.substring(0, 7);
	const lsb = '0' + amount.substring(7, 14);
	const Bn = parseInt('0xE0', 16) + (channelNr - 1);
	return [Bn, parseInt(lsb, 2), parseInt(msb, 2)];
};

const ctrl = (channelNr, ctrl, value) => {
	if(!isNumber(ctrl) || ctrl < 0 || ctrl > 127) {throw new Error('Ctrl index out of bounds, must be 0-127')}
	if(!isNumber(value) || value < 0 || value > 127) {throw new Error('Ctrl value must be 0-127')}
	const Bn = parseInt('0xB0', 16) + (channelNr - 1);
	if(!isNumber(Bn) || Bn < 176 || Bn > 191) {throw new Error('Ctr Bn index out of bounds, must be 176-191');}
	return [Bn, ctrl, value];
};

/**
 * Send an NRPN (non registered param number). For electribe, dm is the value of the param.
 *
 * @param channelNr {number} midi channel number
 * @param nm {string|number} param msb
 * @param nl {string|number} param lsb
 * @param dm {string|number} value msb
 * @param dl {string|number} value lsb
 * @returns {array} An array of 4 messages
 */
const nrpn = (channelNr, nm, nl, dm, dl) => {
	const Bn = 175 + channelNr;
	const LSB = parseInt('0x62', 16);
	const MSB = parseInt('0x63', 16);
	const DataEntryMSB = parseInt('0x06', 16);
	const DataEntryLSB = parseInt('0x26', 16);

	return [
		[Bn, MSB, isString(nm)?parseInt(nm, 16):nm],
		[Bn, LSB, isString(nl)?parseInt(nl, 16):nl],
		[Bn, DataEntryMSB, isString(dm)?parseInt(dm, 16):dm],
		[Bn, DataEntryLSB, isString(dl)?parseInt(dl, 16):dl]
	];
};

const programChange = (channelNr, v) => {
	v = isString(v)?parseInt(v, 16):v;
	const Cn = parseInt('0xC0', 16) + (channelNr - 1);
	return [Cn, v];
};

const afterTouch = (channelNr, v) => {
	v = isString(v)?parseInt(v, 16):v;
	const Dn = parseInt('0xD0', 16) + (channelNr - 1);
	return [Dn, v];
};

const allSoundsOff = (channelNr) => {
	const Bn = parseInt('0xB0', 16) + (channelNr - 1);
	return [Bn, parseInt('0x78', 16), 0];
};

const allNotesOff = (channelNr) => {
	const Bn = parseInt('0xB0', 16) + (channelNr - 1);
	return [Bn, parseInt('0x7B', 16), 0];
};

const bankSelectMsb = (v) => {
	v = isString(v)?parseInt(v, 16):v;
	return ctrl(parseInt('0x00', 16), v);
};

const bankSelectLsb = (v) => {
	v = isString(v)?parseInt(v, 16):v;
	return ctrl(parseInt('0x20', 16), v);
};

/**
 * Midi clock message. Send 24 times every beat.
 *
 * @returns {number[]}
 */
const clock = () => {
	return [248];
};

/* HELPER FUNCTIONS */

/**
 * Convert a midi note nr to a human readable string. For example 34 -> A#2
 *
 * @param nr {int} The note number
 * @returns {string} The human readable string
 */
const noteNrToStr = (nr) => {

	const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	if(typeof nr !== 'number') throw new Error('input must be a number');
	if( !(nr > 20 && nr < 109) ) throw new Error('input should be 20 < nr < 109');

	const octave = Math.floor(nr/12);
	const key = (nr - (octave * 12));
	return keys[key] + (octave - 1);
};

/**
 * Convert a human readable note string to a midi note number. For example A#2 -> 34
 *
 * @param str {string} The human readable string
 * @returns {number} The midi note number
 */
const noteStrToNr = (str) => {

	const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	if(typeof str !== 'string') throw new Error('input must be a string');
	if(!/^[ABCDEFG](#|)\d$/.test(str)) {throw new Error('Invalid note string ' + str);}

	const key = str.replace(/\d$/, '');
	const nr = keys.indexOf(key);
	if(nr === -1) throw new Error('Invalid key ' + key);

	const octave = (parseInt(str.replace(/^.*?(\d)$/, '$1')) + 1);

	return ((octave * 12) + nr);

};

/**
 * Convert a human readable note string to a midi note number. For example A#2 -> 34
 *
 * @param nameAndOctave {string} The human readable string
 * @returns {*} The midi note number
 */
const getNoteNumber = (nameAndOctave) => {
	const names = {'C':12,'C#':13,'D':14,'D#':15,'E':16,'F':17,'F#':18,'G':19,'G#':20,'A':21,'A#':22,'B':23};
	const parts = nameAndOctave.toUpperCase().match(/^([CDEFGAB](|#))((|-)\d)$/);
	const name = parts[1];
	if(!(name in names)) {throw new Error(`Invalid note name '${nameAndOctave}'`);}
	const octave = parseInt(parts[3]);
	const noteNr = names[name] + (octave * 12);
	if(noteNr<0 || noteNr > 127) {throw new Error('Note nr out of bounds, must be 0-127')}
	return noteNr
};

/**
 * Check if a string/note nr is a black note.
 *
 * @param nr {string|nr} The note string/number for example either A#2 or 34
 * @returns {boolean} True if is a black note, false if not
 */
const isBlackNote = (nr) => {
	nr = isString(nr)?nr:noteNrToStr(nr);
	return /#/.test(nr)
};

module.exports = {
	noteOn,
	noteOff,
	ctrl,
	nrpn,
	programChange,
	bankSelectMsb,
	bankSelectLsb,
	pitchBend127,
	pitchBend,
	allNotesOff,
	allSoundsOff,
	afterTouch,
	clock,
	noteNrToStr,
	noteStrToNr,
	isBlackNote
};
