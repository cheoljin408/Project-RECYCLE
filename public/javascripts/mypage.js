
var page = 0;

var userID = document.getElementById("user_id");
var user = userID.textContent;

var html = "";
function getData(user, page, scroll) {
    $.ajax({
        type: 'post',
        url: '/myArticle',
        data: {
            user: user
        },
        sucess: function(data){
            var len = data.length;

            if (len == 0){
                $('.no_article').show();
                $('.have_article').hide(); 
            } else {
                $('.no_article').hide();
                $('.have_article').show();
                if (scroll == 0) {
                    html = '';
                }
                $('#masonry_container').remove();
                $('.content_area > .have_article').append(`<div id="masonry_container" class="masorny" style="margin:0 auto;"></div>`);

                if (data != null){
                    for (var i = 0; i < len; i++){
                        var id = data[i]['id'];
                        var category = data[i]['category'];
                        var local = data[i]['local'];
                        var state = data[i]['state'];
                        var title = data[i]['title'];
                        var price = data[i]['price'];
                        var img = data[i]['img'];
                        var plus = `<div class="paper" id="${id}">
                                        <div class="paper-holder">
                                            <a><img width="225" src="${img}"></a>
                                        </div>
                                        <div class="paper-discription>
                                            <p id="title">${title}</p>
                                            <p id="userId">${user}</p>
                                        </div>
                                        <div class="paper-content">
                                        <span id="price">${price}원</span>
                                            <span class="paper-state">
                                                <span id="state_${i} style="display:none;">${state}</span>
                                                <span class="state1" id="state1_${i}">렌탈</span>
                                                <span class="state2" id="state2_${i}">판매</span>
                                            </span>
                                        </div>
                                        <div class="paper-info">
                                            <span id="views"><img src="/images/views.png">302</span>
                                        </div>
                                    </div>`;
                        htmp += plus;
                    }
                    $('.content_area > .have_article').css('display','none');
                    document.getElementById('masonry_container').innerHTML = html;

                    setTimeout(function() {
                        $('.content_area > .have_article').css('display', 'block');
                        $('#masonry_container').masonry({
                            itemSelector : '.paper',
                            columnWidth: 285,
                            isAnimated: true,
                            isFitWidth: true
                        });
                    }, 1000);

                    //masonry rental vs buy
                    for (var i = 0; i < len; i++) {
                        if ($(`#state_${i}`).text() == "렌탈") {
                            $(`#state1_${i}`).css("background-color", "#7fcacb");
                            $(`#state1_${i}`).css("color", "white");
                            $(`#state1_${i}`).css("padding", "5.5px");
                            $(`#state2_${i}`).css("border-style", "solid");
                            $(`#state2_${i}`).css("border-color", "#7fcacb");
                            $(`#state2_${i}`).css("border-width", "0.5px");
                            $(`#state2_${i}`).css("background-color", "white");
                            $(`#state2_${i}`).css("color", "#7fcacb");
                            } else {
                            $(`#state1_${i}`).css("background-color", "white");
                            $(`#state1_${i}`).css("color", "#7fcacb");
                            $(`#state1_${i}`).css("border-style", "solid");
                            $(`#state1_${i}`).css("border-color", "#7fcacb");
                            $(`#state1_${i}`).css("border-width", "0.5px");
                            $(`#state2_${i}`).css("padding", "5.5px");
                            $(`#state2_${i}`).css("background-color", "#7fcacb");
                            $(`#state2_${i}`).css("color", "white");
                        }
                    }

                    
                } else {
                    $('.no_article').show();
                    $('.have_article').hide(); 
                }
                
                //scroll 위치 기억
                setTimeout(function(){
                    $('html').animate({
                        scrollTop: scroll
                    }, 0);
                }, 1000);
            }
            $(".paper").click(function() {
                console.log($(this).attr('id'));
                var postid = $(this).attr('id');
                console.log(postid);
                document.location.href = `/find-ex?id=${postid}`;
            });
        }  
    });
}

getData(user, 0, 0);

