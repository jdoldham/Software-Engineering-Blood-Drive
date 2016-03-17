// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the user table on initial page load
  populateTable();
  
  //Username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  
  //Add User button click
  $('#btnAddUser').on('click', addUser);
  
  //Delete User link click
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  
  //add calendar button click
  //$('#btnAddCalendar').on('click', addCalendar);
});

// Functions =============================================================

// Fill table with data
function populateTable() {
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users/userlist', function( data ) {
    //stick our user data array into a userlist variable in the global object
    userListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.email + '">' + this.fname  + " " + this.lname + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });
};

// Show User Info
function showUserInfo(event) {
  //Prevent Link from Firing
  event.preventDefault();
  
  //Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');
  
  //Get Index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.email; }).indexOf(thisUserName);
  
  //Get our User Object
  var thisUserObject = userListData[arrayPosition];
  
  //Populate Info Box
  $('#userInfoName').text(thisUserObject.fname + " " + thisUserObject.lname);
  $('#userInfoLocation').text(thisUserObject.zipcode);
  $('#userInfoName').text(thisUserObject.fname + " " + thisUserObject.lname);
  $('#userInfoLocation').text(thisUserObject.zipcode);
  $('#userInfoDoB').text(thisUserObject.dob_month + ", " + thisUserObject.dob_day + ", " + thisUserObject.dob_year);
  $('#userInfoVisits').text(thisUserObject.donation_count);
  $('#userInfoBloodType').text(thisUserObject.blood_type);
};

//Add User
function addUser(event) {
  event.preventDefault();
  
  //basic validation - check to see if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });
  
  //Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    //If it is, compile all user info into one object
    var newUser = {
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fname': $('#addUser fieldset input#inputFirstName').val(),
      'lname': $('#addUser fieldset input#inputLastName').val(),
      'dob_year': $('#addUser fieldset input#inputYear').val(),
      'dob_month': $('#addUser fieldset input#inputMonth').val(),
      'dob_day': $('#addUser fieldset input#inputDay').val(),
      'zipcode': $('#addUser fieldset input#inputLocation').val(),
      'donation_count': $('#addUser fieldset input#inputVisits').val(),
      'password': $('#addUser fieldset input#inputPassword').val(),
      'blood_type': $('#addUser fieldset input#inputBloodType').val()
    }
    /*
    var existingUser = false;
    
    $.getJSON( '/users/useremail', newUser, function( data ) {
      $.each(data, function(){
        alert(this.email);
      });
    });
    
    if(existingUser){
      alert("A user with this email already exists");
      return false;
    }
    */
    
    //Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response) {
      //Check for successful (blank) response
      if(response.msg === '') {
        //Clear the Form inputs
        $('#addUser fieldset input').val('');
        
        //Update the table
        populateTable();
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

//Delete User
function deleteUser(event) {
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {
    // If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function( response ) {
      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();
    });
  }
  else {
  // If they said no to the confirm, do nothing
    return false;
  }
};