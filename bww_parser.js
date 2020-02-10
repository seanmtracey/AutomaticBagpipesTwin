const fs = require('fs');
// Load the demo file
const BWW_FILE = fs.readFileSync(`${__dirname}/scotland_the_brave.bww`, 'utf8');

// Get the half of the document that describes the tune
const header_section = BWW_FILE.slice( 0, BWW_FILE.indexOf('&') );

// Then parse the header the get the tune details
const parsed_header = header_section.split('\n').filter(line => {
    let shouldKeep = true;

    if(line === ''){
        shouldKeep = false;
    }

    if(line.indexOf('MIDI') > -1){
        shouldKeep = false;
    }

    if(line.indexOf('FrequencyMappings') > -1){
        shouldKeep = false;
    }

    if(line.indexOf('InstrumentMappings') > -1){
        shouldKeep = false;
    }

    if(line.indexOf('GracenoteDurations') > -1){
        shouldKeep = false;
    }

    if(line.indexOf('FontSizes') > -1){
        shouldKeep = false;
    }

    if(line.indexOf('TuneTempo') > -1){
        shouldKeep = false;
    }

    if(line.indexOf('TuneFormat') > -1){
        shouldKeep = false;
    }

    return shouldKeep;

});

console.log(parsed_header);

// And create a human readable object with those details
const tune_details = {};

parsed_header.forEach( (line, idx) => {
    const lineHalves = line.slice(',')
    const info  = lineHalves[0].replace(/"| '/g, '');

    if(idx === 0){
        tune_details.editor = info;
    }

});

console.log(tune_details);

// Get the half of the file that contains the music data
const notes_section = BWW_FILE.slice( BWW_FILE.indexOf('&') )

// Parse the notes section of the document to get only the notes and
// the movements for the piece.
const parsed_notes = notes_section
    .replace(/[\t | \n | \' ]/g, ' ')
    .split(' ')
    .filter(line => {
        return line !== '' && line !== '&' && line !== '!';
    })    
;

// console.log(parsed_notes);
