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
  DocumentApp.getUi().createAddonMenu().addItem('Start/Refresh', 'showSidebar').addToUi();
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
  // Create a folder in the root of their google drive called Notecaster
  var folder = get_notecaster_folder();
  if(!folder){
    var notecaster = DriveApp.createFolder('Notecaster');
  }
  else{
    throw new Error('Folder already exists.');
  }
    
}

/**
 * Helper function to get the Folder object named 'Notecaster' and return it.
 */
function get_notecaster_folder(){
  var folders = DriveApp.getFoldersByName('Notecaster');
  if(folders.hasNext()){
    return folders.next();
  }
  else{
    return null;
  }
}

/**
 * Returns the last 5 objects (5 most recent) from the 'Notecaster' folder.
 */
function get_last_5_images(){
  var folder = DriveApp.getFolderById(get_notecaster_folder().getId());
  var images = folder.getFiles();
  var last_5_images = [];
  if(images.hasNext()){  
    for(i =0; i < 5; i++){
      last_5_images.push(images.next());
    }
    return last_5_images;
  }
  else{
    throw new Error('No images in the Notecaster folder');
  }
}

/**
 * Helper function that returns a File given a certain Id.  Could be used whenever a user clicks on the desired image.
 */
function get_image_id(image_num){
  var image = choose_image(image_num);
  if(image){
    //DocumentApp.getActiveDocument().getCursor().insertText(image.getId());
    return image.getId()
  }
  else{
    throw new Error('God is dead');
  }
}

/**
 * Pastes the 4th most recent image into the document wherever the cursor is.
 */
function choose_image(image_num){
  var last_5_images = get_last_5_images();
  //TODO: make this variable instead of hardcoding 3
  var image = last_5_images[image_num];    //we need to ensure that the image number given is no larger than 4
  return image;
}

function insert_image(image_num){
  var image = choose_image(image_num);
  add_picture_at_cursor_location(image);
}

/**
 * Helper function to paste an image into the document wherever the cursor is.
 */
function add_picture_at_cursor_location(photo) {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  //requires photo to be a File
  cursor.insertInlineImage(photo);
    
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Notecaster');
  DocumentApp.getUi().showSidebar(ui);
}