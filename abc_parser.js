// Description of ABC file format can be found at
// https://abcnotation.com/blog/2010/01/31/how-to-understand-abc-the-basics/

const fs = require('fs');
// Load the demo file
const ABC_FILE = fs.readFileSync(`${__dirname}/flower_of_scotland.abc`, 'utf8');

// Create an object that contains the parse data from our ABC file
const file_description = {};
file_description.notes = "";
file_description.parsed_notes = [];

// Get the details from the header of the files, and separate out the notes info.
ABC_FILE.split('\n').forEach(line => {

    // Fields in the header (everything up to K:) will be a single letter, followed by 
    // a ':'. We only care about a couple of these for my uses, so we'll just get those
    const KEY = line[0];
    const DATA = line.split(':')[1];

    // console.log(KEY);

    if(KEY === "T"){
        file_description.title = DATA;
    }

    if(KEY === "R"){
        file_description.song_type = DATA;
    }

    if(KEY === "L"){
        file_description.note_length = DATA;
    }

    if(KEY === "C"){
        file_description.composer = DATA;
    }

    // If there's no ':', we'll assume that the rest of the data is musical notes.
    // In the future, we may want to split on the K field, as it signifies the start
    // of the music, but I'm not going to do that for now.
    if(line[1] !== ':'){
        console.log(line);
        file_description.notes += line;
    }

});

// Finally, we remove the characters from the notes that are used to describe layout
// leaving us only with the notes and grace notes.

console.log('Original notes:', file_description.notes);

file_description.notes = file_description.notes.replace(/[\ | \| | \] | \- | \\ ]/g, '');

// Next, we'll work through the notes charachters one letter at a time to figure out
// how long each note should last, and where the grace notes are. We'll then put these
// into an array with some extra info that should make it easier to create playback.

console.log(file_description.notes);

let notesChecked = 0;

console.log(file_description.notes);

while(notesChecked < file_description.notes.length){

    let currentCharacterOrCharacters = file_description.notes[notesChecked];
    const nextCharacter = file_description.notes[notesChecked + 1]

    // console.log(currentCharacterOrCharacters);

    if( Number(nextCharacter) > 0 ){
        // If we have a note followed by a number, the file is telling us how long
        // to play that note for (relative to the note length set in the header), so
        // we'll add the note + the next note to the list    
        currentCharacterOrCharacters += file_description.notes[notesChecked + 1];
        notesChecked += currentCharacterOrCharacters.length;
        file_description.parsed_notes.push(currentCharacterOrCharacters);
    } else if(nextCharacter ===  '{'){
        // If we have a '{' as the next character, it means we have a series of grace notes that we need to group
        // so we'll add this note and work through the grace notes in the next loop  
        file_description.parsed_notes.push(currentCharacterOrCharacters);
        notesChecked += 1;
    } else if(currentCharacterOrCharacters === '{'){
        // If we have a '{' as the current character, it means we've got a bunch of 
        // grace notes we need to group together. To that end, we create a new loop
        // which will search through the rest of the notes until it finds a closing
        // '}', at which point they'll all be added to the list of parsed notes.
        currentCharacterOrCharacters = '';

        let foundEndOfGraceNoteDeclaration = false;
        let charactersSearched = 0;

        while(!foundEndOfGraceNoteDeclaration){

            if(file_description.notes[notesChecked + charactersSearched] !== '}'){
                currentCharacterOrCharacters += file_description.notes[notesChecked + charactersSearched]
                charactersSearched += 1;
            } else {
                currentCharacterOrCharacters += '}';
                foundEndOfGraceNoteDeclaration = true;
            }

        }

        file_description.parsed_notes.push(currentCharacterOrCharacters);

        notesChecked += charactersSearched + 1;

    } else {

        file_description.parsed_notes.push(currentCharacterOrCharacters);
        notesChecked += 1;
    }



    // console.log(file_description.notes);
    // console.log(file_description.parsed_notes);

}

console.log(file_description.notes);
console.log(file_description.parsed_notes);

console.log(file_description);