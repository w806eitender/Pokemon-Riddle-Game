// 雅婷老師，你的金手指在最下面

function getRandom() {
    return Math.floor(Math.random() * 151 + 1).toString().padStart(3, 0)
}

for (var i = 1; i <= 10; i++) {
    $('#que_img' + i).prop("src", `./img/${getRandom()}.png`)
}

var resetLock = false
$('#resetBtn').click(function () {
    if (resetLock) {
        return
    };
    location.replace(location);
})

// 圖片點開顯示作答頁
$('.que_img').click(function () {
    var n = this.id.slice(7); //string
    $("#ans_modal" + n).css("display", "block");
    $(".ans_img").prop("src", this.src)
})

// XX按鈕
$(".close").click(function () {
    $(".modal").css("display", "none")
})

// 作答按鈕
$(".ansBtn").click(function () {
    var n = this.id.slice(7);
    var intVal = $(this).parent(".caption").find("input").val();
    var overlay = "#overlay" + n;
    if (intVal) {
        $('#resetBtn').addClass('resetImg_lock');
        $('#box6').css('background-color', '#023121')
        resetLock = true //一作答就將resetBtn失效
        $(overlay).text(intVal);
        $(overlay).css("opacity", 1)
    } else {
        $(overlay).css("opacity", 0)
    }
    $(".modal").css("display", "none")
})

//3分鐘倒數計時
var countDownDate = new Date().setTime(new Date().getTime() + 1000 * 182);
var countDown = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("demo").innerHTML = minutes + " min " + seconds + " sec ";

    if (distance < 0) {
        clearInterval(countDown);
        document.getElementById("demo").innerHTML = "EXPIRED";
        submit_lock = false
    }
}, 1000);

var hint_count = 3
$(".hintBtn").click(function () { //提示進化型
    var n = this.id.slice(7); //每一題的編號
    var poke_n = parseInt($(this).closest('.modal').find('img').prop('src').slice(-7, -4))
    var ori_n = pokemon[poke_n].oriType //原型態編號
    var last_n = ori_n + pokemon[poke_n].typeN - 1 //原型態+typeN = 終型態
    var ans_img = $(this).closest('.modal').find('img')
    if (hint_count > 0) { //提示數大於0
        if (pokemon[poke_n].typeN == 1) { //進化型是否只有一種
            var showImg = 0
            showImg = setInterval(function () {
                ans_img.toggleClass('show')
            }, 400)
            setTimeout(function () {
                clearInterval(showImg)
            }, 4000)
        }
        else {
            for (var i = 1; i <= pokemon[poke_n].typeN; i++) { //一一插入所有進化的圖片
                $("#ans_img" + n).after(`<img class='img_hint' src='img/${last_n.toString().padStart(3, 0)}.png'>`)
                last_n -= 1
            }
        }
        $(this).addClass('hint_chosen') //將按鈕換樣式
        hint_count -= 1
        $("#hintImg").prop("src", `./img/Hint${hint_count}.gif`)
    }
    if (hint_count == 0) { //提示數歸零
        $(".hintBtn").addClass('hint_chosen')
        $(".hintBtn2").addClass('hint_chosen')
    }
})

$(".hintBtn2").click(function () { //提示一個字，其他位置補上X
    var n = this.id.slice(8);
    var poke_n = parseInt($(this).closest('.modal').find('img').prop('src').slice(-7, -4))
    var word_n = Math.floor(Math.random() * pokemon[poke_n].name.length + 1)
    var hint_name = ""
    if (hint_count > 0) {
        for (var i = 1; i <= pokemon[poke_n].name.length; i++) {
            if (i == word_n) {
                hint_name += pokemon[poke_n].name.slice(word_n - 1, word_n)
            }
            else {
                hint_name += "X"
            }
        }
        $(this).closest('div').find('input').prop('placeholder', hint_name)
        $(this).addClass('hint_chosen')
        hint_count -= 1
        $("#hintImg").prop("src", `./img/Hint${hint_count}.gif`)
    }
    if (hint_count == 0) {
        $(".hintBtn").addClass('hint_chosen')
        $(".hintBtn2").addClass('hint_chosen')
    }
})

var submit_lock = true
$(".submitbtn").click(function () {
    if ($('#overlay1').text() == '******') { //<=金手指在這裡，只能在第一隻神奇寶貝打喔，然後要按submit按鈕
        $('.overlay').each(function (i, e) {
            var poke_n = parseInt($(e).closest('.container').find('img').prop('src').slice(-7, -4));
            $(e).text(pokemon[poke_n].name);
            $(e).css("opacity", 1)
        })
        return;
    }
    var count = 0
    $('.overlay').each(function (i, e) {
        var poke_n = parseInt($(e).closest('.container').find('img').prop('src').slice(-7, -4))
        if ($(e).text() == pokemon[poke_n].name) {
            var showImg = 0
            showImg = setInterval(function () {
                $(e).closest('.container').find('img').toggleClass('show')
            }, 500)
            setTimeout(function () {
                clearInterval(showImg)
            }, 2000);
            $(e).closest('.container').find('img').addClass('show')
            count += 1
        } else {
            $(e).closest('.que_box').css('border', 'maroon 10px solid')
            $(e).text(pokemon[poke_n].name)
            $(e).css('background', 'rgba(255, 0, 0, 0.6)').css("opacity", 1)
            submit_lock = false
        }
        clearInterval(countDown);
        if (submit_lock && count == 10) {
            $("#ans_modal10 div").remove()
            $("#ans_modal10 img").remove()
            $("#ans_modal10").append('<video autoplay controls><source src="./img/神奇寶貝大師.mkv" type="video/mp4"></video>')
            $("#ans_modal10").css("display", "block");
            submit_lock = false
        }
    })
})

