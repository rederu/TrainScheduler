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

//var valid= moment(trainTime, "HH:mm", true).isValid();
//$('#train-time').numeric(':');
var m = moment(trainTime, "HH:mm");
m.isValid(); // return false
//Capture button click

$(document).ready(function () {

  $(".add-train").on("click", function (event) {
    event.preventDefault();
    //Grab values from form boxes
    traiName = $("#train-name").val().trim();
    trainDestination = $("#train-destination").val().trim();
    trainTime = $("#train-time").val().trim();
    trainFreq = $("#train-frequency").val().trim();
    if (traiName == "" || trainDestination == "" || trainTime == "" || trainFreq == "") {
      alert("Please fill all the fields");
    } else if (moment(trainTime, "HH:mm").isValid() === false) {
      alert("Please insert a valid First Train Time (military time)")
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
    //console.log(snapshot.val());
    //console.log(snapshot.val().traiName);
    //console.log(snapshot.val().trainDestination);
    //console.log(snapshot.val().trainTime);
    //console.log(snapshot.val().trainFreq);
    //Momentjs
    //////////////////////////////////////
    var firsTimeConv = moment(trainTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    //Difference between the times
    var diffTime = moment().diff(moment(firsTimeConv), "minutes");
    //Time apart
    var tRemainder = diffTime % snapshot.val().trainFreq;
    console.log(tRemainder);
    //Minutes until next Train
    var minNextArrival = snapshot.val().trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minNextArrival);
    var nextArrival = moment().add(minNextArrival, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));
    //////////////////////////////////////

    var tr = $("<tr>");
    var train = "<td>" + snapshot.val().traiName + "</td>";
    var destination = "<td>" + snapshot.val().trainDestination + "</td>";
    var frequency = "<td>" + snapshot.val().trainFreq + "</td>";
    var minutes = "<td>" + minNextArrival + "</td>";
    var timeArrival = "<td>" + moment(nextArrival).format("HH:mm") + "</td>";
    $(".train-info").append(tr.append(train + destination + frequency + timeArrival + minutes));


    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


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