
$(document).ready(function() {

    
    var config = {
        apiKey: "AIzaSyBA9aMvPQ6pxeyEC4nS2WPR9rR2FxhEqYI",
        authDomain: "trainscheduler-7ef88.firebaseapp.com",
        databaseURL: "https://trainscheduler-7ef88.firebaseio.com",
        storageBucket: "trainscheduler-7ef88.appspot.com",
        messagingSenderId: "502300233400"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

   
    $('#submit-train').on('click', function() {

        
        var trainName = $('#train-name').val().trim();
        var destination = $('#destination-name').val().trim();
        var frequency = $('#frequency').val().trim();
        var hour = $('#first-train-time-hour');
        var minute = $('#first-train-time-minute');
        var hourValue = hour.val().trim();
        var minuteValue = minute.val().trim();
        var hourMinute = hourValue + ":" + minuteValue;
        var firstTrain = moment(hourMinute, 'HH:mm').subtract(1, 'years').unix();


        
        database.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            startTime: firstTrain,
        });

        
        $('.new-train-input').val('');

        
        return false;
    });

    
    function render() {
        
        var rows = $('<div>');
        
        for (var i = 0; i < trains.length; i++) {
     
            var train = trains[i];
            
            var row = $('<tr>');
            
            
            $(row).append($('<td>').text(train.trainName));
            $(row).append($('<td>').text(train.destination));
            $(row).append($('<td>').text(train.frequency));

            
            var timeDifference = moment().diff(moment.unix(train.startTime), 'minutes');
            
            var minutesAway = train.frequency - (timeDifference % train.frequency);
            
            var nextTrain = moment().add(minutesAway, 'minutes').format('HH:mm');
            
            $(row).append($('<td>').text(nextTrain));
            $(row).append($('<td>').text(minutesAway));
            
            rows.append(row);

        }
       
        $('#table-body').empty().append(rows.children());

    }
     
    setInterval(render, 1000 * 60);

    
    var trains = [];

    
    database.ref().on('child_added', function(childSnapshot) {
            
            var childValue = childSnapshot.val();
            
            trains.push(childValue);
            
            render();

            
        },

        function(errorObject) {});
    // }

});
