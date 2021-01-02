const isNumber = require('@giantleap/utils/underdash/isNumber');
const isString = require('@giantleap/utils/underdash/isString');
/**
 * Implementation of MIDI protocol
 * https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
 */

const helperFns = {

  /**
   * Receive a midi msg in decimal array form, e.g. [143, 12, 123] and find out what message it is.
   *
   * @param {array} a The midi message
   * @returns {Msg} The midi message
   */
  parse: (a) => {
    if(a[0] >= parseInt('0xB0', 16) && a[0] < parseInt('0xB0', 16) + 16) {
      return {
        type:'ctrl',
        channel: a[0] - parseInt('0xB0', 16) + 1,
        ctrl:a[1],
        value:a[2]
      };
    } else if(a[0] >= 144 && a[0] < 144 + 16) {
      return {
        type:'noteon',
        channel: a[0] - 144 + 1,
        note:a[1],
        velocity:a[2]
      }
    } else if(a[0] >= 128 && a[0] < 128 + 16) {
      return {
        type:'noteoff',
        channel: a[0] - 128 + 1,
        note:a[1],
        velocity:a[2]
      }
    }else {
      throw 'Could not determine midi msg type';
    }
  },

  /**
   * Convert a midi note nr to a human readable string. For example 34 -> A#2
   *
   * @param nr {int} The note number
   * @returns {string} The human readable string
   */
  noteNrToStr: (nr) => {

    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    if(typeof nr !== 'number') throw new Error('input must be a number');
    if( !(nr > 20 && nr < 109) ) throw new Error('input should be 20 < nr < 109');

    const octave = Math.floor(nr/12);
    const key = (nr - (octave * 12));
    return keys[key] + (octave - 1);
  },

  /**
   * Convert a human readable note string to a midi note number. For example A#2 -> 34
   *
   * @param str {string} The human readable string
   * @returns {number} The midi note number
   */
  noteStrToNr: (str) => {

    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    if(typeof str !== 'string') throw new Error('input must be a string');
    if(!/^[ABCDEFG](#|)\d$/.test(str)) {throw new Error('Invalid note string ' + str);}

    const key = str.replace(/\d$/, '');
    const nr = keys.indexOf(key);
    if(nr === -1) throw new Error('Invalid key ' + key);

    const octave = (parseInt(str.replace(/^.*?(\d)$/, '$1')) + 1);

    return ((octave * 12) + nr);
  },

  /**
   * Convert a human readable note string to a midi note number. For example A#2 -> 34
   *
   * @param nameAndOctave {string} The human readable string
   * @returns {*} The midi note number
   */
  getNoteNumber: (nameAndOctave) => {
    const names = {'C':12,'C#':13,'D':14,'D#':15,'E':16,'F':17,'F#':18,'G':19,'G#':20,'A':21,'A#':22,'B':23};
    const parts = nameAndOctave.toUpperCase().match(/^([CDEFGAB](|#))((|-)\d)$/);
    const name = parts[1];
    if(!(name in names)) {throw new Error(`Invalid note name '${nameAndOctave}'`);}
    const octave = parseInt(parts[3]);
    const noteNr = names[name] + (octave * 12);
    if(noteNr<0 || noteNr > 127) {throw new Error('Note nr out of bounds, must be 0-127')}
    return noteNr
  },

  /**
   * Check if a string/note nr is a black note.
   *
   * @param nr {string|nr} The note string/number for example either A#2 or 34
   * @returns {boolean} True if is a black note, false if not
   */
  isBlackNote: (nr) => {
    nr = isString(nr)?nr:noteNrToStr(nr);
    return /#/.test(nr)
  }
}

const channelVoiceMsgs = {
  noteOff: (channelNr, noteName_or_noteNr, velocity) => {
    const note_off = parseInt('10000000', 2) + (channelNr - 1);
    const note_number = (typeof noteName_or_noteNr === 'string')?helperFns.getNoteNumber(noteName_or_noteNr):noteName_or_noteNr;
    return [note_off, note_number, velocity];
  },
  noteOn: (channelNr, noteName_or_noteNr, velocity) => {
    const note_on = parseInt('10010000', 2) + (channelNr - 1);
    const note_number = (typeof noteName_or_noteNr === 'string')?helperFns.getNoteNumber(noteName_or_noteNr):noteName_or_noteNr;
    return [note_on, note_number, velocity];
  },
  afterTouch: (channelNr, noteName_or_noteNr, velocity) => {
    velocity = isString(velocity)?parseInt(velocity, 16):velocity;
    const Dn = parseInt('10100000', 2) + (channelNr - 1);
    const note_number = (typeof noteName_or_noteNr === 'string')?helperFns.getNoteNumber(noteName_or_noteNr):noteName_or_noteNr;
    return [Dn, note_number, velocity];
  },
  ctrl: (channelNr, ctrl_number, value) => {
    if(!isNumber(ctrl_number) || ctrl_number < 0 || ctrl_number > 127) {throw new Error('Ctrl index out of bounds, must be 0-127')}
    if(!isNumber(value) || value < 0 || value > 127) {throw new Error('Ctrl value must be 0-127')}
    const Bn = parseInt('0xB0', 16) + (channelNr - 1);
    if(!isNumber(Bn) || Bn < 176 || Bn > 191) {throw new Error('Ctr Bn index out of bounds, must be 176-191');}
    return [Bn, ctrl_number, value];
  },
  programChange: (channelNr, program_number) => {
    program_number = isString(program_number)?parseInt(program_number, 16):program_number;
    const Cn = parseInt('0xC0', 16) + (channelNr - 1);
    return [Cn, program_number];
  },
  channelPressure: (channelNr, value) => {
    if(!isNumber(value) || value < 0 || value > 127) {throw new Error('Ctrl value must be 0-127')}
    const channel_pressure = parseInt('11010000', 2) + (channelNr - 1);
    return [channel_pressure, value]
  },
  pitchBend: (channelNr, amount) => {
    amount = amount.toString(2);
    while(amount.length < 14) {
      amount = '0' + amount;
    }
    const msb = '0' + amount.substring(0, 7);
    const lsb = '0' + amount.substring(7, 14);
    const Bn = parseInt('0xE0', 16) + (channelNr - 1);
    return [Bn, parseInt(lsb, 2), parseInt(msb, 2)];
  },
  pitchBend127: (channelNr, amount) => {
    return channelVoiceMsgs.pitchBend(channelNr, Math.round( (amount/127) * 16383));
  },
  bankSelectLsb:  (v) => {
    v = isString(v)?parseInt(v, 16):v;
    return channelVoiceMsgs.ctrl(parseInt('0x00', 16), v);
  },
  bankSelectMsb: (v) => {
    v = isString(v)?parseInt(v, 16):v;
    return channelVoiceMsgs.ctrl(parseInt('0x20', 16), v);
  },
}

const channelModeMsgs = {
  allSoundsOff: (channelNr) => {
    const Bn = parseInt('0xB0', 16) + (channelNr - 1);
    return [Bn, parseInt('0x78', 16), 0];
  },
  resetAllControllers: (channelNr) => {
    const Bn = parseInt('0xB0', 16) + (channelNr - 1);
    return [Bn, 121, 0];
  },
  localCtrl: (onOrOff) => {
    const Bn = parseInt('0xB0', 16) + (channelNr - 1);
    return [Bn, 122, onOrOff ? 127: 0];
  },
  allNotesOff: (channelNr) => {
    const Bn = parseInt('0xB0', 16) + (channelNr - 1);
    return [Bn, parseInt('0x7B', 16), 0];
  },

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
  nrpn:  (channelNr, nm, nl, dm, dl) => {
    const Bn = parseInt('10110000', 2) + (channelNr - 1);
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
  },
};

const systemCommonMsgs = {
  systemExclusive: () => {
    const Bn = parseInt('11110000', 2);
    throw new Error('Not implemented');
  },
  midiTimeCodeQuarterFrame: (msgType, values) => {
    const Bn = parseInt('11110001', 2);
    throw new Error('Not implemented');
  },
  songPositionPointer: (song) => {
    const Bn = parseInt('11110010', 2);
    throw new Error('Not implemented');
  },
  songSelect: (value) => {
    const Bn = parseInt('11110011', 2);
    if(!isNumber(value) || value < 0 || value > 127) {throw new Error('Ctrl value must be 0-127')}
    return [Bn, value];
  },
  tuneRequest: () => [parseInt('11110110', 2)],
  endOfExclusive: () => [parseInt('11110111', 2)]
};

const systemRealTimeMsgs = {
  clock:          () => ([parseInt('11111000', 2)]),
  start:          () => console.log('Sending start') || ([parseInt('11111010', 2)]),
  continue:       () => ([parseInt('11111011', 2)]),
  stop:           () => console.log('Sending stop') || ([parseInt('11111100', 2)]),
  activeSensing:  () => ([parseInt('11111110', 2)]),
  reset:          () => ([parseInt('11111111', 2)]),
}

module.exports = {
	...channelVoiceMsgs,
  ...channelModeMsgs,
  ...systemCommonMsgs,
  ...systemRealTimeMsgs,
	...helperFns,
};
