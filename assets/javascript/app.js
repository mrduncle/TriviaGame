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
    $(element).css("display", "block")
    setTimeout(function() {
        $(element).css("display", "none");
    }, delay);
}

function assessAnswer(usrResponse) {
    $("#question").css("display", "none");
        for (let i=0; i<4; i++) {
            if ($("#answer" + i).text() !== usrResponse) { //hide all buttons
                $("#answer" + i).css("display", "none")    //except the one
                                                           //nominated by the user
            }
        }
        usrResponse = usrResponse.trim();
        clearInterval(timerDisplay);
        if (usrResponse === arrData[1]) {
            correctAnswers++;
            // scoreAnnounce = "Your score for this game is " + correctAnswers + "/" + questionsAsked + ".";
            $("#response-correct").text("Correct!\r\n");
            displayTime("#response-correct", 5000);
        }
        else {
            incorrectAnswers++;
            $("#response-incorrect").text("Incorrect!\r\n\r\nThe correct answer was " + arrData[1] + ".\r\n" + scoreAnnounce + "\r\n\r\n");//display message showing the correct answer
            displayTime("#response-incorrect", 5000);
        }
        setTimeout(function() {
            nextQuestion();
        }, 5000);

}

$(".btn").on("click", function() {
    console.log($(this).attr("class"));
    if ($(this).attr("id") === "start") {  //hide the start button 
        $(this).css("display", "none");    
        getQuestionData(0);                //initiate the program
    }
    
    else if ($(this).attr("class").includes("answer")) {
        let userAnswer = $(this).text();
        assessAnswer(userAnswer);
    }
    else if ($(this).attr("id") === "again") {
        questionsAsked = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        $("#results").css("display", "none");
        $("#again").css("display", "none"); //hide the buttons
        $("#quit").css("display", "none");
        location.reload(true); //reload the window from the server
    }
    else {
        window.close();
    }
})
function startFinish() {


    //ask the user if they want to play again
    
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
function nextQuestion() {
    if (questionsAsked < 5) {
        // $(":input[type='radio']").each(function(){
        //     $(this).attr("checked", false);
        // })

        getQuestionData(questionsAsked);
    }
    else {
        let unAnswered = questionsAsked - (correctAnswers + incorrectAnswers);
        let resultText = "Correct Answers: " + correctAnswers + 
            "\r\nIncorrect Answers: " + incorrectAnswers + 
            "\r\nUnanswered: " + unAnswered;
        console.log(resultText);
        $("#result").text(resultText);
        $("#result").css("display", "block");
        $("#again").css("display", "block");
        $("#quit").css("display", "block");
    }
}

// $("document").on("click", "#submit-answer", answerCorrect);
// $("input[type='radio']").change(function() {
//     let userAnswer = $(this).attr("value").trim();
//     $("#question").css("display", "none");
//     // $("#answers").children.css("display","none");
//     // $("#answers").css("display", "none");
//     $(".answer").css("display", "none");
//     // $(".answer-radio").remove();
//     // $(".label-radio").remove();
//     clearInterval(timerDisplay);
//     if  (userAnswer === arrData[1]) {
//         //display message for correct answer
//         correctAnswers++;
//         scoreAnnounce = "Your score for this game is " + correctAnswers + "/" + questionsAsked + ".";
//         $("#response-correct").text("Correct!\r\n" + scoreAnnounce + "\r\n\r\n");
//         displayTime("#response-correct", 5000);
//     }
//     else {
//         $("#response-incorrect").text("Incorrect!\r\n\r\nThe correct answer was " + arrData[1] + ".\r\n" + scoreAnnounce + "\r\n\r\n");//display message showing the correct answer
//         displayTime("#response-incorrect", 5000);
//     }
//     console.log(this);
//     $(":input[type='radio']").prop("checked", false);
//     setTimeout(function() {
//         nextQuestion();
//     }, 5000);
// })

// display seconds remaining -works
function displayCount(qaData) {
    // call setInterval for the purpose of showing a countdown on screen -works
    timerDisplay = setInterval(function() {
        $("#countdown").text("Time remaining: " + timer + "s");
        console.log(timer);
        if (timer === 0) {
            clearInterval(timerDisplay);
            $("#response-timeout").text("Time is up!!\r\n\r\n The correct answer was " + convertSpecial(qaData[1]) + ".\r\nYour score for this game is " + correctAnswers + "/" + questionsAsked + ".\r\n\r\n");
            displayTime("#response-timeout", 5000);
            nextQuestion();
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
        .replace(/&quote/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&deg;/g, "deg")
        .replace(/&ndash;/g, "-")
        .replace(/&divide;/g, "/")
        .replace(/&eacute;/g, "e")
        .replace(/&iacute;/g, "i")
        .replace(/&uuml;/g, "u")
        .replace(/&ouml;/g, "o")
        .replace(/&rsquo;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"');
}

//displays the question and then the answers in a random order
function showQandA(qaData) {
    let cleanQuestion = convertSpecial(qaData[0]);
    $("#question").text(cleanQuestion);
    $("#question").css("display", "block");   //display the question
    $("#countdown").css("display", "block");  //display the countdown timer
    for (let i=0; i<qaData[3].length; i++) {
    // $.each(qaData[3], function(i, anAnswer){ 
        let cleanAnswer = convertSpecial(qaData[3][i]);
        // console.log(cleanAnswer)
        if (cleanAnswer !== "") {  //if an answer exists, display the buttons containing the answers
            $("#answer" + i).text(cleanAnswer);
            $("#answer" + i).css("display", "block")  //display each answer if it is not empty
        }
        else { //if an answer doesn't exist hide the button containing no information pertinent to the question
            $("#answer" + i).css("display", "none");
        }
    }
    // $("#answers").css("display", "block");
    displayCount(qaData);
}

function getQuestionData(j) {
    console.log(ajaxResponse);
    console.log(questionsAsked);
    
    let questionData = ajaxResponse.results[j];
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
                                                           //in a random location (0 to 3) to get all answers
    if (arrData[3].length < 4) {
        for (j=arrData[3].length; j=3; j++) {
            arrData[3].push("");
        }
    }
    // console.log(arrData);
    showQandA(arrData);
}

function startGame() {
    $("#start").css("display", "block");
}

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    ajaxResponse = response;
    startGame();
    // getQuestionData(0);
})

 
