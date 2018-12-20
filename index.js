var data_json,key;
var data_query;
function load_file(){
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){
        var data_str = "";        
        var list_str = "";
        data_json = JSON.parse(this.result);
        key = Object.keys(data_json[0]);
        data_str += "<tr>";
        for(var i=0;i<key.length;i++){
            list_str += '<option value="' +i.toString() + '">' + key[i] + "</option>";
            data_str += "<td>" + key[i] + "</td>";
        }
        data_str += "</tr>";
        for(var i=0;i<data_json.length;i++){
            data_str += "<tr>";
            for(var j=0;j<key.length;j++){
                data_str += "<td>" + data_json[i][key[j]] + "</td>";
            }
            data_str += "</tr>";
        }
        $("#data").html(data_str);
        $("#select").html(list_str);
        $("#select2").html(list_str);

    };
}
function query(){
    var key_word = $("#key_word").val();
    var schema = $("#select").val();
    var data_str = "<tr>";
    for(var i=0;i<key.length;i++){
        data_str += "<td>" + key[i] + "</td>";
    }
    data_str += "</tr>";
    for(var i=0;i<data_json.length;i++){
        if(data_json[i][key[schema]] == key_word){
            data_str += "<tr>";
            for(var j=0;j<key.length;j++){
                data_str += "<td>" + data_json[i][key[j]] + "</td>";
            }
            data_str += "</tr>";
        }
    }
    $("#data").html(data_str);
}
function init(){
    $("#query").click(query);
}
$(document).ready(init,false)