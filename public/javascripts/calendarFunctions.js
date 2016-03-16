var calendarListData = [];

$(document).ready(function() {
  // Populate the calendar table on initial page load
  populateCalendar();
  
  //add calendar button click
  $('#btnAddCalendar').on('click', addCalendar);
  
  //Delete Calendar link click
  $('#calendarList table tbody').on('click', 'td a.linkdeleteuser', deleteCalendar);
});

function populateCalendar() {
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/calendar/calendarlist', function( data ) {
    //stick our user data array into a userlist variable in the global object
    calendarListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td>' + this.hour + '</td>';
      tableContent += '<td>' + this.minute + '</td>';
      tableContent += '<td>' + this.station + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#calendarList table tbody').html(tableContent);
  });
};

function addCalendar(event) {
  event.preventDefault();
  
  //basic validation - check to see if any fields are blank
  var errorCount = 0;
  $('#addCalendar input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });
  
  //Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    //If it is, compile all calendar info into one object
    var newCalendarEvent = {
      'year': $('#addCalendar fieldset input#inputYear').val(),
      'month': $('#addCalendar fieldset input#inputMonth').val(),
      'day': $('#addCalendar fieldset input#inputDay').val(),
      'hour': $('#addCalendar fieldset input#inputHour').val(),
      'minute': $('#addCalendar fieldset input#inputMinute').val(),
      'location': $('#addCalendar fieldset input#inputLocation').val(),
      'station': $('#addCalendar fieldset input#inputStation').val(),
      'operator': $('#addCalendar fieldset input#inputOp').val(),
      'patient': $('#addCalendar fieldset input#inputPatient').val()
    }
    
    //Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newCalendarEvent,
      url: '/calendar/addcalendar',
      dataType: 'JSON'
    }).done(function( response) {
      //Check for successful (blank) response
      if(response.msg === '') {
        //Clear the Form inputs
        $('#addUser fieldset input').val('');
        
        //Update the table
        populateCalendar();
      } else {
        alert('Error: ' + response.msg);
      }
    });
  } else {
    //If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

//Delete Calendar
function deleteCalendar(event) {
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this event?');

  // Check and make sure the event confirmed
  if (confirmation === true) {
    // If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/calendar/deletecalendar/' + $(this).attr('rel')
    }).done(function( response ) {
      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateCalendar();
    });
  }
  else {
  // If they said no to the confirm, do nothing
    return false;
  }
};