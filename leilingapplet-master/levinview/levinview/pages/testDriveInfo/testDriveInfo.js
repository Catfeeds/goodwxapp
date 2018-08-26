var app = getApp()
Page({
  data: {
    imagesUrl: app.data.picUrl,
    city: "选择城市",
    // 省市信息
    arrayPro: [],
    provinceInfo: [],
    arrayCity: [],
    cityInfo: [],
    show: true,
    photoURL: app.data.picUrl + "photo.jpg",
    // 登录
    showLogin: false,
    // 4S接待人员姓名
    name: '',
    // 试驾人员姓名
    name2: '',
    // 手机号
    mobile: "",
    mobile2: "",
    mobileUser: '',
    // 验证码
    verifycode: "",
    // openid
    openid: '',
    // 上传图片
    uploadPicURL: app.data.picUrl + "pic.png",
    // 图片名字
    filename: '',
    // 地址
    val: [],
    // 验证码倒计时
    yzm: "获取验证码",
    getCode: "getCode",
    // input  聚焦
    focus: false,
    color: "#621192",
    showrole: true,
    allCity: {}
  },
  // 活动规则
  getRole: function () {
    this.setData({
      showrole: !(this.data.showrole)
    })
  },
  closeRole: function () {
    this.setData({
      showrole: !(this.data.showrole)
    })
  },
  // 确定地址
  confirm: function () {
    if (this.data.val[0] == 0 || this.data.val[0] == 7) {
      this.setData({
        show: (!this.data.show),
      })
    } else {
      this.setData({
        show: (!this.data.show),
        city: this.data.arrayCity[this.data.val[1]],
      })
      wx.setStorage({
        key: 'city',
        data: this.data.arrayCity[this.data.val[1]],
      })
    }
  },

  // 换头像
  updatePhoto: function () {
    this.setData({
      showLogin: true
    })
  },
  close2: function () {
    this.setData({
      showLogin: false
    })
  },
  switchCity: function () {
    this.setData({
      show: (!this.data.show)
    })
  },
  bindChange: function (e) {
    const val = e.detail.value

    getCity(this, val[0], this.data.provinceInfo, val)

  },
  // 键盘下拉
  keyDown: function (e) {
    var val = e.detail.value
    if (val.length == 4) {
      wx.hideKeyboard()
    }
  },

  // 提交
  submit: function () {
    var that = this
    if (this.data.name.length == 0) {
      wx.showToast({
        title: '请输入4S接待人员姓名',
      })
    } else if (!(/^1[34578]\d{9}$/.test(this.data.mobile2))) {
      wx.showToast({
        title: '请输入正确格式的4S人员手机号',
      })
    } else if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
      wx.showToast({
        title: '请输入您的正确格式的手机号',
      })
    } else if (that.data.uploadPicURL == app.data.picUrl + "pic.png") {
      wx.showToast({
        title: '请先上传图片',
      })
    } else {
      wx.request({
        url: app.data.requestUrl + '/leilingapplet/public/index.php/index/User/testDrive',
        method: "POST",
        data: {
          "staff_name": that.data.name,
          "staff_phone": that.data.mobile2,
          "user_phone": that.data.mobile,
          "img": that.data.filename,
          "orderid": that.options.orderid,
          "openid": that.data.openid
        },
        success: function (res) {
          if (res.data.error == 0) {
            wx.redirectTo({
              url: '../lookTestDriveInfo/lookTestDriveInfo',
            })
          } else {
            wx.showToast({
              title: '信息提交出错',
            })
          }
        }
      })

    }
  },
  // 上传图片
  uploadPic: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          uploadPicURL: tempFilePaths
        })
        // 上传图片
        wx.uploadFile({
          url: app.data.requestUrl + '/leilingapplet/public/index.php/index/User/uploadFile/', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var filename = JSON.parse(res.data).filename
            that.setData({
              filename: filename
            })
          }
        })
      }
    });
  },
  // 测试4S人员名字
  testSName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 测试人员名字
  testName: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 测试手机号
  testMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 测试手机号
  testMobile2: function (e) {
    var val = e.detail.value
    if (val.length == 11) {
      wx.hideKeyboard()
    }
    this.setData({
      mobile2: e.detail.value
    })
  },
  // 测试验证码
  testVerifycode: function (e) {
    this.setData({
      verifycode: e.detail.value
    })
  },
  // 获取验证码
  getCode: function () {
    var _this = this;
    if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
      wx.showToast({
        title: '手机号格式不正确',
        image: '',
        duration: 2000
      })
    } else {
      wx.request({
        url: app.data.requestUrl + 'leilingapplet/public/index.php/index/User/CreateVerificationCode/',
        method: "GET",
        data: { "telephone": _this.data.mobile },
        success: function (d) {
          var data = d.data.verifycode
          if (data == 0) {
            wx.showToast({
              title: '不好意思,请稍后重试',
            })
          } else {
            var index = 59
            _this.setData({
              yzm: index + "s",
              getCode: "",
              focus: true,
              color: "#ccc"
            })
            var timer = setInterval(function () {
              if (index == 1) {
                clearInterval(timer)
                _this.setData({
                  yzm: "获取验证码",
                  getCode: "getCode",
                  color: "#621192"
                })
              } else {
                _this.setData({
                  yzm: --index + "s"
                })
              }
            }, 1000)
          }
        }
      })
    }
  },

  onLoad: function () {
    var that = this
    //显示头像
    // 获取手机号
    wx.getStorage({
      key: 'mobile',
      success: function (res) {
        that.setData({
          mobile: res.data,
          mobileUser: change(res.data)
        })
      }
    })
    wx.getStorage({
      key: 'city',
      success: function (res) {
        that.setData({
          city: res.data
        })
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
      }
    })
    // 获取省
    wx.request({
      url: app.data.requestUrl + '/leilingapplet/public/index.php/index/User/getProvince',
      success: function (data) {
        var allCity = data.data.city
        var data = data.data.province
        var province = [];
        for (var i = 0; i < data.length; i++) {
          province.push(data[i].province_name)
        }
        that.setData({
          arrayPro: province,
          provinceInfo: data,
          allCity: allCity
        })
      }
    })
  },
  // 账号登录
  user_login: function () {
    var _this = this
    if (this.data.verifycode.length == 0) {
      wx.showToast({
        title: '请输入验证码'
      })
    } else {
      wx.request({
        url: app.data.requestUrl + 'leilingapplet/public/index.php/index/User/userLogin',
        method: "POST",
        data: {
          'telephone': _this.data.mobile,
          'city': _this.data.city,
          'verificationcode': _this.data.verifycode,
          'openid': _this.data.openid
        },
        success: function (d) {
          var data = d.data
          if (data.error == 0) {
            wx.showToast({
              title: data.message,
              image: '',
              duration: 2000
            })
            _this.setData({
              showLogin: false,
              mobileUser: change(_this.data.mobile)
            })
            wx.setStorage({
              key: 'mobile',
              data: _this.data.mobile,
            })
          } else {
            wx.showToast({
              title: data.message,
              image: '',
              duration: 2000
            })
          }
        }
      })
    }
  }
})
// 获取市
function getCity(that, i, data, val) {
  var allCity = that.data.allCity
  var x
  var arr = []
  for (x in allCity) {
    if (x == data[i].province_code) {
      var simpleCity = allCity[x]
      console.log(simpleCity.length)
      for (var k = 0; k < simpleCity.length; k++) {
        arr.push(simpleCity[k].city_name)
      }
    }
  }
  that.setData({
    arrayCity: arr,
    val: val
  })
}

function change(str) {
  var s = ""
  for (var i = 0; i < 3; i++) {
    s += str[i];
  }
  for (var i = 3; i < 7; i++) {
    s += "*"
  }
  for (var i = 7; i < 11; i++) {
    s += str[i]
  }
  return s;
}


