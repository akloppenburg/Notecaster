function myFunction() {
  // Log the name of every file in the user's Drive.
  var files = DriveApp.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    Logger.log(file.getName());
    console.log(file.getName()); 
  }
}

// Adds text to the document where the cursor is at 
function add_text_at_cursor_location() {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    cursor.insertText("(Code added)");
}

function add_picture_at_cursor_location(photo) {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    cursor.insertInlineImage(photo)
    
}



function make_file() {
  // Create a text file with the content "Hello, world!"
  DriveApp.createFile('New Text File', 'Hello, world!');
}
