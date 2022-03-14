const buttonStart = document.getElementById('button-start');
const sectionQuestion = document.getElementById('section-questions');
const sectionLanding = document.getElementById('section-landing');
const sectionTimer = document.getElementById('section-timer');
const sectionInitials = document.getElementById('section-initials');
const spanHighScore = document.getElementById('span-final-highscore');
const spanTime = document.getElementById('span-time');
const questionTitle = document.getElementById('question-title');
const questionChoices = document.getElementById('question-choices');
const questionFeedback = document.getElementById('questions-feedback');
const formHighscore = document.getElementById('form-highscore');
const inputInitials = document.getElementById('input-initials');
const sectionHighscore = document.getElementById('section-highscore');
const buttonPlayAgain = document.getElementById('button-play-again');
const ButtonClearHighscores = document.getElementById('button-clear-highscores');
const ListHighScores = document.getElementById('list-high-scores');

let timeRemaining = 60;
let timerId = " ";

let currentQuestionIndex = 0;

spanTime.textContent = timeRemaining

// When user clicks 'start' btn

buttonStart.addEventListener('click', function (event) {
    // Show the questions
    sectionQuestion.classList.remove('hide')

    // Hide the landing page
    sectionLanding.classList.add('hide')


    //start timer
    startTimer();

    showQuestion(0);

});


function showFeedback(message, timeout = 2000) {

    //remove hide class on feedback for x seconds
    questionFeedback.textContent = message;
    questionFeedback.classList.remove('hide')

    setTimeout(function() {
        questionFeedback.classList.add('hide')
    },timeout)

}

//timer
//update the span-time for every passing second

function startTimer() {
    //show section - timer
    sectionTimer.classList.remove('hide')

    //update the span-time for every passing second
    timerId = setInterval(function () {
        timeRemaining = timeRemaining - 1
        spanTime.textContent = timeRemaining

        //if timer at 0
        //what if user clicks nothing and timer expires?
        //endgame

        if (timeRemaining <= 0) {
            //endgame
            endGame();
        }


    }, 1000);
};



function showQuestion(index) {
    const question = questions[index]

    questionTitle.textContent = question.title;

    //loop through the choice

    //generate li for each q

    questionChoices.textContent = " ";

    for (let ii = 0; ii < question.choices.length; ii++) {
        const choice = question.choices[ii];

        const li = document.createElement('li');

        const button = document.createElement('button');
        button.textContent = choice.title;
        button.classList.add('btn-outline-primary', 'mt-1', 'mb-1')
        button.setAttribute('data-answer', choice.isAns);


        //when click on the choice
        //should move on to the next question



        button.addEventListener('click', function (event) {
            //what if user clicks correct choice?
            //give feedback to say it's correct
            const isCorrectChoice = event.target.getAttribute('data-answer') === 'true';
            console.log(typeof isCorrectChoice);

            if (isCorrectChoice) {
                showFeedback('correct!!')
            }
            //what if user clicks incorrect choice?
            //give feedback to say it's incorrect
            //reduce remaining time by 10 seconds
            else {
                showFeedback('Wrong!! 5 seconds removed')
                timeRemaining = timeRemaining - 5;
            }




            //when user clicks final choice on final question
            //end game
            if (index + 1 >= questions.length - 1) {
                // reached the final question
                return endGame()
            }

            showQuestion(index + 1);
        });

        li.appendChild(button);

        questionChoices.appendChild(li)
    }
}


// question
//title -- string
//choices
//title
//is answer or not






//end game



//end game
function endGame() {
    //1 timer should stop counting
    clearInterval(timerId)
    //2 show the endgame screen
    sectionInitials.classList.remove('hide')

    // hide question
    sectionQuestion.classList.add('hide')

    sectionTimer.classList.add('hide');

    //3 show the highscores
    //highscores can be number of correct or time remaining
    spanHighScore.textContent = timeRemaining
}


//play again button

//end game screen
//1user can type in input box
//do nothing

formHighscore.addEventListener('submit', function (event) {
    event.preventDefault();

    //2user can hit enter in input box
    //submit
    //user can hit xubmit button
    //submit

    //submitting is to add the user initials and highscore to the local storage
    const userInput = inputInitials.value;

    const highscore = {
        name: userInput,
        highscore: timeRemaining,
    }

    const existingHighscores = getHighscoresFromLocalStorage();

    // add in the new hs
    existingHighscores.push(highscore)


    // resave to localstorage
    localStorage.setItem('highscores', JSON.stringify(existingHighscores));


    //after submit, redirect the user to the highscore page


    showHighscorePage()

});



/**
 * 
 * @returns {Array}
 */

function getHighscoresFromLocalStorage() {
    return JSON.parse(localStorage.getItem('highscores') || '[]');

}


function showHighscorePage() {
    // hide the endgame page
    sectionInitials.classList.add('hide');


    //show the highscore section
    sectionHighscore.classList.remove('hide');

    renderHighscoreList();
}


function renderHighscoreList() {
    //hs page
    
    // get all existing hs from local storage
    const highscores = getHighscoresFromLocalStorage();

    highscores.sort(function(a, b){
        
        if(b.highscore > a.highscore){
            return 1;
        }else{
            return -1;
        }

    })
    
    ListHighScores.textContent = " "
    
    //create a li on each item
    for (let iii = 0; iii < highscores.length; iii++){
        const highscore = highscores[iii];
        //add it to the list
        
        const li = document.createElement('li');
        
        li.textContent = highscore.name + ' -- ' + highscore.highscore;
        
        ListHighScores.appendChild(li);
    };
};



//1 click on the play again button

buttonPlayAgain.addEventListener('click', function (event) {
    window.location.reload();
})

//redirect user to the landing page
//2 click on the clear button
ButtonClearHighscores.addEventListener('click', function (event) {
    //clear the local storage and empty highscores list
    localStorage.setItem('highscores', "[]");

    ListHighScores.textContent = " ";
})