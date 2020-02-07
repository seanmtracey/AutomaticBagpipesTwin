// Description of ABC file format can be found at
// https://abcnotation.com/blog/2010/01/31/how-to-understand-abc-the-basics/

const fs = require('fs');

const ABC_FILE = fs.readFileSync(`${__dirname}/flower_of_scotland.abc`, 'utf8').split('\n');

console.log(ABC_FILE);

const file_description = {};

file_description.title = ABC_FILE[1].replace('T:', '');
file_description.tune_type = ABC_FILE[2].replace('R:', '');

console.log(file_description);