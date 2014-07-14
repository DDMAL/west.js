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
        if(e.data.whatType == "append")
        {
            //put the data as the innerHTML of the specific box
            $($(".inner-square")[this.boxNumber - 1]).children(".box-text").append(e.data.content);
        }
        else if(e.data.whatType == "replace")
        {
            //put the data as the innerHTML of the specific box
            $($(".inner-square")[this.boxNumber - 1]).children(".box-text").html(e.data.content);
        }
    };

    /*
        To communicate with the worker and to pass it information, send
        it an array of data. It needs to be an array/JSON object, but
        your custom onmessage listener inside the worker can handle it
        as you desire. This can be sent multiple times.
    */
    boxWorker.postMessage({'whatType': type, 'toWhom': boxNumber});
}

function clearAllBoxes()
{
    var i = 4;

    while (i--)
    {
        createBoxWorker(i, 'clear');
    }
}

$(document).on('ready', function(){
    //a list of box numbers present on the page
    var boxNumArr = [1, 2, 3, 4];

    //make a modal
    createModal("body", "sendHelloModal", true, 
        "Send 'Hello, World!' to box:<br><div id='sendHelloSelects'>" +
        createSelect('SendHello', boxNumArr, true) +
        "</div><button id='sendHelloSelectAdd'>Add another</button>", 
    "Send");

    $("#sendHelloSelectAdd").on('click', function(){
        $("#sendHelloSelects").append("<br>" + createSelect('SendHello', boxNumArr, true));
    });

    //spawn the modal when the navbar dropdown item is clicked
    $("#sendHelloBar").on('click', function(){$('#sendHelloModal').modal();});

    $("#sendHelloModal-primary").on('click', function(){
        //close the dropdown
        $("#sendHelloModal-close").trigger('click');
        //grab the selected box number(s)
        var selectLength = $(".selectSendHello").length;
        var toSendArr = [];
        while(selectLength--)
        {
            var newNum = $($(".selectSendHello")[selectLength]).find(":selected").text();
            if(toSendArr.indexOf(newNum) === -1)
            {
                toSendArr.push(newNum);
            }
        }
        var boxNumber = $(".selectSendHello").find(":selected").text();

        var toSendLength = toSendArr.length;

    /*
        To subscribe a worker to an event, call mei.Events.subscribe('eventTopic', callback, [arguments])
        (See mei.js/mei.js for details)
    */
        while(toSendLength--)
        { 
            mei.Events.subscribe('HelloEvent', createBoxWorker, [toSendArr[toSendLength], 'hello']);
        }

    /*
        Trigger an event using mei.Events.publish('eventTopic')
    */
        mei.Events.publish('HelloEvent');

        $("#sendHelloSelects").html(createSelect('SendHello', boxNumArr, true));
    });

    createModal("body", "calcFactModal", true, 
        "Do some pointless calculations with box:<br><div id='calcFactSelects'>" +
        createSelect('CalcFact', boxNumArr, true) +
        "</div><button id='calcFactSelectAdd'>Add another</button>", 
    "Send");

    $("#calcFactSelectAdd").on('click', function(){
        $("#calcFactSelects").append("<br>" + createSelect('CalcFact', boxNumArr, true));
    });

    $("#calcFactBar").on('click', function(){$('#calcFactModal').modal();});
    
    $("#calcFactModal-primary").on('click', function(){        //close the dropdown
        $("#calcFactModal-close").trigger('click');
        //grab the selected box number
        var selectLength = $(".selectCalcFact").length;
        var toSendArr = [];
        while(selectLength--)
        {
            var newNum = $($(".selectCalcFact")[selectLength]).find(":selected").text();
            if(toSendArr.indexOf(newNum) === -1)
            {
                toSendArr.push(newNum);
            }
        }
        var boxNumber = $(".selectCalcFact").find(":selected").text();

        var toSendLength = toSendArr.length;
        while(toSendLength--)
        { 
            mei.Events.subscribe('CalculateEvent', createBoxWorker, [toSendArr[toSendLength], 'calc']);
        }

        mei.Events.publish('CalculateEvent');

        $("#calcFactSelects").html(createSelect('CalcFact', boxNumArr, true));
    });

    //Clear all boxes
    mei.Events.subscribe('ClearButtonDidActivate', clearAllBoxes);

    $("#clearBoxesBar").on('click', function()
                         {
                             mei.Events.publish('ClearButtonDidActivate');
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
    var retString = "<select class='select" + idAppend + "'>";

    for (curKeyIndex in jsonObject)
    {
        var curKey = (isArr ? jsonObject[curKeyIndex] : curKeyIndex);
        retString += "<option name='" + curKey + "'>" + curKey + "</option>";
    }

    return retString + "</select>";
};