const fs = require('fs');
// Load the demo file
const BWW_FILE = fs.readFileSync(`${__dirname}/scotland_the_brave.bww`, 'utf8');

// Get the half of the document that describes the tune
const header_section = BWW_FILE.slice( 0, BWW_FILE.indexOf('&') );

console.log(header_section);

// Then parse the header the get the tune details
const parsed_header = header_section.split(/[\n\r]+/).filter(line => {
    let shouldKeep = true;

    console.log(line);

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
    const lineHalves = line.split(',(')
    const description = lineHalves[1];
    const info  = lineHalves[0].replace(/"| '/g, '');

    if(idx === 0){
        tune_details.editor = info;
    }

    if(!description){
        return;
    }

    if(description[0] !== ''){

        if(description[0] === "T"){
            tune_details.title = info;
        }
    
        if(description[0] === "Y"){
            tune_details.type = info;
        }
    
        if(description[0] === "M"){
            tune_details.composer = info;
        }

    }

});

console.log(tune_details);

// Get the half of the file that contains the music data
const notes_section = BWW_FILE.slice( BWW_FILE.indexOf('&') )

console.log(notes_section);

// Parse the notes section of the document to get only the notes and
// the movements for the piece.
const parsed_notes = notes_section
    .replace(/[\t | \n | \' | \r ]/g, ' ')
    .split(' ')
    .filter(line => {
        return line !== '' && line !== '&' && line !== '!' && line.indexOf('sharp') < 0;
    })    
;

console.log(parsed_notes);
