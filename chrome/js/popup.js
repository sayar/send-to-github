$(function(){
    chrome.storage.local.get(["credentials_user", "credentials_pass"], function(items){
        if(items.hasOwnProperty("credentials_user") && 
            items.hasOwnProperty("credentials_pass")){
            $("#login_form").addClass("hide");
            $("#issue_form").removeClass("hide");

            $("#issue_body").markdown({
                onShow: function(e){
                    chrome.tabs.getSelected(null, function(tab) {
                        chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){
                            if(response === undefined || reponse === null ||
                                response.data === undefined || response.data === null){
                                e.setContent("Via ["+tab.title+"]("+tab.url+")");
                            } else {
                                e.setContent(response.data + "\nVia ["+tab.title+"]("+tab.url+")");
                            }
                        });
                    });
                }
            });
            
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
                            $('#issue_assignee').typeahead({source:assi});
                        });
                        repo.listMilestones(function(err, milestones){
                            for(var i in milestones){
                                var mile = milestones[i];
                                $("#issue_milestone").append(new Option(mile.title, 
                                    mile.number, false, false));
                            }
                        });
                    }
                });
            });

            $("#issue_create").click(function(event){
                var repo_name = $("#issue_repository option:selected:first").val();
                
                var data = {
                    title: $("#issue_title").val() != "" ? $("#issue_title").val() : "New Issue",
                    body: $("#issue_body").val()
                };
                if($("#issue_assignee").val() !== ""){
                    data.assignee = $("#issue_assignee").val();
                }
                if($("#issue_labels").val() !== "" && 
                    $("#issue_labels").val().split(" ").length > 0){
                    data.labels = $("#issue_labels").val().split(" ");
                }
                if ($("#issue_milestone option:selected:first").val() !== undefined){
                    data.milestone = $("#issue_milestone option:selected:first").val();
                }
                
                var issue = github.getIssue(repo_name.split("/", 2)[0], 
                            repo_name.split("/", 2)[1], null);
                issue.create(data, function(err, result){
                    if(err !== null){
                        $("#confirmation_status").text("Fail!");
                    }
                    else {
                        $("#confirmation_status").html(
                            "Success! See <a target=\"_blank\" href=\""+
                            result.html_url+"\">here.</a>");
                    }
                });
                
                $("#issue_form").addClass("hide");
                $("#confirmation_page").removeClass("hide");
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
                    $("#login_form").addClass("hide");
                    $("#issue_form").removeClass("hide"); 
                });
                event.preventDefault();
                return false;
            });
        }
    });
    
    $.get("http://thecatapi.com/api/images/get?format=html&results_per_page=1", 
        function(data, textStatus, jqXHR) {
            $("#confirmation_page").prepend(data);
    });
});
