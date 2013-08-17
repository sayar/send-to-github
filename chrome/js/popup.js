$(function(){
    chrome.storage.local.get(["credentials_user", "credentials_pass"], function(items){
        if(items.hasOwnProperty("credentials_user") && 
            items.hasOwnProperty("credentials_pass")){
            $("#login_form").addClass("hide");
            $("#issue_form").removeClass("hide");


            $("#issue_create").click(function(event){
                event.preventDefault();
                return false;
            });
        } else {
            $("#login_form").removeClass("hide");
            $("#issue_form").addClass("hide");        
            
            $("#credentials_save").click(function(event){
                chrome.storage.local.set({
                    "credentials_user": $("#credentials_user").val(),
                    "credentials_pass": $("#credentials_pass").val()
                }, function(){
                    message("Settings saved.");
                    $("#login_form").addClass("hide");
                    $("#issue_form").removeClass("hide"); 
                });
                event.preventDefault();
                return false;
            });
        }
    });

    var saveChanges = function() {
        console.log($("#issue_project"));
        console.log($("#issue_assignee"));
        console.log($("#issue_milestone"));
        console.log($("#issue_labels"));
        
        // Save it using the Chrome extension storage API.
//        chrome.storage.sync.set({'value': theValue}, function() {
            // Notify that we saved.
  //          message('Settings saved');
    //    });
    }


});
