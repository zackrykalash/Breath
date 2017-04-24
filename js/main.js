var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

var base_url_protocol = window.location.protocol;
var base_url_hostname = window.location.hostname;
var base_url_pathname = window.location.pathname;
var base_url_href     = window.location.href;
if(base_url_pathname == "/")
{
    base_url_pathname = "/index.php";
}
var base_url = base_url_protocol+'//'+base_url_hostname;
var base_url_user = base_url + base_url_pathname;
var base_url_user_services = base_url + "/services.php";
var base_url_user_login = base_url + "/login.php";
var base_url_user_websitesettings = base_url + "/websitesettings.php";
var base_url_user_menu = base_url + "/menu.php";
var base_url_user_users = base_url + "/users.php";
var base_url_user_cv = base_url + "/cv.php";

var tinymce_selector;
var tinymce_options;

var work_experience_counter = 0;
var education_counter = 0;

var paramToObjct = function () {
    var _search = window.location.search.substring(1);
    if(_search == null || _search == ""){
        return null;
    }
    var object = JSON.parse('{"' + decodeURI(_search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
    return object;
};



var urlHash = function () {
    var _search = window.location;
    if(_search.hash == null || _search.hash == ""){
        return null;
    }
    return _search.hash;
};

var arrayToObjct = function (obj) {
    var str = [];
    $.each( obj, function( key, value ) {
        str.push(key+"="+value);
    });
    return str.join("&");
};

$(window).ready(function() {
    if(isMobile.any()) {
        //alert("This is a Mobile Device");
    }

    subjectId =$('[name="subjectId"]').val() ;
    if(subjectId == "0")
    {
        $('[name="subject"]').prop('disabled', false) ;
    }
    else
    {
        $('[name="subject"]').prop('disabled', true) ;
    }
    $('[name="subjectId"]').on('change',function(e){
        subjectId = $( this ).val() ;
        if(subjectId == "0"){$('[name="subject"]').prop('disabled', false) ;
        }
        else
        {
            $('[name="subject"]').prop('disabled', true) ;
        }
    }) ;
});

function tinymce_init(tinymce_selector_var) {
    var tinymce_selector = tinymce_selector_var;
    var tinymce_options = {selector:tinymce_selector,
        inline: false,
        theme: "modern",
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor colorpicker textpattern imagetools"
        ],
        toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
        toolbar2: "print preview media | forecolor backcolor emoticons",
        image_advtab: true,
        templates: [
            {title: 'Test template 1', content: 'Test 1'},
            {title: 'Test template 2', content: 'Test 2'}]

        //,toolbar3: "mybutton",setup: function(editor) {editor.addButton('mybutton', {text: 'My button',
        //icon: false,onclick: function() {editor.insertContent('Main button');}});}
    };
    tinymce.init(tinymce_options);
}

$(window).load(function() {
    $('#loader-wrapper').fadeOut();
    $.material.init();
    //tinymce_init('textarea');

    //var textarea_timer = setInterval(function() {/* code here */}, 1 * 1000);
    //clearInterval(textarea_timer);
});