function createBoxWorker(boxNumber, type)
{
    //create a webworker
    var boxWorker = new Worker("boxWorker.js");
    /*
        This is an easy addition to the asynchronicity aspect. We add a 
        "boxNumber" property to the helloWorker object so that it can be
        accessed when the worker posts a message, making sure that the
        same variables for other sibling webworkers do not get overwritten.

        This could just as easily be placed as a unique value of an array
        or JSON object, but it's a fun trick with WebWorkers.
    */

    $.extend(boxWorker, {'boxNumber': boxNumber});

    /*
        WebWorkers deal with the "event" message. The JavaScript event 
        'message' is used to communicate with a WebWorker, in both 
        directions. Assigning an onmessage event to the variable in the
        worker's "parent" script functions as a handler when the worker 
        calls postMessage.
    */
    boxWorker.onmessage = function(e){
        //put the data as the innerHTML of the specific box
        $($(".inner-square")[this.boxNumber - 1]).children(".box-text").html(e.data);
    };

    /*
        To communicate with the worker and to pass it information, send
        it an array of data. It needs to be an array/JSON object, but
        your custom onmessage listener inside the worker can handle it
        as you desire. This can be sent multiple times.
    */
    boxWorker.postMessage({'whatType': type, 'toWhom': boxNumber});
}

$(document).on('ready', function(){
    //a list of box numbers present on the page
    var boxNumArr = [1, 2, 3, 4];

    //make a modal
    createModal("body", "sendHelloModal", true, 
        "Send 'Hello, World!' to box:<br>"+
        createSelect('SendHello', boxNumArr, true), 
    "Send");

    //spawn the modal when the navbar dropdown item is clicked
    $("#sendHelloBar").on('click', function(){$('#sendHelloModal').modal();});

    $("#sendHelloModal-primary").on('click', function(){
        //close the dropdown
        $("#sendHelloModal-close").trigger('click');
        //grab the selected box number
        var boxNumber = $("#selectSendHello").find(":selected").text();
        createBoxWorker(boxNumber, "hello");

    });


    createModal("body", "calcFactModal", true, 
        "Do some pointless calculations with box:<br>"+
        createSelect('CalcFact', boxNumArr, true), 
    "Send");
    $("#calcFactBar").on('click', function(){$('#calcFactModal').modal();});
    
    $("#calcFactModal-primary").on('click', function(){
        $("#calcFactModal-close").trigger('click');
        var boxNumber = $("#selectCalcFact").find(":selected").text();
        createBoxWorker(boxNumber, "calc");
    });
});

/*
---------------------------- Bootstrap-bootstrapping functions follow ---------------------------- 
*/

/* 
    Shorthand function for creating a bootstrap modal.
    @param toAppendTo jQuery selector for an element to append the modal to.
    @param modalID String for a unique identifier for the modal
    @param small Boolean to determine whether or not it is a bootstrap modal-sm
    @param modalBody HTML string for the content of the modal
    @param primaryTitle [Optional] Text to put on the primary (not-"close") button at the bottom of the modal. Will only have a close button if not included.
*/
createModal = function(toAppendTo, modalID, small, modalBody, primaryTitle)
{
    var modalSize = small ? "modal-sm" : "modal-md";
    var primaryTitleString = primaryTitle ? '<button type="button" class="btn btn-primary" id="' + modalID + '-primary">' + primaryTitle + '</button>' : "";
    $(toAppendTo).append("<div id='" + modalID + "' class='modal fade' tabindex='-1'>" +
        '<div class="modal-dialog ' + modalSize + '">' +
            '<div class="modal-content">' +
                '<div class="modal-body">' +
                    modalBody +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default" id="' + modalID + '-close" data-dismiss="modal">Close</button>' +
                     primaryTitleString +
                '</div>' +
            '</div>' +
        '</div>');
};

/*
    Shorthand function for creating an HTML select object from the keys of a JSON object/values of an array.
    @param idAppend A string to append to the ID of the select object to make it unique.
    @param jsonObject Source for the select object.
    @param isArr [optional] Set to true if jsonObject is actually an array; will use values
*/
createSelect = function(idAppend, jsonObject, isArr)
{
    var retString = "<select id='select" + idAppend + "'>";

    for (curKeyIndex in jsonObject)
    {
        var curKey = (isArr ? jsonObject[curKeyIndex] : curKeyIndex);
        retString += "<option name='" + curKey + "'>" + curKey + "</option>";
    }

    return retString + "</select>";
};