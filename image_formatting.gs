/*eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/exif-js').getContentText());
function setExif(newimg) {
        EXIF.getData(newimg, function() {
            var orientation = EXIF.getTag(this, "Orientation");
            if(orientation == 6) {
                newimg.className = "sidebar-image rotate90";
            } else if(orientation == 8) {
                newimg.className = "sidebar-image rotate270";
            } else if(orientation == 3) {
                newimg.className = "sidebar-image rotate180";
            }
        });
};*/