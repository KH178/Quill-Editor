<html>
	<head>
		<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
		<!-- <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script> -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.5/quill.js"></script>

		<!-- file css -->
		<link rel="stylesheet" href="css/main.css">
		
		<script>
			window.URL = window.URL || window.webkitURL;
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		</script>
	</head>
	<body>
		<div class="container">
		
			<!-- end comment button -->
			<div class="col-sm-7">
				<!-- Create the editor container -->
				<div id="editor">
					<p>Hello World!</p>
					<p>Some initial <strong>bold</strong> text</p>
					<p><br></p>
				</div>
			</div>
			<div class="col-sm-5">
				<div class="row editor-right">
					<div class="col-sm-12 comment-editor">
							<span><h5>Comments</h5></span>
							<span class="" id="error"></span>
							<div class="comment_text" id="" style="">
								<textarea id="comment_text" class="" readonly></textarea>
								<i class="fa fa-check" id="check"></i>
								<i class="fa fa-close"></i>
							</div>
							<div>
								<ul class="list-group" id="comments-container">
								</ul>
							</div>
					</div>

					<!-- <div class="col-sm-12 audio-editor">
						<span><h5>Audio Record</h5></span>
						<div class="audio-btn">
							<input onclick="startRecording()" type="button" class="btn btn-primary" value="Record" />
							<input onclick="stopRecording()" type="button" class="btn btn-primary" value="Stop" />
							<input onclick="publish_edits()" type="button" class="btn btn-success" value="Save" />
						</div>
						<div id="recordings">
							<-- <div class="alert alert-success">
								Sample
							</div> ->
						</div>
					</div> -->
				</div>
			</div>
		</div>

    <div id="myModal" class="modal fade" role="dialog">
      <div class="vertical-alignment-helper">
        <div class="modal-dialog vertical-align-center" role="document">
         <!-- Modal content-->
          <div class="modal-content recorder-div">
            <p class="title">Recoder</p>
            <p class="sub">Click Record to start recording your comment.</p>
            <p class="sub1">0 Recording...</p>
            <div class="timer-div">
            <!-- <span id="hour">00</span> : -->
            <span class="min">00</span> :
            <span class="sec">00</span> :
            <span class="milisec">00</span>
            </div>
            <div class="recorder-record-btn">
              <input onclick="startRecording()" type="button" class="btn btn-primary" value="Record" />
            </div>
            <div class="recorder-stop-record-btn">
              <input type="button" class="btn btn-primary" value="Stop" data-dismiss="modal">
            </div>
              <!-- <input onclick="stopRecording()" type="button" class="btn btn-primary" data-dismiss="modal" value="Stop" /> -->
              <div class="modal-close-btn" data-dismiss="modal" onclick="stopRecording()">X</div>
          </div>
        </div>
      </div>
    </div>  

    <!--------- REply --->
    <div id="myModal1" class="modal fade" role="dialog">
        
    </div>
    
	</body>
	<script type="text/javascript" src="js/recorder.js"></script>
	<script type="text/javascript" src="js/comment.js"></script>
	<script>

    var x;
    var startstop = 0;
		var milisec = 0;
    var sec = 0; 
    var min = 0;
    var hour = 0;

    // function startStop() { /* Toggle StartStop */
    //   startstop = startstop + 1;
    //   if (startstop === 1) {
    //     start();
    //     document.getElementById("start").innerHTML = "Stop";
    //   } else if (startstop === 2) {
    //     document.getElementById("start").innerHTML = "Start";
    //     startstop = 0;
    //     stop();
    //   }
    // }

    function start(id) {
      x = setInterval(()=>timer(id), 10);
    } /* Start */

    function stop(id) {
      clearInterval(x);
      milisec = 0;
      sec = 0; 
      min = 0;
      hour = 0;
      timer(id)
    } /* Stop */

    function timer(id) {
  /* Main Timer */
      miliSecOut = checkTime(milisec);
      secOut = checkTime(sec);
      minOut = checkTime(min);
      // hourOut = checkTime(hour);

      milisec = ++milisec;
      if (milisec === 100) {
        milisec = 0;
        sec = ++sec;
      }
      if (sec == 60) {
        min = ++min;
        sec = 0;
      }
      if (min == 60) {
        min = 0;
        hour = ++hour;
      }
  
      $(`#${id}`).find(".milisec").html(miliSecOut);
      $(`#${id}`).find(".sec").html(secOut);
      $(`#${id}`).find(".min").html(minOut);
      // document.getElementById("hour").innerHTML = hourOut;
      
  }

  function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

$('#myModal').on('hidden.bs.modal', function () {
  stopRecording();
});
	// Recorder
var onFail = function(e) {
  console.log('Rejected!', e);
};

var onSuccess = function(s) {
  console.log(s);
  var context = new AudioContext();
  var mediaStreamSource = context.createMediaStreamSource(s);
  recorder = new Recorder(mediaStreamSource);
  recorder.record();
}

var recorder;
var audio = document.querySelector('audio');

