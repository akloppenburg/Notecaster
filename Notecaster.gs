/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 *
 * Also checks to see if the main "Notecaster" folder exists in the root of the user's Drive and creates it if not.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  //adds a menu item that is labeled "Start/Refresh" and will call the function that updates the sidebar
  DocumentApp.getUi().createAddonMenu().addItem('Start/Refresh', 'showSidebar').addToUi();
  //creates the folder if it doesn't already exist
  make_folder();
}

/**
 * Runs when the add-on is installed.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * If a folder named 'Notecaster' doesn't exist in the root of the user's drive, create one.  Otherwise, throw an error.
 */
function make_folder() {
  // Checks for existence of the "Notecatser" folder, and returns it if it exist
  var folder = get_notecaster_folder();
  //if the folder does not exist, create one in the root of the user's Drive
  if(!folder){
    var notecaster = DriveApp.createFolder('Notecaster');
  }
  //otherwise, throw an error that explains that the folder has already been created
  else{
    throw new Error('Folder already exists.');
  }
    
}

/**
 * Helper function to get the Folder object named 'Notecaster' and return it.
 */
function get_notecaster_folder(){
  //returns a FolderIterator that contains all folders in the root of this project that are named "Notecaster"
  var folders = DriveApp.getFoldersByName('Notecaster');
  //if there exists such a folder, return it
  if(folders.hasNext()){
    return folders.next();
  }
  //otherwise, return null to indicate that no such forlder exists
  else{
    return null;
  }
}

/**
 * Returns the last 5 objects (5 most recent) from the 'Notecaster' folder.
 */
function get_last_5_images(){
  //Gets the Notecaster Folder object
  var folder = DriveApp.getFolderById(get_notecaster_folder().getId());
  //returns a FileIterator containing all the Files within the Notecaster Folder
  var images = folder.getFiles();
  //loops through to get the most recent 5 images and store them in an array
  var last_5_images = [];
  if(images.hasNext()){  
    for(i =0; i < 5; i++){
      last_5_images.push(images.next());
    }
    //return the array
    return last_5_images;
  }
  //if no files are found, throw the appropriate error
  else{
    throw new Error('No images in the Notecaster folder');
  }
}

/**
 * Helper function that returns a File's ID when given that file's number (0-4) in the last_5_images array
 *
 * @param {integer} image_num a number 0-4 corresponding to the given file's location in the last_5_images array
 */
function get_image_id(image_num){
  //choose_image function gets a File from the given image_num
  var image = choose_image(image_num);
  //if the file exists, return its id as a String
  if(image){
    DocumentApp.getActiveDocument().getCursor().insertText(image.getId() + "\n")
    Logger.log(image_num);
    return image.getId()
  }
  //else, throw an error
  else{
    throw new Error('No such File exists.');
  }
}

/**
 * Helper function that returns a File when given that File's number (0-4) in the last_5_images array
 *
 * @param {integer} image_num a number 0-4 corresponding to the given file's location in the last_5_images array
 */
function choose_image(image_num){
  //populates an array with the most recent 5 images from the Notecaster folder
  var last_5_images = get_last_5_images();
  //returns an image object from the array based on image_num
  return last_5_images[image_num];
}

/**
 * Inserts the file corresponding to the given image_num into the document at the current location of the cursor.
 *
 * @param {integer} image_num a number 0-4 corresponding to the given file's location in the last_5_images array
 */
function insert_image(image_num){
  //choose_image function gets a File from the given image_num
  var image = choose_image(image_num);
  //inserts the picture
  add_picture_at_cursor_location(image);
}

/**
 * Helper function to paste an image into the document wherever the cursor is.
 */
function add_picture_at_cursor_location(photo) {
  //gets current cursor position
  var cursor = DocumentApp.getActiveDocument().getCursor();
  //inserts Image where the cursor is
  cursor.insertInlineImage(photo);
    
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function showSidebar() {
  //loads a set of HTML based on the sidebar.html file
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Notecaster');
  //displays the resulting sidebar
  DocumentApp.getUi().showSidebar(ui);
}