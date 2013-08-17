$(function(){
    chrome.storage.local.get(["credentials_user", "credentials_pass"], function(items){
        if(items.hasOwnProperty("credentials_user") && 
            items.hasOwnProperty("credentials_pass")){
            $("#login_form").addClass("hide");
            $("#issue_form").removeClass("hide");
            
            var github = new Github({
                "username": items.credentials_user,
                "password": items.credentials_pass,
                "auth": "basic"
            });
            var user = github.getUser();
            user.repos(function(err, repos){
                for(var i in repos){
                    var repo = repos[i];
                    $("#issue_repository").append(new Option(repo.full_name, 
                        repo.full_name, false, false));
                }
            });
            $("#issue_repository").change(function(e){
                $("#issue_repository option:selected").each(function () {
                    var repo_name = $(this).val();
                    if(repo_name !== "-"){
                        var repo = github.getRepo(repo_name.split("/", 2)[0], 
                            repo_name.split("/", 2)[1]);

                        repo.listAssignees(function(err, assignees){
                            var assi = [];
                            for(var i in assignees){
                                assi.push(assignees[i].login);
                            }
                            console.log(assi);
                            $('#issue_assignee').typeahead({source:assi});
                        });
                        repo.listMilestones(function(err, milestones){
                            for(var i in milestones){
                                var mile = milestones[i];
                                $("#issue_milestone").append(new Option(mile.title, 
                                    mile.title, false, false));
                            }
                        });
                    }
                });
            });

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
});
