/*//////////////////////////////
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
/////////////////////////////*/

/* Anular click  $('.choices').off('click') */


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
  var traiName="";
  var trainDestination="";
  var trainTime=0;
  var trainFreq =0;

  //Capture button click
  $(".add-train").on("click",function(event){
    event.preventDefault();
    //Grab values from form boxes
    traiName = $("#train-name").val().trim();
    trainDestination = $("#train-destination").val().trim();
    trainTime = $("#train-time").val().trim();
    trainFreq = $("#train-frequency").val().trim();

    if(traiName=="" || trainDestination=="" || trainTime =="" || trainFreq == ""){
        alert("Please fill all fields");
    }
    database.ref().push({
        traiName: traiName,
        trainDestination: trainDestination,
        trainTime: trainTime,
        trainFreq: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    

  }); //End of  click capture

  database.ref().on("child_added", function(snapshot){
    console.log(snapshot.val());
    console.log(snapshot.val().traiName);
    console.log(snapshot.val().trainDestination);
    console.log(snapshot.val().trainTime);
    console.log(snapshot.val().trainFreq);

    $(".train-info").append("<tr><td>"+ 
    snapshot.val().traiName +"</td><td>"+
    snapshot.val().trainDestination+"</td><td>"+ 
    snapshot.val().trainFreq+"</td></tr>"
    );

     // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });