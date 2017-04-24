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

var base_url = $(location).attr('protocol')+'//'+$(location).attr('hostname');
var work_experience_counter = 0;
var education_counter = 0;
var loader = '<div class="loader"><div class="inner one"></div><div class="inner two"></div><div class="inner three"></div></div>';

$(window).ready(function() {
    if(isMobile.any()) {
        //alert("This is a Mobile Device");
    }

    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');

    $('.percntage_form').ajaxForm({
        beforeSend: function() {
            status.empty();
            $('#form_progress_modal').openModal();
            var percentVal = '0%';
            bar.width(percentVal);
            percent.html(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal);
            percent.html(percentVal);
        },
        complete: function(xhr) {
            //status.html(xhr.responseText);
            response_check = xhr.responseText.toString();
            if(response_check != 'false')
            {
                go_to_user_url = $('a.go_to_home_btn').attr("href");
                user_url = go_to_user_url+"?action=userview&userId="+response_check;
                $('a.go_to_user_btn').attr( "href",user_url);
                $('a.dismiss_btn').attr( "href", user_url);
                $('a.go_to_user_btn').removeClass('hide');
                $('[type="submit"]').addClass('hide');
                status.html('User added! Go home or go to user?');
                status.show();
            }
            else
            {
                //$('a.modal-close').click();
                status.html('Sorry, there was a problem with adding this user,' +
                    ' it is ether that this loginName already exist,' +
                    ' or the internet connection is bad!');
                status.show();
            }
        }
    });

    $('.guest .button-collapse').sideNav({
            menuWidth: 240, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: false // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );

    $('.superuser .button-collapse').sideNav({
            menuWidth: 60, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: false // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.superuser .modal-trigger').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            ready: function() { /*alert('Ready');*/ }, // Callback for Modal open
            complete: function() { /*alert('Closed');*/ } // Callback for Modal close
        }
    );

    $('select').material_select();
    $('.parallax').parallax();
    $(".dropdown-button").dropdown({ hover: false });

    $('.login_container > div > div > form').on( "submit", false );

    $('[name="pre_btnlogin"]').on('click',function(e){
        e.preventDefault();
        $("#loader_box").show();
        var pre_login_attempt_url = base_url+'/services.php?action=pre_login_attempt&loginName='+$('[name="loginName"]').val();
        var successattmpt = [];

        $.post(pre_login_attempt_url, function(data,status) {
            if(status == 'success')
            {
                successattmpt = JSON.parse(data);
                strstatus = String(successattmpt['status']);
                htmlmsg = successattmpt['msg'];

                if(strstatus == "true")
                {
                    $(".return_pre_login").html(htmlmsg);
                    $(".return_pre_login").children('input').focus();
                    $('[name="pre_btnlogin"]').hide();
                    $('.login_container > .row > .login_small_container > form > p > .btnlogin').fadeIn();
                    $('body > div.container.container-fluid > div > div.login_container > div > div > form').attr("action",'{$ROOT_URL}/services.php?action=login');
                }
                else
                {
                    $(".return_msg_login").html(htmlmsg);$('[name="loginName"]').focus();
                }
            }
            else{console.log("Did not work");}

            $("#loader_box").hide();
        });
    });

    $('[name="btnlogin"]').on('click',function(e){
        $("#loader_box").show();
        var successlgin = [];
        var $form = $('body > div.container.container-fluid > div > div.login_container > div > div > form');
        action = $form.attr('action').replace("{$ROOT_URL}", base_url);
        console.log(action);
        $.post(action, $form.serialize(), function(response){
            successlgin = JSON.parse(response);
            lginstatus = String(successlgin['status']);
            lginmsg = successlgin['msg'];
            $("#loader_box").hide();
            if(lginstatus == "true")
            {location.reload();}
            else
            {$(".return_msg_login").html(lginmsg);$(".return_pre_login").children('input').focus();}
        });
    });

    /*
     $('header.left_nav_bar > .left_nav_bar_container >  .left_nav_bar_header > ul > li:nth-child(1) > figure > img').on('click',function(e){
     $('.left_nav_bar_ShowButton').toggleClass('hide');
     $('header.left_nav_bar').toggleClass('hide');
     });
     $('.left_nav_bar_ShowButton > figure > img').on('click',function(e){
     $('.left_nav_bar_ShowButton').toggleClass('hide');
     $('header.left_nav_bar').toggleClass('hide');
     });
     */

    $('.left_nav_bar_ShowButton > .show_nav > img').on('click',function(e){
        $('.left_nav_bar_ShowButton').css( "left", "200px" );
        $('header.left_nav_bar').css( "left", "0px" );
        //$('body').css('transform','translate(200px,0px)');
        $('.show_nav').toggleClass('hide');
        $('.hide_nav').toggleClass('hide');
    });
    $('.left_nav_bar_ShowButton > .hide_nav > img').on('click',function(e){
        $('.left_nav_bar_ShowButton').css( "left", "0px" );
        $('header.left_nav_bar').css( "left", "-200px" );
        //$('body').css('transform','translate(0px,0px)');
        $('.show_nav').toggleClass('hide');
        $('.hide_nav').toggleClass('hide');
    });

    subject_id =$('[name="subject_id"]').val();if(subject_id == "0"){$('[name="subject"]').prop('disabled', false);}else{$('[name="subject"]').prop('disabled', true);}
    $('[name="subject_id"]').on('change',function(e){subject_id = $( this ).val();if(subject_id == "0"){$('[name="subject"]').prop('disabled', false);}else{$('[name="subject"]').prop('disabled', true);}});

    /*
     var tabs = $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
     $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
     tabs.find( ".ui-tabs-nav" ).sortable({
     axis: "y",
     cancel: '.ui-state-disabled',
     stop: function() {
     tabs.tabs( "refresh" );
     }
     });

     $('.jqte_textarea').jqte();

     */

    var tabs = $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
    //$('.jqte_textarea').jqte();

    tinymce.init({selector:'.jqte_textarea',
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
    });

    $('.add_work_experience').on('click',function(e){
        var work_experience_url = base_url+'/admin/services.php?action=add_work_experience';
        $.post(work_experience_url, function(data,status) {
            if(status == 'success')
            {
                if($( ".work_experience_group").length < 1){$('#tabs_work_experience').prepend(data);}
                else{$( ".work_experience_group:last").after(data);}

                $( ".work_experience_group:last .job_title_li label").attr('for', "job_title_"+work_experience_counter);
                $( ".work_experience_group:last .job_title_li input").attr('id', "job_title_"+work_experience_counter);

                $( ".work_experience_group:last .company_name_li label").attr('for', "company_name_"+work_experience_counter);
                $( ".work_experience_group:last .company_name_li input").attr('id', "company_name_"+work_experience_counter);

                $( ".work_experience_group:last .work_start_date_li label").attr('for', "work_start_date_"+work_experience_counter);
                $( ".work_experience_group:last .work_start_date_li input").attr('id', "work_start_date_"+work_experience_counter);

                $( ".work_experience_group:last .work_end_date_li label").attr('for', "work_end_date_"+work_experience_counter);
                $( ".work_experience_group:last .work_end_date_li input").attr('id', "work_end_date_"+work_experience_counter);

                $( ".work_experience_group:last .work_other_information_li label").attr('for', "work_other_information_"+work_experience_counter);
                $( ".work_experience_group:last .work_other_information_li textarea").attr('id', "work_other_information_"+work_experience_counter);

                $( ".work_experience_group:last .jqte_textarea").jqte();

                work_experience_counter++;
                $('.remove_work_experience').unbind('click');
                $('.remove_work_experience').on('click',function(e){
                    $(this).parent().remove();
                    work_experience_counter = 0;

                    $( ".work_experience_group").each(function() {
                        $(this).children('ul').children('.job_title_li').children('label').attr('for', "job_title_"+work_experience_counter);
                        $(this).children('ul').children('.job_title_li').children('input').attr('id', "job_title_"+work_experience_counter);

                        $(this).children('ul').children('.company_name_li').children('label').attr('for', "company_name_"+work_experience_counter);
                        $(this).children('ul').children('.company_name_li').children('input').attr('id', "company_name_"+work_experience_counter);

                        $(this).children('ul').children('.work_start_date_li').children('label').attr('for', "work_start_date_"+work_experience_counter);
                        $(this).children('ul').children('.work_start_date_li').children('input').attr('id', "work_start_date_"+work_experience_counter);

                        $(this).children('ul').children('.work_end_date_li').children('label').attr('for', "work_end_date_"+work_experience_counter);
                        $(this).children('ul').children('.work_end_date_li').children('input').attr('id', "work_end_date_"+work_experience_counter);

                        $(this).children('ul').children('.work_other_information_li').children('label').attr('for', "work_other_information_"+work_experience_counter);
                        $(this).children('ul').children('.work_other_information_li').children('input').attr('id', "work_other_information_"+work_experience_counter);

                        work_experience_counter++;
                    });
                    $('[name="work_experience_counter"]').val(work_experience_counter);
                });
            }
            else{console.log("Did not work");}
        });
        $('[name="work_experience_counter"]').val(work_experience_counter);
    });

    $('.add_education').on('click',function(e){
        var education_url = base_url+'/admin/services.php?action=add_education';
        $.post(education_url, function(data,status) {
            if(status == 'success')
            {
                if($( ".education_group").length < 1){$('#tabs_education').prepend(data);}
                else{$( ".education_group:last").after(data);}

                $( ".education_group:last .course_name_li label").attr('for', "course_name_"+education_counter);
                $( ".education_group:last .course_name_li input").attr('id', "course_name_"+education_counter);

                $( ".education_group:last .institution_name_li label").attr('for', "institution_name_"+education_counter);
                $( ".education_group:last .institution_name_li input").attr('id', "institution_name_"+education_counter);

                $( ".education_group:last .edu_start_date_li label").attr('for', "edu_start_date_"+education_counter);
                $( ".education_group:last .edu_start_date_li input").attr('id', "edu_start_date_"+education_counter);

                $( ".education_group:last .edu_end_date_li label").attr('for', "edu_end_date_"+education_counter);
                $( ".education_group:last .edu_end_date_li input").attr('id', "edu_end_date_"+education_counter);

                $( ".education_group:last .edu_other_information_li label").attr('for', "edu_other_information_"+education_counter);
                $( ".education_group:last .edu_other_information_li textarea").attr('id', "edu_other_information_"+education_counter);

                $( ".education_group:last .jqte_textarea").jqte();

                education_counter++;
                $('.remove_education').unbind('click');
                $('.remove_education').bind('click',function(e){
                    education_counter = 0;
                    $(this).parent().remove();

                    $( ".education_group").each(function() {
                        $(this).children('ul').children('.course_name_li').children('label').attr('for', "course_name_"+education_counter);
                        $(this).children('ul').children('.course_name_li').children('input').attr('id', "course_name_"+education_counter);

                        $(this).children('ul').children('.institution_name_li').children('label').attr('for', "institution_name_"+education_counter);
                        $(this).children('ul').children('.institution_name_li').children('input').attr('id', "institution_name_"+education_counter);

                        $(this).children('ul').children('.edu_start_date_li').children('label').attr('for', "edu_start_date_"+education_counter);
                        $(this).children('ul').children('.edu_start_date_li').children('input').attr('id', "edu_start_date_"+education_counter);

                        $(this).children('ul').children('.edu_end_date_li').children('label').attr('for', "edu_end_date_"+education_counter);
                        $(this).children('ul').children('.edu_end_date_li').children('input').attr('id', "edu_end_date_"+education_counter);

                        $(this).children('ul').children('.edu_other_information_li').children('label').attr('for', "edu_other_information_"+education_counter);
                        $(this).children('ul').children('.edu_other_information_li').children('input').attr('id', "edu_other_information_"+education_counter);

                        education_counter++;
                    });
                    $('[name="education_counter"]').val(education_counter);
                });
            }
            else{console.log("Did not work");}
        });
        $('[name="education_counter"]').val(education_counter);
    });
});

function check_validity(regex_key,strng_test) {
    var patt = new RegExp(regex_key);
    var res = patt.test(strng_test);
    return res;
}

$(window).load(function() {
    $('#loader-wrapper').fadeOut();
});