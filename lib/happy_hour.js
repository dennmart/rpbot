/*
  Checks current time to check if it's happy hour at The Broken Rack:
  - Monday - Thursday from 5:00 PM to 7:00 PM
  - Friday from 4:00 PM to 7:00 PM
*/
exports.currentStatus = function(room) {
  var currentDate = new Date();
  var dayOfWeek = currentDate.getDay();
  var currentHour = currentDate.getHours();

  if (dayOfWeek == 0 || dayOfWeek == 6) {
    room.speak("Sorry, there are no Happy Hours during the weekend. Time to pay for beer at full price!");
  } else if (dayOfWeek == 5 && (currentHour >= 16 && currentHour < 19)) {
    room.speak("It's Happy Hour RIGHT NOW! What are you waiting for?");
  } else if (currentHour >= 17 && currentHour < 19) {
    room.speak("It's Happy Hour RIGHT NOW! What are you waiting for?");
  } else {
    room.speak("Nope, it's not Happy Hour. Check again later!");
  }
};
