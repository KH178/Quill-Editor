class Data{
    constructor( commentedText="", type="" , by="", date="", range="", text="", src="" ){
        this.commentedText = commentedText,
        this.type = type,
        this.range = range,
        this.by = by,
        this.selectedText = text,
        this.reply = [],
        this.date = date,
        this.src = src;
    }
}

var recording = [];
var comments = [];
var commentsCount = 0;
var repliesCount = 0;
var replies = [];
var range;
var text;
var by;
var $commentContainer = $("#comments-container");
var comment_button = '<span class="ql-formats"><button type="button" class="ql-clean" id="comment-button"><i class="fa fa-comment"></i></button></span>';
var record_btn = '<span class="ql-formats"><button type="button" class="ql-clean" id="microphone" data-toggle="modal" data-target="#myModal"><i class="fa fa-microphone"></i></button></span>';


var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var date = hours + ':' + minutes + ' ' + ampm;

$(document).ready(function(){
    $('.ql-toolbar').append(comment_button);
    $('.ql-toolbar').append(record_btn);
})

$(document).on('mouseenter', '.comment', function(){
    var id = $(this).data('index');
    var range = comments[id].range;
    quill.formatText(range.index, range.length, {
        background: "#fff72b"
    });
})

$(document).on('mouseleave', '.comment', function(){
    var id = $(this).data('index');
    var range = comments[id].range;
    quill.formatText(range.index, range.length, {
        background: "transparent"
    });
})




$(document).on("click", "#comment-button", function() {
    range = quill.getSelection();
    
    if (range) {
        if (range.length === 0) {
            alert("Please select text");
        }
        else {
            text = quill.getText(range.index, range.length);
            
            // quill.formatText(range.index, range.length, {
            //     // background: "#fff72b"
            // });
            
            if(text){
                $('.comment_text').show()
                $('.comment_text').find('textarea').css({'height':'80px'}).focus().removeAttr('readonly','false');
                $('.comment_text').find('i').show();
            }
        }
        
    } else {
        alert("User cursor is not in editor");
    }
});

$('#check').on('click',function() {
    var commentedText = $('#comment_text').val();
    var type = "comment";
    var date = '';
    
    if(commentedText == null  || commentedText == "") {
        var error = document.getElementById('error');
        $(error).empty();
        error.append("Comment Please");
    }
    else {
        var comment = new Data( commentedText, type ,by, date, range , text  )
        comments.unshift(comment);
        $commentContainer.html(drawComments(comments));
    }

    range = null;
    $('#comment_text').val('').empty().css({'height':'50px'}).attr('readonly','true');
    $('.comment_text').find('i').hide();
});

$(document).on('click','.comment-link',function () {
    var key = $(this).parent().data('index');
    // console.log("comment link called",index);
    var data = comments[key];
    // console.log(data);
    // quill.setSelection(data.range.index, data.range.length);
    var id = $(this).parent().parent().parent().find('.replyInput')[0];
    console.log(id) ;

    var node = document.createElement("div");
    node.className = "replySection list-group-item";
    var newDiv = document.createElement("div");
    newDiv.className = "replyIcon";
    var newI = document.createElement("i");
    // newI.id = "replySubmit";
    newI.className = "replySubmit fa fa-check";
    var newII = document.createElement("i");
    newII.className = "fa fa-close";
    newDiv.append(newI, newII);

    var form = document.createElement("form");
    form.name = "comment_reply"
    form.className = 'comment_form'
    node.append(form, newDiv);
    var inputnode = document.createElement("input");
    inputnode.type = "text";
    inputnode.placeholder = "reply....";
    inputnode.name = "reply";
    form.appendChild(inputnode);
    
    // append node into replyInput class div
    $(id).html(node); 
  
});

