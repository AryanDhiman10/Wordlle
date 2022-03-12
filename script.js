let solutionWord;

//Fetching random 6 letter word
const getWordle = () =>{
    fetch('http://localhost:3000/word')
        .then( res => res.json())
        .then( json => {
            solutionWord = json.toUpperCase();
        })
        .catch(err => console.log(err));
}
getWordle();


const lettersPattern = /^[A-Za-z][A-Za-z0-9]*$/;
let currentGuessCount = 1;
let currentGuess = document.querySelector('#guess' + currentGuessCount);


// Keyboard layout Prerequisites
const keyboard = document.querySelector('.keyboard');
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Enter',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'Backspace',
]

// Keyboard layout and Updating on pressing a key on virtual keyboard
keys.forEach( key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => keyEntered(key))
    keyboard.append(buttonElement)
})

// Updating on pressing a key on keyboard
document.addEventListener('keydown', e => keyEntered(e.key));

// Main function
const keyEntered = (keypress) => {
    if(currentGuessCount < 8){
        if(
            keypress.length == 1 && 
            lettersPattern.test(keypress) && 
            currentGuess.dataset.letters.length < 6 
        ){  
            updateLetters(keypress);    
        }
        else if(keypress == 'Backspace' &&
                currentGuess.dataset.letters != ''
        ){
            deleteFromLetters();
        }
        else if(keypress == 'Enter' &&
                currentGuess.dataset.letters.length == 6
        ){
            for(let i=0; i<6; i++){
                setTimeout(() => {
                    revealTile(checkLetter(i), i);
                    if(i==5){
                        checkWin();
                    }
                }, 250*i);
            }
        }
    }
}

// Is Game Won
const checkWin = () => {
    if(solutionWord == currentGuess.dataset.letters.toUpperCase()){
        document.querySelector('.popup').classList.add('result');
        document.querySelector('.popup').innerText = 'HURRAY, YOU WON!';
    }
    else {
        currentGuessCount++;
        currentGuess = document.querySelector('#guess' + currentGuessCount);
        if(currentGuessCount > 7){
            document.querySelector('.popup').classList.add('result');
            document.querySelector('.popup').innerText = 'GAME OVER';
        }
    }
}

// Update letters
const updateLetters = (letter) => {
    let oldLetters = currentGuess.dataset.letters;
    let newLetters = oldLetters + letter;
    let currentTile = newLetters.length;
    currentGuess.dataset.letters = newLetters;

    updateTiles(currentTile, letter);
}

// Update tile 
const updateTiles = (tileNumber, letter) => {
    let currentTile = document.querySelector('#guess' + currentGuessCount + 'tile' + tileNumber);
    currentTile.innerText = letter;
    currentTile.classList.add('has-letter');
}

// Backspace -- Removing last letter
const deleteFromLetters = () => {
    let oldLetters = currentGuess.dataset.letters;
    let newLetters = oldLetters.slice(0, -1);
    currentGuess.dataset.letters = newLetters;
    deleteFromTiles(oldLetters.length);
}

// Backspace -- Empty tile
const deleteFromTiles = (tileNumber) => {
    document.querySelector('#guess' + currentGuessCount + 'tile' + tileNumber).innerText = '';
    document.querySelector('#guess' + currentGuessCount + 'tile' + tileNumber).classList.remove('has-letter');
}

// Check letter to solution
const checkLetter = (pos) => {
    let guessedLetter = currentGuess.dataset.letters.charAt(pos).toUpperCase();
    let solutionLetter = solutionWord.charAt(pos);
    
    if(guessedLetter == solutionLetter) {
        return 'correct';
    }
    else {
        return checkLetterExists(guessedLetter) ? 'present' : 'absent' ;
    }
}

// Is letter in the the solutionWord
const checkLetterExists = (letter) => {
    return solutionWord.includes(letter);
}

// Update tiles styles according to state
const revealTile = (status, i) => {
    let tileNumber = i+1;
    let tile = document.querySelector('#guess' + currentGuessCount + 'tile' + tileNumber)
    if(status == 'correct'){
        tile.classList.add('correct');
    }
    else if(status == 'present'){
        tile.classList.add('present');
    }
    else if(status == 'absent'){
        tile.classList.add('absent');
    }

    tile.classList.add('flip');
}