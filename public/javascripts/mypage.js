
var page = 0;

var userID = document.getElementById("user_id");
var user = userID.textContent;

var html = "";

var content = document.getElementById("have_article");

function getArticle(userID){
    $.ajax({
    type: 'POST',
    url: '/myArticle',
    data : {
        user : userID,
    },
    success : function(data){
        if (data === "null") {
            $('.no_article').show();
            $('.have_article').hide();
        } else {
            
            $('.no_article').hide();
            $('.have_article').show();
            len = data.length;
            console.log(data);
            for (var i = 0; i < len; i++){
                var id = data[i]['id'];
                var title = data[i]['title'];
                var price = data[i]['price'];
                var img = data[i]['img'];
                var state= data[i]['state'];
                var local = data[i]['local'];
                var category = data[i]['category'];
                var plus = `<div class="card my_article"  style="margin-top: 20px;">
                                <div class="row no-gutters">
                                    <div class="text-center" style="width: 200px; height: 140px;">
                                        <img style="height: 140px;" src="${img}" class="card-img">
                                    </div>
                                    <div style="width: calc( 95% - 300px );">
                                        <div class="card-body" style=" text-overflow: ellipsis;">
                                            <h5 class="card-title">${title}</h5>
                                            <p class="card-text"><span class="text-muted">가격:&nbsp;</span>${price}원</p>
                                            <span class="card-text"><small class="text-muted">${local}</small></span>
                                            <span class="card-text"><small class="text-muted">#${state}</small></span>
                                        </div>
                                    </div>
                                    <div style="padding-top: 53px;"><button id="${id}" class="delete_btn btn btn-primary align-middle"  style="border-color: #7fcacb; background-color:#7fcacb;" style="float: right;">판매 완료</button></div>
                                </div>
                            </div>`;
                html += plus;
            }
            document.getElementById("have_article").innerHTML = html;
            //console.log(user);
            

            
            $(".my_article .delete_btn").click(function () {
                console.log($(this).attr('id'));
                var postid = $(this).attr('id');
                console.log(postid);              
                
                alert('삭제');
                deleteArticle(postid);                
            });            
        }
    }
})
}

function deleteArticle(articleID){
    $.ajax({
        type: 'POST',
        url: '/deleteArticle',
        data: {
            articleID : articleID
        }
    })
}

$.post('/userID', function(data){
    if (data.userID){
        userID = document.getElementById("user_id");
        userEmail = document.getElementById("user_email");
        userPhone = document.getElementById("user_phone");
        userID.textContent = data.userID;
        userEmail.textContent = data.userEmail;
        userPhone.textContent = data.userPhone;

        getArticle(data.userID);
    } else {
        alert('session error!');
        window.location.href="/find";
    }
});



