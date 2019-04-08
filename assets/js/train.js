// Initialize Firebase
var config = {
  apiKey: "AIzaSyAApeYS-kf4TvAYJFkvKT6FtHGdutpmio4",
  authDomain: "trainschedulemjcc.firebaseapp.com",
  databaseURL: "https://trainschedulemjcc.firebaseio.com",
  projectId: "trainschedulemjcc",
  storageBucket: "trainschedulemjcc.appspot.com",
  messagingSenderId: "720294003466"
};
firebase.initializeApp(config);
database = firebase.database();


//Initial variables
var traiName = "";
var trainDestination = "";
var trainTime = 0;
var trainFreq = 0;
var minArrival;
var nexTrain;
var uptime = 30;

//var m = moment(trainTime, "HH:mm");
//m.isValid(); // return false
$(document).ready(function () {
  //Capture button click
  $(".add-train").on("click", function (event) {
    event.preventDefault();
    //Get values from form boxes
    traiName = $("#train-name").val().trim();
    trainDestination = $("#train-destination").val().trim();
    trainTime = $("#train-time").val().trim();
    trainFreq = $("#train-frequency").val().trim();

    //Avoids empty formulary fields
    if (traiName == "" || trainDestination == "" || trainTime == "" || trainFreq == "") {
      alert("Please fill all the fields");
      //Avoids invalid First Time times
    } else if (moment(trainTime, "HH:mm").isValid() === false) {
      alert("Please insert a valid First Train Time (military time)");
    } else {
      database.ref().push({
        traiName: traiName,
        trainDestination: trainDestination,
        trainTime: trainTime,
        trainFreq: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      //Clear form
      $("form").trigger("reset");
    }
  }); //End of  click capture

  database.ref().on("child_added", function (snapshot) {

    //Time operations and conversion
    var firsTimeConv = moment(snapshot.val().trainTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    var diffTime = moment().diff(moment(firsTimeConv), "minutes");
    //Time apart
    var tRemainder = diffTime % snapshot.val().trainFreq;
    console.log(tRemainder);
    //Minutes until next Train
    var minNextArrival = snapshot.val().trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minNextArrival);
    var nextArrival = moment().add(minNextArrival, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));
    var key = snapshot.key;
    console.log(key);
    //End of momentjs

    //Add values to table
    var tr = $("<tr>");
    var train = "<td>" + snapshot.val().traiName + "</td>";
    var destination = "<td>" + snapshot.val().trainDestination + "</td>";
    var frequency = "<td class='text-center timeleft'>" + snapshot.val().trainFreq + "</td>";
    var minutes = "<td class='text-center nextarrival'>" + minNextArrival + "</td>";
    var timeArrival = "<td class='text-center timeArrival'>" + moment(nextArrival).format("HH:mm") + "</td>";
    var delBtn = "<td><button class='btn btn-danger del' key='" + key + "'>X</button></td>";
    $(".train-info").append(tr.append(train + destination + frequency + timeArrival + minutes + delBtn));


    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });//end of calling children in database

  timeRightNow();
}); //end of document ready

function timeRightNow() {
  var timeNow = moment().format("MMMM DD YYYY hh:mm A");
  $(".current-time").html(timeNow);
  setTimeout(timeRightNow, 1000);
};

//This deletes info from databse
$(document).on("click", ".del", function () {
  var keyRef = $(this).attr("key");
  firebase.database().ref().child(keyRef).remove().key;
  //window.location.reload();
  $(this).parents("tr").remove();
});


/*//////////////////////////////
Card class .train-control
TABLE CLASSES
table class .train-schedule
tbody class .train-info
submit class .add-train
-------------------------------
FORM CLASSES AND IDS
#train-name
#train-destination
#train-time
#train-frequency

.add-train
///////////////////////////////////*/