/*---------------------------------------------------------------------------*/

const execSync = require('child_process').execSync;
const fs = require('fs');

/*---------------------------------------------------------------------------*/
log = function(msg) { process.stdout.write(`${new Date().toString()} - ${msg}\n`); }
/*---------------------------------------------------------------------------*/
function _sql(stmt) {
    return execSync(`sqlite3 puzzles.sqlite '${stmt}'`).toString();
}
/*---------------------------------------------------------------------------*/
function loadBible() {
    var sqlLine = _sql('select * from puzzles where id=5');
    // log(`sqlLine=${sqlLine}`);
    var arr = sqlLine.split('|');
    // log(JSON.stringify(arr));
    var puzzle = { id: arr[0], name: arr[2], description: arr[1] };

    sqlLine = _sql('select word from puzzlewords where puzzleid=5 order by word');
    // log(`sqlLine=${sqlLine}`);
    var words = sqlLine.split('\n').filter(v => v).map((v) => { return { word: v}; });
    // log(JSON.stringify(words));

    puzzle.puzzleWords = words;
    // log(JSON.stringify(puzzle));

    return puzzle;
}
/*---------------------------------------------------------------------------*/
function loadPuzzles(filename) {
    var data = fs.readFileSync(filename);
    var rc = JSON.parse(data);
    return rc;
}
/*---------------------------------------------------------------------------*/
function rename(filename) {
    fs.renameSync(filename, `${filename}-bak`);
}
/*---------------------------------------------------------------------------*/
function write(filename, puzzles) {
    fs.writeFileSync(filename, JSON.stringify(puzzles, null, '\t'));
}
/*---------------------------------------------------------------------------*/
/* M  A  I  N    P  R  O  G  R  A  M                                         */
/*---------------------------------------------------------------------------*/

var filename = 'puzzles-all.json';

var puzzles = loadPuzzles(filename);
// log(JSON.stringify(puzzles));

var bible = loadBible();
puzzles.push(bible);
// log(JSON.stringify(puzzles));

rename(filename);
write(filename, puzzles);

/*---------------------------------------------------------------------------*/
