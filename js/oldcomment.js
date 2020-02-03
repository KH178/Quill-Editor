var metaData = []; 
var reply = [];
var comments = [];
var range;
var text;
var by;
var replyText = [];
var comment_button = '<span class="ql-formats"><button type="button" class="ql-clean" id="comment-button"><i class="fa fa-comment"></i></button></span>';
var record_btn = '<span class="ql-formats"><button type="button" class="ql-clean" id="comment-button"><i class="fa fa-record"></i></button></span>';
$(document).ready(function(){
    $('.ql-toolbar').append(comment_button);
    $('.ql-toolbar').append(record_btn);
})

$(document).on("click", "#comment-button", function() {

  

      range = quill.getSelection();
        if (range) {
          if (range.length === 0) {
            alert("Please select text", range.index);
          } else {
            text = quill.getText(range.index, range.length);

            // console.log("User has highlighted: ", text);
            quill.formatText(range.index, range.length, {
              background: "#fff72b"
            });
            // var hide_div = '<div id="div_hidden" data-range="'+range.index+'" data-length="'+range.length+'"></div>';
          
            //     $('.comment-editor').append(hide_div);
            
            if(text){
              $('.comment_text').show()
              $('.comment_text').find('textarea').css({'height':'80px'}).focus().removeAttr('readonly','false');
              $('.comment_text').find('i').show();
            }
            //  click on check button
            
          }
          
        } else {
          alert("User cursor is not in editor");
        }
  });

  $('#check').on('click',function(){
    var commentDiv = document.getElementById('comment_text');
    var commentData = document.getElementById('comment_text').value;
    if(commentData == null  || commentData == ""){
      var error = document.getElementById('error');
      $(error).empty();
      error.append("Comment Please");
      // console.log(error);
    }
    else{
      var comment = new Comment( commentData ,by, date, range , text  )
      // console.log(commentData);
      metaData.push(comment);
      console.log(metaData);
       drawComments(metaData);
    }
    range = null;
    $('#comment_text').val('').empty().css({'height':'50px'}).attr('readonly','true');
    $('.comment_text').find('i').hide();
  });

  function commentText(text_cm){
      
  }
  function drawComments(metaData) {
    var i = 0;
    var $commentContainer = $("#comments-container");
    var content = "";
    // var replyCommited = document.getElementsByClassName('replyCommited');

    // console.log(replyText);
    $.each(metaData, function(index, value  ) {
      // console.log(index);
      // var reply = replyComments();
      // var replyValue = $("input[name=replys]").val();
      content +=
        "<div class=''><div class='comment-link' href='#' data-index='" +
        index + 
        "'><div class='main-comment-container'><div class='comment-info'><div class='comment-user'>Sanjeev </div><div class='comment-time'> Today "+date+"</div> </div><div class='value-comment'>" + value.comment +
        "</div></div></div><div class='replyInput' data-id='"+i+"'>";
        $.each(value.reply, function(j , q){
          inc = 0;
          content+="<div class='replyCommited'>"+q.comment+"<i style='position:absolute;right:5%;' id='"+j+"' class='replyBtn fa fa-reply'></i></div>";
        });
        // if(replyText == undefined){
        //   // console.log(replyText);
        //   console.log("error");
        // }
        // else{
        //   content+="<div class='replyCommited'>"+Comment.reply+"</div>";
        // }
        content+="</div></div>";
        i++;
    });
    $commentContainer.html(content);
  }
   
    $(document).on('click','.comment-link',function () {
        var index = $(this).data('index');
        console.log("comment link called",index);
        var data = metaData[index];
        console.log(data);
        quill.setSelection(data.range.index, data.range.length);
        var id = $(this).parent().find('.replyInput');
        console.log(id) ;

        var replySection = $(this).next().children().hasClass('replySection');
        console.log(replySection);
        if(replySection==true){
          console.log('reply check 1 works');

          // if(replyValue == undefined){
          //   console.log('sanjeev');
          // }
          // else{
          //   replyComments(index, id);
          // }
        }
        else{
          replyComments(index, id);
          console.log('else works chk 2');
          // console.log("sanjeev");
        }

       
        
        // var replyValue = $(this).find('.comment_form').val();
        // console.log(replyValue);

     
      
    });

    class Comment{
      constructor( commentData="" , by="", date="", range="", text="" ){
        this.range = range,
        this.comment = commentData,
        this.by = by,
        this.selectedText = text,
        this.reply = [],
        this.date = date
        // this.date = date
      }
    }

    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var date = hours + ':' + minutes + ' ' + ampm;
    console.log(date);

    function replyComments(index, id){
      // var id = document.getElementById('id')
      // var  replyComments = new Comment('Sanjeev');
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
      var lkk = $(id).append(node);
      console.log(lkk);
      
      // var  submitComment = id.append("<li>"+replyComments.comment+"</li>");
    }

    $(document).on('click','.replySubmit', function(){
      var id = $(this).parent().closest('.replyInput').data('id');
      console.log(id);
      replyT = document.comment_reply.reply.value;
      if(replyT == '' || replyT == undefined){
        console.log("please comment");
      }
      else{
        // comments.push({reply : replyT});
        console.log(replyT);
        var reply = new Comment(replyT, "sanjeev", date)
        metaData[id].reply.push(reply);
        
        console.log(metaData);
        // return false;
        drawComments(metaData)
      }
    })

    $(document).on('click','.replyBtn',function(){
      var index = $(this).attr("id");
      console.log(index);
      var id = $(this).parent();
      console.log(id);

      var replySection = $(this).parent().hasClass('replySection');
        console.log(replySection);
        if(replySection==true){
          console.log('reply check 1 works');

          // if(replyValue == undefined){
          //   console.log('sanjeev');
          // }
          // else{
          //   replyComments(index, id);
          // }
        }
        else{
          replyComments(index, id);
          console.log('else works chk 2');
          // console.log("sanjeev");
        }
      
    })

    // const comment_container = new Comment('sanjeev kumar is the best', 'Sanjeev Kumar', 'Choose the best Player');
    // console.log(sanj);
