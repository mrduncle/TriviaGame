//@ts-check

let timer = 29;
let timerDisplay;
let arrData = [];
let numQuestions = 5;
let questionsAsked = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

let queryURL = "https://opentdb.com/api.php?amount=" + numQuestions;

function randomNum() {
    //find a random number between 0 and 3 which determines the position
    //that the correct answer will be inserted into the incorrect answers
    //array to yield an all answers array
    let randNo = Math.floor(Math.random() * (4))
    return randNo;
}

//ensures that there are no repeats in the random order array randOrder
// function randomQuestOrder(randOrder,index) {
//     let orderVal = randomNum();
//     while (randOrder.includes(orderVal)) {
//         orderVal = randomNum();
//     }
//     randOrder[index] = orderVal;
//     console.log(randOrder)
//     return randOrder;
// }

//displays the question and then the answers in a random order
function showQuestions(qaData) {
    $("#question").text(qaData[0]);
    $.each(qaData[3], function(i, anAnswer){
        $("#answer" + i).attr("value", anAnswer);
    })
    // $.each(randOrder, function(index, value) {
    //     randomQuestOrder(randOrder, index);
    // })
    // console.log(randOrder);
}

function getQuestionData(response) {
    // for (let j = 0; j < numQuestions; j++) {  //repeat for the number of questions the user wishes to answer
        questionsAsked++;
        let questionData = response.results[0]; //change back to j
        let attList = ["question", "correct_answer", "incorrect_answers"]
        arrData = [];
        //loop through the list of attributes that are contained in response.results[j]
        $.each(attList, function(i, attbt) { 
            arrData[i] = questionData[attbt];
        })
        arrData[3] = arrData[2].slice(0); //make a copy of arrData[2] (incorrect_answers)
        let randInsert = randomNum();  
        arrData[3].splice(randInsert, 0, (arrData[1].trim())); //add the correct answer to incorrect_answers
                                                               // in a random location (0 to 3) to get all answers
        console.log(arrData);
        showQuestions(arrData);
    // }
}

function answerCorrect() {
    let userAnswer = $(this).attr("value");
    if userAnswer.trim() === arrData[1].trim() {
        $("#response-correct").text("Correct! Your score for this game is " + correctAnswers + "/" + questionsAsked + "." );
        //display message for correct answer
        correctAnswers++;

    }
    else {
        $("#response-incorrect").text("Incorrect! You score for this game is " + correctAnswers + "/" questionsAsked + ".");//display message showing the correct answer
        incorrectAnswers++;
    }
}


$(document).on("click", "#submit-answer", answerCorrect);

//display seconds remaining -works
// function displayCount() {
//     $("#countdown").text(timer + "s");
//     console.log(timer);
//     if (timer === 0) {
//         clearInterval(timerDisplay);
//         timer = 29;
//     }
//     timer--;
// }



$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    getQuestionData(response);    
})

//call setInterval for the purpose of showing a countdown on screen -works
// timerDisplay = setInterval(displayCount, 1000); 
