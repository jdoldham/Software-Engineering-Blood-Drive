var calendarListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
  //see if a user is logged in, if not redirect to login page
  var email = sessionStorage.getItem('email');
  if(email == null) {
    window.location.href = '/';
  }
  
  populateCalendar();
});

// Functions =============================================================

function testSession() {
  $.ajax({
    type: 'POST',
    url: '/users/testsession',
	dataType: 'JSON'
  }).done(function( response ) {
    //alert('yay');
  });
}; 

function logout() {
  sessionStorage.removeItem('email');
  window.location.href = '/';
};

function populateCalendar() {
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/calendar/calendaremail' + '/' + sessionStorage.getItem('email'), function( data ) {
    //stick our user data array into a userlist variable in the global object
    calendarListData = data;
    //alert(data);
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
	//if (this.patient.indexOf('@') === -1){ 
      tableContent += '<tr>';
	  tableContent += '<td>' + this.date + '</td>';
      tableContent += '<td>' + this.time + '</td>';
      tableContent += '<td>' + this.station + '</td>';
	  tableContent += '<td>' + this.location + '</td>';
	  tableContent += '<td>' + this.operator + '</td>';
      tableContent += '<td><a href="#" class="linkadduser" rel="' + this._id + '">Signup</a></td>';
      tableContent += '</tr>';
	//}
    });

    // Inject the whole content string into our existing HTML table
    $('#calendarList table tbody').html(tableContent);
  });
};