// let timer = 0;
let intervalTimer;
function startRecording() {
  let id = $(event.target).closest('.modal').attr('id');
  $(event.target).closest('.modal');
  console.log($(event.target).closest('.modal').attr('id'));
  start($(event.target).closest('.modal').attr('id'));
  if (window.selection_range.length > 0) {
    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: true}, onSuccess, onFail);
    } else {
      console.log('navigator.getUserMedia not present');
    }
  }
  $(`#${id}`).find('.recorder-stop-record-btn').css('display','block');
  $(`#${id}`).find('.sub1').css('display','block');
  $(`#${id}`).find('.sub').css('display','none');
  $(`#${id}`).find('.recorder-record-btn').css('display','none');
}

function stopRecording() {
  let id = $(event.target).closest('.modal').attr('id');
  console.log($(event.target).closest('.modal').attr('id'));
  stop($(event.target).closest('.modal').attr('id'));
  
  $(`#${id}`).find('.recorder-stop-record-btn').css('display','none');
  $(`#${id}`).find('.sub').css('display','block');
  $(`#${id}`).find('.sub1').css('display','none');
  $(`#${id}`).find('.recorder-record-btn').css('display','block');
  if(recorder){
  recorder.stop();
  recorder.exportWAV(function(blob) {
  range = quill.getSelection();
    if (range) {
      
      text = quill.getText(range.index, range.length);
      var type = "record";
      var $commentContainer = $("#comments-container");
      var audio_src = window.URL.createObjectURL(blob);
      var record = new Data(blob, type, by, date, range , text, audio_src)
      comments.unshift(record);
      $commentContainer.html(drawComments(comments,entity="comment"));

      // comments[key].src.unshift(audio_src);
      // add marked selection to global list
      // window.marked_selections.push([window.selection_range, blob]);
      
      
      // $commentContainer.append('<div class="main_container main-comment-container comment-link"><div class="alert-success" id="recording_' + data_index + '" data-index="' + data_index + '"' + 
      //               'onmouseover="format_selection('+sel_index+', '+sel_length+')"' + 
      //               'onmouseout="remove_selection_format('+sel_index+', '+sel_length+')">' + 
      //               '<audio id="audio_' + data_index + '" controls autoplay></audio>' +
      //               '<i class="comment-link fa fa-comment"></i>' + 
      //             '</div></div>');
      // // var data_index = window.marked_selections.length;
      // var data_index = comments.length - 1;
      // $('#audio_'+data_index).prop('src', audio_src);
    }
  });
  }
}

function startReRecording(recordId) {
  var index = $(recordId).parent().data('recordingid');
  var entity = $(recordId).parent().data('entity');
  if(entity=='comment'){
    var selected_range = comments[index].range; 
  }
  else{
    var selected_range = replies[index].range;
  }
  if (selected_range.length > 0) {
    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: true}, onSuccess, onFail);
    } else {
      console.log('navigator.getUserMedia not present');
    }
  }
}

function stopReRecording(recordId){
  var index = $(recordId).parent().data('recordingid');
  var entity = $(recordId).parent().data('entity');
  recorder.stop();
  recorder.exportWAV(function(blob) {
    var type = 'replyRecord';
    var audio_src = window.URL.createObjectURL(blob);
    var record = new Data(blob, type, by, date, range , text, audio_src)
    replies.push(record);

    if ( entity == 'comment' ) {
        comments[index].reply.push( replies.length - 1 );
    } else {
        replies[index].reply.push( replies.length - 1 );
    }

    $commentContainer.html(drawComments(comments));
    
  });
}

function publish_edits() {

  console.log('uploading...');
  var data = new FormData();
  for (var i = 0; i < window.marked_selections.length; i++) {
    var element = window.marked_selections[i];
    data.append('file[]', element[1]);
  }

  $.ajax({
    url : "save.php",
    type: 'POST',
    data: data,
    contentType: false,
    processData: false,
    success: function(data) {
      console.log(data);
      console.log("uploaded!");
    },    
    error: function(data) {
      console.log(data);
    }
  });
}

// Quill Editor


	var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    // ['blockquote'],
    [{ list: "ordered" }], //, { list: "bullet" }
    // [{ script: "sub" }, { script: "super" }], // superscript/subscript
    // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    // [{ direction: "rtl" }], // text direction

    // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    // [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    // [{ font: [] }],
    // [{ align: [] }],

    ["clean"] // remove formatting button
  ];
  var quill = new Quill('#editor', {
  modules: {
      toolbar: toolbarOptions
    },
  theme: 'snow'
});



window.marked_selections = [];
window.selection_range = [];

quill.on('selection-change', function(range, oldRange, source) {
  if (range) {
    if (range.length == 0) {
      console.log('User cursor is on', range.index);
      window.selection_range = [];
      $("#start_record").prop('disabled', true);
    } else {
      window.selection_range = [range.index, range.length];
      var text = quill.getText(range.index, range.length);
      console.log('User has highlighted', text, window.selection_range);
      $("#start_record").prop('disabled', false);
    }
  } else {
    console.log('Cursor not in the editor');
  }
});

function remove_selection_format(index, length) {
  quill.removeFormat(index, length);
  quill.enable();
}

function format_selection(index, length) {
  var format = {
    'background': 'yellow',
    'italic' : true
  }
  quill.formatText(index, length, format);
  quill.enable();
}


	</script>
</html>