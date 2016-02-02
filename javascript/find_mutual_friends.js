/**
 * Written by Will. Celestin
 *
 * Displays friends of logged in user who:
 * 1. are using this app
 * 2. share a mutual friend(also using this app) with user
 */

function find_mutual_friends() {

    // check facebook connection
    FB.getLoginStatus(function (connection_response) {
        if (connection_response.status === 'connected') {

            // login and request permission to friends list
            FB.login(function(login_response) {
                if (login_response && !login_response.error) {

                    // get user's friend list (ones using the app)
                    FB.api(
                        "/me/friends ",
                        function (friends_response) {
                            if (friends_response && !friends_response.error) {

                                 // html unordered list holding mutual friends
                                 var mutual_friends_list =
                                     document.getElementById("mutual_friends_list");

                                // array of mutual friends' ID
                                 var mutual_friend = [];

                                // fill array with user's friends (ones using the app)
                                 var my_friends = [];
                                 for (var i = 0; i < friends_response.data.length; i++){
                                     my_friends[i] = friends_response.data[i].id.toString();
                                 }

                                 // iterate through user's friends
                                 for (var i = 0; i < my_friends.length; i++) {

                                     // get friends of users friends
                                     FB.api(
                                         "/"+my_friends[i]+"/friends",
                                         function (mutual_response) {
                                             if (mutual_response && !mutual_response.error) {

                                                 // display friends of user with a mutual friend
                                                 for (var j = 0; j < mutual_response.data.length; j++){

                                                     var id = mutual_response.data[j].id.toString();
                                                     var name = mutual_response.data[j].name.toString();

                                                     if (my_friends.indexOf(id)>-1 &&
                                                         mutual_friend.indexOf(id)<0){

                                                         var li = document.createElement("li");
                                                         li.appendChild(document.createTextNode(name));
                                                         mutual_friends_list.appendChild(li);

                                                         mutual_friend.push(id);
                                                     }
                                                 }
                                             }
                                         }
                                     );
                                 }
                            }
                        }
                    );
                }
            },
                {scope: 'user_friends'} // request permission to friends lists
            );
        }
        else{
            // remove list of mutual friends upon user logout
            var ul = document.getElementById("mutual_friends_list");
            while (ul.firstElementChild) ul.removeChild(ul.firstElementChild);
        }
    });
}
