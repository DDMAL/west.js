/*
    This code runs automatically once the file is loaded as a worker.
    Keep in mind that jQuery ($) and document are not accessible here.
*/
console.log("helloWorld.js has been loaded!");

/*
    Add an onmessage event listener to receive information sent via
    postMessage from the parent, and have it call functions or code 
    contained within the worker.
*/
this.onmessage = function(event){
    sayHello(event.data);
};

/*
    Running the postMessage function here will return this value to 
    the onMessage listener you declared in the parent script.
*/
function sayHello(toWhom) {
    postMessage("This is box number " + toWhom + " saying hello, world!");
}