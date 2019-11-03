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

function displayTime(element, delay, answerButton) {
    $(element).css("display", "block")
    setTimeout(function() {
        $(element).css("display", "none");
    }, delay);
    //reinstate the functioanlity of the previously disabled answer button
    //$("#answer" + answerButton).removeClass("disabled")
    $("body").css("pointer-events", "auto");
}

function assessAnswer(usrResponse) {
    $("#question").css("display", "none");
    let answerButton;
        for (let i=0; i<4; i++) {
            if ($("#answer" + i).text() !== usrResponse) { //hide all buttons
                $("#answer" + i).css("display", "none")    //except the one
            }                                              //nominated by the user  
            else {
                $("body").css("pointer-events", "none");
                //$("#answer" + i).addClass("disabled"); //disable the answer button temporarily                                                              //so that it can't be clicked while the 
                answerButton = i;                      //answer response is being displayed
            }
        }
        usrResponse = usrResponse.trim();
        clearInterval(timerDisplay);
        if (usrResponse === arrData[1]) {
            correctAnswers++;
            $("#response-correct").text("Correct!\r\n");
            displayTime("#response-correct", 3000, answerButton);
        }
        else {
            incorrectAnswers++;
            $("#response-incorrect").text("Incorrect!\r\n\r\nThe correct answer was " + arrData[1] + ".\r\n" + scoreAnnounce + "\r\n\r\n");//display message showing the correct answer
            displayTime("#response-incorrect", 3000, answerButton);
        }
        setTimeout(function() {
            nextQuestion(answerButton);
        }, 3000);

}

$(".btn").on("click", function() {
    console.log($(this).attr("class"));    
    if ($(this).attr("id") === "start") {  //if the start button was clicked 
        $(this).css("display", "none");    //hide the start button
        getQuestionData(0);                //initiate the program
    }
    else if ($(this).attr("class").includes("answer")) {  //if an answer button was clicked
        let userAnswer = $(this).text();
        assessAnswer(userAnswer);
    }
    else if ($(this).attr("id") === "again") {  //if the user opted to replay the game again
        questionsAsked = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        $("#results").css("display", "none");
        $("#again").css("display", "none"); //hide the buttons
        $("#quit").css("display", "none");
        location.reload(true); //reload the window from the server
    }
    else if ((this).attr("class").includes("quit")) {  //if the user opted to quit the game
        window.close();
    }
})

function nextQuestion(buttonHide) {
    if (questionsAsked < numQuestions) {  //game continues with the next question
        getQuestionData(questionsAsked);
    }
    else {  //when the game has ended
        $("#answer" + buttonHide).css("display", "none");
        $("#countdown").css("display", "none");
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
        .replace(/&quote;/g, '"')
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
})

 