$(document).on('click','.replySubmit', function(){
    var commentedText = document.comment_reply.reply.value;
    var type = "reply"
    var date = '';
    var comment = new Data( commentedText, type ,by, date );
    var isComment = $(this).parent().closest('.replyInput').parent().hasClass('comment');
    var index  = $(this).parent().closest('.replyInput').parent().data('index');
    
    replies.push( comment );
    
    if ( isComment ) {
        comments[index].reply.push( replies.length - 1 );
    } else {
        replies[index].reply.push( replies.length - 1 );
    }

    $commentContainer.html(drawComments(comments));
});

function drawComments(elements,entity="comment") {
    var content = "";

    if ( entity == "comment" ) {
        $.each(elements, function( key, value ) {
            if ( value != undefined ) {
                if(value.type == "record"){
                    content += 
                    '<div class="main__container">'+
                        '<div class="'+entity+'" href="#" data-index="' + key + '">' +
                            '<div class="main-comment-container">'+
                                '<div class="alert-success" id="recording_' + key + '" data-index="' + key + '">' +
                                    '<audio id="audio_' + key + '" src="'+value.src+'"  controls></audio>' +
                                    // '<i class="comment-link fa fa-comment"></i>' + 
                                '</div>'+
                                '<div class="comment_source">'+
                                    '<i class="fa fa-comment comment-link"></i>'+
                                    '<i class="fa fa-microphone recording" data-toggle="modal" data-target="#myModal1"></i>'+
                                '</div>'+
                                '<div class="remove_comment" id="'+key+'">'+
                                    '<i class="fa fa-trash trash_comment"></i>'+
                                '</div>'+
                            '</div>'+
                            '<div class="replyInput" data-id="'+key+'"></div>'

                            if ( value.reply.length > 0 ) {
                                content += '<div style="margin-left:20px; margin-top:5px; margin-bottom:5px;">';
                                content += drawComments(value.reply, 'reply');
                                content += '</div>';
                            }
                            
                    content+="</div></div>";
                    
    
                }    
                else if(value.type == "comment") {
                    content +=
                        "<div class='main__container '><div class='"+entity+"' href='#' data-index='" + key + "'>" +
                            "<div class='main-comment-container'>" + 
                                "<div class='comment-info'>"+
                                    "<div class='comment-user'>Sanjeev </div>"+
                                    "<div class='comment-time'> Today "+value.date+"</div>"+
                                "</div>"+
                                "<div class='value-comment'>" + value.commentedText +"</div>"+
                                "<div class='comment_source'>"+
                                    "<i class='fa fa-comment comment-link'></i>"+
                                    "<i class='fa fa-microphone recording' data-toggle='modal' data-target='#myModal1'></i>"+
                                "</div>"+
                                "<div class='remove_comment' id='"+key+"'>"+
                                    "<i class='fa fa-trash trash_comment'></i>"+
                                "</div>"+
                            "</div>"+
                            "<div class='replyInput' data-id='"+key+"'></div>";
                
                    if ( value.reply.length > 0 ) {
                        content += '<div style="margin-left:20px;margin-top:5px; margin-bottom:5px;">';
                        content += drawComments(value.reply, 'reply');
                        content += '</div>';
                    }
                    
                    content+="</div></div>";
                }
            }
        });
    }

    else if(entity == 'reply') {
        $.each(elements, function ( index, value ) {
            if ( replies[elements[index]] != undefined ) {
                if(replies[elements[index]].type=='reply'){
                    content +=
                        "<div class=''>"+
                            "<div class='"+entity+"' href='#' data-index='" + elements[index] + "'>"+
                                "<div class='main-comment-container'>"+
                                    "<div class='comment-info'>"+
                                        "<div class='comment-user'>Sanjeev </div>"+
                                        "<div class='comment-time'> Today "+replies[elements[index]].date+"</div>"+
                                    "</div>"+
                                    "<div class='value-comment'>" + replies[elements[index]].commentedText +"</div>"+
                                    "<div class='comment_source'>"+
                                        "<i class='fa fa-comment comment-link'></i>"+
                                        "<i class='fa fa-microphone recording' data-toggle='modal' data-target='#myModal1'></i>"+
                                    "</div>"+
                                    "<div class='remove_comment' id='"+elements[index]+"'>"+
                                        "<i class='fa fa-trash trash_comment'></i>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='replyInput' data-id='"+elements[index]+"'></div>";
                
                    if ( replies[elements[index]].reply.length > 0 ) {
                        content += '<div style="margin-left:20px; margin-top:5px; margin-bottom:5px;">';
                        content += drawComments(replies[elements[index]].reply, 'reply');
                        content += '</div>';
                    }

                    content+="</div></div>";
                }
                
                else if(replies[elements[index]].type == 'replyRecord'){
                    content += 
                    '<div class="">'+
                        '<div class="'+entity+'" href="#" data-index="' + elements[index] + '">' +
                            '<div class="main-comment-container">'+
                                '<div class="alert-success" id="recording_' + elements[index] + '" data-index="' + elements[index] + '">' +
                                    '<audio id="audio_' + elements[index] + '" src="'+replies[elements[index]].src+'"  controls></audio>' +
                                    // '<i class="comment-link fa fa-comment"></i>' + 
                                '</div>'+
                                '<div class="comment_source">'+
                                    '<i class="fa fa-comment comment-link"></i>'+
                                    '<i class="fa fa-microphone recording" data-toggle="modal" data-target="#myModal1"></i>'+
                                '</div>'+
                                '<div class="remove_comment" id="'+elements[index]+'">'+
                                    '<i class="fa fa-trash trash_comment"></i>'+
                                '</div>'+
                            '</div>'+
                            '<div class="replyInput" data-id="'+elements[index]+'"></div>'

                            if ( replies[elements[index]].reply.length > 0 ) {
                                content += '<div style="margin-left:20px; margin-top:5px; margin-bottom:5px;">';
                                content += drawComments(replies[elements[index]].reply, 'reply');
                                content += '</div>';
                            }
                            
                    content+="</div></div>";
                }
            }
        })
    }


    return content;
    // $commentContainer.html(content);
}

