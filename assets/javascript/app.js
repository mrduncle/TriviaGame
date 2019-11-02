//@ts-check

let timer = 29;
let ajaxResponse = {};
let timerDisplay;
let arrData = [];
let numQuestions = 5;
let questionsAsked = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let scoreAnnounce = '';

let queryURL = "https://opentdb.com/api.php?amount=" + numQuestions;


function randomNum() {
    //find a random number between 0 and 3 which determines the position
    //that the correct answer will be inserted into the incorrect answers
    //array to yield an all answers array
    let randNo = Math.floor(Math.random() * (4));
    return randNo;
}

function displayTime(element, delay) {
    setTimeout(function() { $(element).css("display", "block") }, delay);
    $(element).css("display", "none");
    if (questionsAsked < 5) {

    }
}

// function answerCorrect() {
//     let userAnswer = $(this).attr("value");
//     if  (!userAnswer.trim().localCompare(arrData[1].trim())) {
//         $("#response-correct").text("Correct! Your score for this game is " + correctAnswers + "/" + questionsAsked + "." );
//         displayTime("#response-correct", 5000);

//     }
//     else {
//         $("#response-incorrect").text("Incorrect! You score for this game is " + correctAnswers + "/" + questionsAsked + ".");//display message showing the correct answer
//         displayTime("#response-incorrect", 5000);
//     }
// }


// $("document").on("click", "#submit-answer", answerCorrect);
$("input[type='radio']").change(function() {
    let userAnswer = $(this).attr("value").trim();
    clearInterval(timerDisplay);
    if  (userAnswer === arrData[1]) {
        //display message for correct answer
        correctAnswers++;
        $("#response-correct").text("Correct!\r\n" + scoreAnnounce);
        displayTime("#response-correct", 5000);
    }
    else {
        $("#response-incorrect").text("Incorrect!\r\n\r\nThe correct answer was " + arrData[1] + ".\r\nYour score for this game is " + correctAnswers + "/" + questionsAsked + ".\r\n\r\n");//display message showing the correct answer
        displayTime("#response-incorrect", 5000);
    }
})

// display seconds remaining -works
function displayCount(qaData) {
    // call setInterval for the purpose of showing a countdown on screen -works
    timerDisplay = setInterval(function() {
        $("#countdown").text(timer + "s");
        console.log(timer);
        if (timer === 0) {
            clearInterval(timerDisplay);
            $("#response-timeout").text("Time is up!!\r\n\r\n The correct answer was " + qaData[1] + ".\r\nYour score for this game is " + correctAnswers + "/" + questionsAsked + ".\r\n\r\n");
            displayTime("#response-timeout", 5000);
        }
        else {
            timer--;
        }
    }, 1000);
    timer = 29;
}

//converts special characters to their normal appearance
function convertSpecial(qnText){
    return qnText
        // /something/g replaces something globally in the string (ie many times)
        .replace(/&amp;/g, "&")
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&deg;/g, "deg")
        .replace(/&ndash;/g, "-")
        .replace(/&eacute;/g, "")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"');
}

//displays the question and then the answers in a random order
function showQandA(qaData) {
    let cleanQuestion = convertSpecial(qaData[0]);
    $("#question").text(cleanQuestion);
    $.each(qaData[3], function(i, anAnswer){ 
        let cleanAnswer = convertSpecial(" " + anAnswer);
        // console.log(cleanAnswer)
        if (cleanAnswer !== "") {  //if an answer exists, display the radio button and label
            $("#answer" + i).css("display", "block");
            $("#answer" + i).attr("value", cleanAnswer);
            $("#answer" + i).text(cleanAnswer);
            $("#label" + i).text(cleanAnswer);
        }
        else { //if an answer doesn't exist hide the radio button and label
            $("#answer" + i).css("display", "none");
        }
    })
    displayCount(qaData);
}

function getQuestionData(response, j) {
    console.log(response);
    console.log(questionsAsked);
    let questionData = response.results[j]; //change back to j
    questionsAsked++;
    let attList = ["question", "correct_answer", "incorrect_answers"];
    arrData = [];
    //assign all of the required attributes to arrData[] 
    $.each(attList, function(i, attbt) { 
        arrData[i] = questionData[attbt];
        // console.log(arrData[i]);
    })
    arrData[3] = arrData[2].slice(0); //make a copy of arrData[2] (incorrect_answers)
    let randInsert = randomNum();  
    arrData[3].splice(randInsert, 0, (arrData[1].trim())); //add the correct answer to incorrect_answers
                                                            // in a random location (0 to 3) to get all answers
    // console.log(arrData);
    return arrData
}

function trafficCtrl(response){
    arrData = getQuestionData(response, 0);
    showQandA(arrData);
    if (questionsAsked === 5) {
        correctAnswers = 0;
        questionsAsked = 0;
    }

    //ask the user if they want to play again
    $("#again").css("display", "block");
    $("#quit").css("display", "block");
}

scoreAnnounce = "Your score for this game is " + correctAnswers + "/" + questionsAsked + ".";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    let ajaxResponse = response
    trafficCtrl(ajaxResponse);    
})

 
