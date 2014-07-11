$("#debug").html("calcFact.js has been loaded!");
this.addEventListener('message', function(event){
    calcFact(event.data);
}, false);

function calcFact(toWhom) {
    var SIZE = 1000000;
    var iteration = 100;

    postMessage(["I am box number " + toWhom + " and I am starting some rather pointless calculations."]);
    
    for (var i = 0; i < iteration; i++)
    {
        if((i % 10 === 0) && (i > 0))
        {
            postMessage("I have finished " + i + " rounds of pointless calculations.");
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
    postMessage("I have completely finished my pointless calculations.");
}