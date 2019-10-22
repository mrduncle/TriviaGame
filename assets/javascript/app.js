//@ts-check


function getQuestions(response) {
    // $("#questions").text(JSON.stringify(response));
    
    $.each(response, function(i, qn) {
        console.log(qn[1])
        let attList = ["category", "question", "correct_answer", "incorrect_answers"];
        $.each(attList, function(j, attbt) {
            $("#questions").append("<p>" + attbt + ": " + qn[attbt] + "</p>");
        })
    })
}



let queryURL = "https://opentdb.com/api.php?amount=50";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    // console.log(response);
    getQuestions(response)
    
    
})