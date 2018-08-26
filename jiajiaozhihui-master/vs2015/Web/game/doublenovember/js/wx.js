﻿
wx.ready(function () {

    var images = {
        localId: [],
        serverId: []
    };
    // 选择图片
    $("#chooseImage").click(function () {
        wx.chooseImage({
            success: function (res) {
                images.localId = res.localIds;
                $("#previewImage").attr("src", images.localId[0]);
                $("#prompt").css("display", "none");
            }
        });
    });
    // 上传图片
    $("#uploadImage").click(function () {
         if ($("#resume").val() == "" || $("#resume").val().length<10) {
	    $("#promptModal .modal-body").text("请写入你的感想，不要小于10字");	
            $("#promptModal").modal("show");
            return;
        }
        if (images.localId.length == 0) {
            $("#promptModal .modal-body").text("请先选择图片");
            $("#promptModal").modal("show");
            return;
        }
        var i = 0, length = images.localId.length;
        images.serverId = [];
        upload(length);
    });

    

    var imageNum = 0;
    //上传至微信服务器
    function upload(length) {
        wx.uploadImage({
            localId: images.localId[imageNum],
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                imageNum++;
                images.serverId.push(res.serverId);
                uploadServer(res.serverId);
            },
            fail: function (res) {
                alert("error:" + JSON.stringify(res));
            }
        });
    }
    //上传到服务器
    function uploadServer(mediaId) {
        $.ajax({
            url: "http://weixin.jiajiaozhihui.cn/game/doublenovember/server/partin.ashx",
            type: "POST",
            dataType: "text",
            data: { 'folder': '' + $("#hfOpenID").val() + '', 'resume': '' + $("#resume").val() + '', 'mediaId': '' + mediaId + '' , 'owner': '' + $("#owner input:radio:checked").val() + ''},
            beforeSend: function () {
                $("#cover").css("display", "block");
            },
            complete: function () {
                $("#cover").css("display", "none");
            },
            success: function (data) {
                images.localId = [];
                images.serverId = [];
                var uploadAlert = new UploadAlert();
                if (data == "") {
                    //$(document.body).append(uploadAlert.alertSuccess())
                    $("#promptModal .modal-body").text("上传成功");
                    $("#promptModal").modal("show");
                } else {
                    //$(document.body).append(uploadAlert.alertWarning())
                    $("#promptModal .modal-body").text("上传失败");
                    $("#promptModal").modal("show");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }
})
wx.error(function (res) {
    alert(res.errMsg);
});

function UploadAlert(){
    this.template = '<div class="alert @alert_type alert-dismissible upload-prompt" role="alert">'
                            +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                            + '<strong>@alert_title!</strong>@alert_content'
                            +'</div>';

};
UploadAlert.prototype.alertWarning = function () {
    var result = this.template.replace("@alert_type", "alert-danger")
                            .replace("@alert_title", "提示")
                            .replace("@alert_content", "上传失败！");
    return result;
};
UploadAlert.prototype.alertSuccess = function () {
    var result = this.template.replace("@alert_type", "alert-danger")
                            .replace("@alert_title", "提示")
                            .replace("@alert_content", "上传成功！");
    return result;
}