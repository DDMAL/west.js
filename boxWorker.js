/*
    This code runs automatically once the file is loaded as a worker.
    Keep in mind that jQuery ($) and document are not accessible here.
*/
console.log("A box has been loaded!");

/*
    Add an onmessage event listener to receive information sent via
    postMessage from the parent, and have it call functions or code 
    contained within the worker.
*/
this.onmessage = function(event){
    switch(event.data.whatType){
        case "hello":
            sayHello(event.data.toWhom);
            break;

        case "calc":
            calcPointless(event.data.toWhom);
            break;

        default:
            postMessage({'whatType': 'append', 'content':"I didn't understand that, sorry."});
            break;
    }
};

/*
    Running the postMessage function here will return this value to 
    the onMessage listener you declared in the parent script. 
    This does need to be an array and can be send multiple times.
*/
function sayHello(toWhom) {
    postMessage({'whatType': 'replace', 'content': "This is box number " + toWhom + " saying hello, world!"});
}

function calcPointless(toWhom) {
    var SIZE = 1000000;
    var iteration = 100;

    postMessage({'whatType': 'replace', 'content': "I am box number " + toWhom + " and I am starting some rather pointless calculations."});
    
    for (var i = 0; i < iteration; i++)
    {
        if((i % 10 === 0) && (i > 0))
        {
            postMessage({'whatType': 'append', 'content': " " + i + " rounds done."});
        }

        var a = new Array(SIZE);
        var b = new Array(SIZE);
        var c = new Array(SIZE);


        for (var k = 0; k < SIZE; k++) { 
            a[i] = Math.random();   
            b[i] = Math.random();   
        }
        for (var j = 0; j < SIZE; j++)
        {
            c[j] = Math.cos(a[j]);
        }
    }
    postMessage({'whatType': 'replace', 'content':"I have completely finished my pointless calculations."});
}