$(document).on('click','.recording', function(){
    var data_entity = $(this).parent().parent().parent().hasClass('comment');
    if(data_entity){
        var id = $(this).parent().parent().parent().data('index');
        data_entity = 'comment';
        content =   '<div class="modal-dialog">'+
                    '<div class="modal-content" data-recordingid="'+id+'" data-entity="'+data_entity+'">'+
                        '<input onclick="startReRecording(this)" type="button" class="btn btn-primary" value="Re-Record" />'+
                        '<input onclick="stopReRecording(this)" type="button" class="btn btn-primary replyRecord" data-dismiss="modal" value="Stop" data-replyId="" />'+
                    '</div>'+
                '</div>'
    }
    else{
        var id = $(this).parent().parent().parent().data('index');
        data_entity = 'reply';
        content =   '<div class="modal-dialog">'+
                    '<div class="modal-content" data-recordingid="'+id+'" data-entity="'+data_entity+'">'+
                        '<input onclick="startReRecording(this)" type="button" class="btn btn-primary" value="Re-Record" />'+
                        '<input onclick="stopReRecording(this)" type="button" class="btn btn-primary replyRecord" data-dismiss="modal" value="Stop" data-replyId="" />'+
                    '</div>'+
                '</div>'
    }
       
    var recordData = $(this).data('target');
    console.log(recordData);
    $(recordData).html(content);
})

$(document).on('click','.trash_comment',function(){
    var id = $(this).parent().attr('id');
    var entity = $(this).parent().parent().parent().attr('class');

    if(entity=='comment'){
        deleteComments( id , 'comment' );
    }
    else{
        deleteComments( id );
    }

    $commentContainer.html(drawComments(comments));    
})


function deleteComments( index , entity = "reply" ){
    
    if ( entity == "comment" ) {
        if ( comments[index] != undefined ) {
            $.each(comments[index].reply, function ( key, value ) {
                deleteComments( value,'reply' );
            });
    
            delete comments[index];
        }
    }
    else {
        if ( replies[index] != undefined ) {
            $.each(replies[index].reply, function ( key, value ) {
                deleteComments( value );
            });
    
            delete replies[index];
        }
    }
}