var MSG_TYPE_ATTENTION = "attention",
MSG_TYPE_ERROR = "error",
MSG_TYPE_OK = "ok",
MSG_TYPE_TIPS = "tips",
MSG_TYPES = [MSG_TYPE_ATTENTION, MSG_TYPE_ERROR, MSG_TYPE_OK, MSG_TYPE_TIPS],
INPUT_FLAG = "J_Field",
TEMP = "&nbsp",
TRegister = {};
String.prototype.trim = function() {
    var a = /^\s+|\s+$/g;
    return function() {
        return this.replace(a, "")
    }
} ();
KISSY.add("tb-register",
function(S) {
    var D = S.DOM,
    E = S.Event,
    doc = document;
    D.get = function(id) {
        return document.getElementById(id)
    };
    var timer, timerCheckForm, countDown = function(id) {
        if (timer) {
            window.clearInterval(timer)
        }
        var btn = D.get(id);
        var num = parseInt(btn.getAttribute("count")) || 60;
        btn.disabled = true;
        var handle = function() {
            if (num <= 0) {
                if (timer) {
                    window.clearInterval(timer)
                }
                btn.disabled = false;
                btn.value = "\u91cd\u65b0\u53d1\u9001\u6821\u9a8c\u7801";
                return
            }
            num--;
            btn.value = num + "\u79d2\u540e\u70b9\u6b64\u91cd\u65b0\u53d1\u9001"
        };
        timer = setInterval(handle, 1000)
    };
    function createXHR() {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        } else {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP")
            } catch(e) {}
        }
        return xhr
    }
    function ajax(url, callback, options, callbackParams) {
        if (!url) {
            return NULL
        }
        var xhr = createXHR();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                try {
                    var data = S.trim(xhr.responseText),
                    r;
                    if (/<html>/i.test(data)) {
                        alert("\u8bf7\u6c42\u72b6\u6001\u6709\u5f02\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002");
                        return
                    }
                    if (data.indexOf("{") > -1) {
                        data = eval.call(window, "(" + data + ")")
                    }
                    callback(data, callbackParams)
                } catch(e) {}
                xhr = null
            }
        };
        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(options);
        return xhr
    }
    function disabledAlipay() {
        D.get("create-alipay").checked = false;
        D.get("create-alipay").disabled = true
    }
    function checkAlipay() {
        D.get("create-alipay").disabled = false
    }
    function alipayCheckValue() {
        var alipay_field = D.get("create-alipay");
        return ( !! alipay_field) ? (alipay_field.disabled ? "": alipay_field.checked) : ""
    }
    function is_hidden(selector) {
        return !! selector ? D.hasClass(selector, "vhide") : true
    }
    TRegister = {
        common: {
            ajaxCreate: function(api, option, callback, callbackParams) {
                if (!api) {
                    return
                }
                api = api + "_input_charset=utf-8&t=" + new Date().getTime();
                ajax(api, callback, option, callbackParams)
            },
            pickDocumentDomain: function() {
                var k = arguments[1] || location.hostname;
                var j = k.split("."),
                h = j.length;
                var i = arguments[0] || (h < 3 ? 0 : 1);
                if (i >= h || h - i < 2) {
                    i = h - 2
                }
                return j.slice(i).join(".")
            },
            getCharCount: function(str) {
                var sum = 0;
                for (var i = 0, len = str.length; i < len; i++) {
                    if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255)) {
                        sum = sum + 1
                    } else {
                        sum = sum + 2
                    }
                }
                return sum
            },
            toParamString: function(obj) {
                if (S.isString(obj)) {
                    return obj
                }
                var result = [];
                for (var key in obj) {
                    var value = obj[key];
                    if (S.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value[i]))
                        }
                    } else {
                        if (S.isFunction(value)) {
                            result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value()))
                        } else {
                            result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
                        }
                    }
                }
                return result.join("&")
            },
            gCheckPassword: function(password) {
                var _score = 0;
                if (!password) {
                    return 0
                }
                if (password.length <= 4) {
                    _score += 5
                } else {
                    if (password.length >= 5 && password.length <= 7) {
                        _score += 10
                    } else {
                        if (password.length >= 8) {
                            _score += 25
                        }
                    }
                }
                var _UpperCount = (password.match(/[A-Z]/g) || []).length;
                var _LowerCount = (password.match(/[a-z]/g) || []).length;
                var _LowerUpperCount = _UpperCount + _LowerCount;
                if (_UpperCount && _LowerCount) {
                    _score += 20
                } else {
                    if (_UpperCount || _LowerCount) {
                        _score += 10
                    }
                }
                var _NumberCount = (password.match(/[\d]/g, "") || []).length;
                if (_NumberCount > 0 && _NumberCount <= 2) {
                    _score += 10
                } else {
                    if (_NumberCount >= 3) {
                        _score += 20
                    }
                }
                var _CharacterCount = (password.match(/[!@#$%^&*?_\.\-~]/g) || []).length;
                if (_CharacterCount == 1) {
                    _score += 10
                } else {
                    if (_CharacterCount > 1) {
                        _score += 25
                    }
                }
                if (_NumberCount && _LowerUpperCount) {
                    _score += 2
                } else {
                    if (_NumberCount && _LowerUpperCount && _CharacterCount) {
                        _score += 3
                    } else {
                        if (_NumberCount && (_UpperCount && _LowerCount) && _CharacterCount) {
                            _score += 5
                        }
                    }
                }
                return _score
            },
            getResultDesp: function(score) {
                if (score <= 5) {
                    return "\u592a\u77ed"
                } else {
                    if (score > 5 && score <= 20) {
                        return "\u5f31"
                    } else {
                        if (score > 20 && score < 60) {
                            return "\u4e2d"
                        } else {
                            if (score >= 60) {
                                return "\u5f3a"
                            } else {
                                return ""
                            }
                        }
                    }
                }
            },
            find_selected_option: function(select) {
                if (!select) {
                    return
                }
                var options = select.options;
                for (var i = 0, len = options.length; i < len; i++) {
                    option = options[i];
                    if (option.selected) {
                        return option
                    }
                }
            },
            hide_alipay_contract: function() { ! D.hasClass("#J_RegForm .alipay-field", "vhide") && D.addClass("#J_RegForm .alipay-field", "vhide");
                D.get("create-alipay").disabled = true
            },
            show_alipay_contract: function() {
                D.removeClass("#J_RegForm .alipay-field", "vhide");
                D.get("create-alipay").disabled = false
            }
        },
        app: {
            currentTarget: null,
            currentInput: null,
            Popup: function(id, maskId, config) {
                var popupDialog = {},
                mask, dialog = D.get(id);
                if (maskId) {
                    mask = D.get(maskId)
                }
                popupDialog.show = function() {
                    var bHeight = dialog.offsetHeight;
                    bTop = doc.documentElement.clientHeight / 2 + doc.documentElement.scrollTop - bHeight / 2,
                    bWidth = dialog.offsetWidth || parseInt(dialog.style.width);
                    dialog.style.top = bTop + "px";
                    dialog.style.left = (doc.documentElement.clientWidth - bWidth) / 2 + "px";
                    dialog.style.visibility = "visible";
                    if (mask) {
                        var viewHeight = (doc.documentElement.scrollHeight >= doc.documentElement.clientHeight ? doc.documentElement.scrollHeight: doc.documentElement.clientHeight) + "px";
                        var viewWidth = (doc.documentElement.scrollWidth >= doc.documentElement.clientWidth ? doc.documentElement.scrollWidth: doc.documentElement.offsetWidth) + "px";
                        mask.style.height = viewHeight;
                        mask.style.width = viewWidth;
                        mask.style.visibility = "visible"
                    }
                };
                popupDialog.hide = function() {
                    dialog.style.visibility = "hidden";
                    if (mask) {
                        mask.style.visibility = "hidden"
                    }
                };
                E.on(D.query(".J_Close", dialog), "click",
                function(e) {
                    popupDialog.hide();
                    e.halt()
                });
                return popupDialog
            },
            AbstractField: function(fieldId) {
                var field = D.get(fieldId),
                inputs = D.query("." + INPUT_FLAG, field),
                input = inputs[0];
                E.on(inputs, "focus",
                function(e) {
                    var target = e.currentTarget;
                    TRegister.app.currentInput = target;
                    D.removeClass(target, MSG_TYPE_ERROR);
                    if (!input.value.trim().length) {
                        var msgBox = D.query(".msg", field)[0];
                        if (msgBox) {
                            msgBox.className = "msg show-" + MSG_TYPE_ATTENTION
                        }
                    }
                    setTimeout(function() {
                        D.addClass(field, "hover")
                    },
                    200)
                });
                E.on(inputs, "blur",
                function(e) {
                    setTimeout(function() {
                        D.removeClass(field, "hover")
                    },
                    200)
                });
                return {
                    field: field,
                    input: input,
                    currentValue: "",
                    localValidate: false,
                    hasSubmit: false,
                    isChanged: function() {
                        var flag = false,
                        value = input.value.trim();
                        if (this.currentValue !== value) {
                            TRegister.app.currentTarget = this;
                            this.localValidate = false;
                            this.currentValue = value;
                            this.hasSubmit = false;
                            return true
                        }
                        return false
                    },
                    focus: function() {
                        input.focus()
                    },
                    showMsg: function(type, text) {
                        var msgBox = D.query(".msg", field)[0];
                        if (!msgBox) {
                            return
                        }
                        msgBox.className = "msg show-" + type;
                        var p = D.query("." + type, msgBox)[0];
                        p.innerHTML = text || p.innerHTML;
                        if (MSG_TYPE_ERROR === type) {
                            D.hasClass(this.input, MSG_TYPE_ERROR) ? null: D.addClass(this.input, MSG_TYPE_ERROR)
                        } else {
                            D.hasClass(this.input, MSG_TYPE_ERROR) ? D.removeClass(this.input, MSG_TYPE_ERROR) : null
                        }
                    },
                    writeMsg: function(type, text) {
                        var msgBox = D.query(".msg", field)[0];
                        if (!msgBox) {
                            return
                        }
                        var p = D.query("." + type, msgBox)[0];
                        p.innerHTML = text || p.innerHTML
                    },
                    hideMsg: function() {
                        D.query(".msg", field)[0].className = "msg";
                        D.hasClass(this.input, MSG_TYPE_ERROR) ? D.removeClass(this.input, MSG_TYPE_ERROR) : null
                    }
                }
            },
            AjaxField: function(filed, config) {
                var opt = {
                    remoteValidateUrl: "",
                    appName: "",
                    postParams: {}
                };
                config = S.merge(opt, config);
                var AjaxFieldObj = new TRegister.app.AbstractField(filed),
                self = AjaxFieldObj,
                self = AjaxFieldObj;
                AjaxFieldObj.callback = function(result, callback) {
                    TRegister.app.currentTarget = null;
                    if (result.success) {
                        self.currentValue = self.input.value.trim();
                        self.localValidate = true;
                        self.clienValidate = true;
                        self.showMsg(MSG_TYPE_OK, TEMP)
                    } else {
                        self.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason] || result.reason)
                    }
                    callback.fn.call(this, result, callback.args)
                };
                AjaxFieldObj.clienValidate = false;
                AjaxFieldObj.ajaxCheckInit = function(conditionFn, callback, callbackParams) {
                    var postBody = TRegister.common.toParamString(config.postParams);
                    var value = self.input.value.trim();
                    if (value == "") {
                        self.clienValidate = false;
                        self.localValidate = false;
                        self.currentValue = "";
                        self.writeMsg(MSG_TYPE_ERROR, config.appName + "\u4e0d\u80fd\u4e3a\u7a7a\u3002")
                    } else {
                        if (S.isFunction(conditionFn)) {
                            var flag = conditionFn();
                            if (self.isChanged() && flag) {
                                self.localValidate = false;
                                self.clienValidate = true;
                                TRegister.common.ajaxCreate(config.remoteValidateUrl, postBody, self.callback, {
                                    fn: callback,
                                    args: callbackParams
                                })
                            } else {
                                self.clienValidate = false;
                                if (self.alipayExisted && !self.localValidate) {
                                    self.showMsg(MSG_TYPE_TIPS)
                                } else {
                                    if (!self.localValidate) {
                                        self.showMsg(MSG_TYPE_ERROR)
                                    }
                                }
                            }
                        } else {
                            if (self.isChanged() && conditionFn) {
                                self.localValidate = false;
                                self.clienValidate = true;
                                TRegister.common.ajaxCreate(config.remoteValidateUrl, postBody, self.callback, {
                                    fn: callback,
                                    args: callbackParams
                                })
                            } else {
                                self.clienValidate = false;
                                if (self.alipayExisted && !self.localValidate) {
                                    self.showMsg(MSG_TYPE_TIPS)
                                } else {
                                    if (!self.localValidate) {
                                        self.showMsg(MSG_TYPE_ERROR)
                                    }
                                }
                            }
                        }
                    }
                };
                AjaxFieldObj.send = function(form) {
                    if (!form) {
                        return
                    }
                    for (el in form.elements) {
                        config.postParams[form.elements[el].name] = form.elements[el].name.value
                    }
                };
                AjaxFieldObj.addAjaxEvent = function(fireEl, eventType, conditionFn, callback, callbackParams) {
                    if (self.input.value.trim().length) {
                        self.ajaxCheckInit(conditionFn, callback, callbackParams)
                    }
                    E.on(fireEl, eventType,
                    function(e) {
                        self.send(config.postForm);
                        self.ajaxCheckInit(conditionFn, callback, callbackParams)
                    })
                };
                return AjaxFieldObj
            },
            PasswordStatus: function(el, passwordField) {
                this.status = D.get(el);
                this.bar = D.query("span.status-bar", this.status)[0].childNodes[0];
                this.result = D.query("span.status-result", this.status)[0];
                this.passwordField = passwordField;
                this.resultValue = D.query("input.J_ResultValue", this.status)[0];
                this.check = function() {
                    var value = this.passwordField.input.value;
                    if (value === "") {
                        this.status.style.display = "none";
                        this.resultValue.value = ""
                    } else {
                        var score = TRegister.common.gCheckPassword(value);
                        this.bar.style.width = score + "%";
                        var resultDesp = TRegister.common.getResultDesp(score);
                        this.result.innerHTML = resultDesp;
                        this.resultValue.value = {
                            "\u5f31": 1,
                            "\u4e2d": 2,
                            "\u5f3a": 3
                        } [resultDesp];
                        this.status.style.display = "block"
                    }
                };
                E.on(passwordField.input, "keyup", this.check, this, true)
            },
            SubmitField: function(id, fieldArr, fn) {
                var form = D.get(id),
                timerCheckForm;
                E.on(form, "submit",
                function(e) {
                    e.halt();
                    var currentInput = TRegister.app.currentInput;
                    if (currentInput) {
                        currentInput.blur()
                    }
                    if (timerCheckForm) {
                        window.clearInterval(timerCheckForm)
                    }
                    var cTarget = TRegister.app.currentTarget;
                    var showMsgField = function(el) {
                        setTimeout(function() {
                            el.showMsg(MSG_TYPE_ERROR)
                        },
                        200)
                    };
                    var check = function() {
                        if (timerCheckForm) {
                            window.clearInterval(timerCheckForm)
                        }
                        var submitFlag = true;
                        for (var i = 0, len = fieldArr.length; i < len; i++) {
                            if (!fieldArr[i].localValidate) {
                                showMsgField(fieldArr[i]);
                                submitFlag = false
                            }
                        }
                        if (!submitFlag) {
                            return false
                        }
                        if (fn && S.isFunction(fn)) {
                            fn();
                            return false
                        }
                        if (submitFlag) {
                            form.submit()
                        }
                    };
                    if (!cTarget) {
                        setTimeout(function() {
                            check()
                        },
                        100)
                    } else {
                        if (!cTarget.clienValidate) {
                            check();
                            return
                        }
                        timerCheckForm = window.setInterval(function() {
                            if (TRegister.app.currentTarget) {
                                return false
                            } else {
                                check()
                            }
                        },
                        200)
                    }
                })
            }
        },
        fieldObj: {
            emailField: function(config) {
                var userId = D.get("J_UserNumId"),
                userIdValue = "",
                userIdValue = userId ? userId.value.trim() : "";
                var emailField = new TRegister.app.AjaxField(("J_EmailField"), {
                    remoteValidateUrl: config.emailValidateUrl,
                    appName: "\u7535\u5b50\u90ae\u7bb1",
                    postParams: {
                        userId: userIdValue,
                        email: function() {
                            return emailField.input.value.trim()
                        }
                    }
                }),
                self = emailField;
                emailField.alipayExisted = false;
                emailField.check = function(email) {
                    var pattern = /^[_a-zA-Z0-9\-]+(\.[_a-zA-Z0-9\-]*)*@[a-zA-Z0-9\-]+([\.][a-zA-Z0-9\-]+)+$/,
                    email = self.input.value.trim();
                    if (email.length > 60) {
                        self.showMsg(TRegister.CONSTANTS.MSG_TYPE_ERROR, "\u90ae\u7bb1\u540d\u957f\u5ea6\u8fc7\u5927\uff0c\u8bf7\u51cf\u5c11\u523060\u4e2a\u5b57\u7b26\u4ee5\u5185");
                        return false
                    } else {
                        if (!pattern.test(email)) {
                            self.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS.ERROR_MALFORM_EMAIL);
                            return false
                        }
                    }
                    if (emailField.alipayExisted) {
                        self.showMsg(MSG_TYPE_TIPS);
                        return true
                    }
                    return true
                };
                emailField.callBack = function(result, args) {
                    if (result.success) {
                        if (!result.alipay) {
                            emailField.alipayExisted = true;
                            self.showMsg(MSG_TYPE_TIPS);
                            disabledAlipay();
                            return
                        }
                        self.showMsg(MSG_TYPE_OK, TEMP);
                        emailField.alipayExisted = false;
                        checkAlipay()
                    } else {
                        emailField.alipayExisted = false
                    }
                };
                emailField.addAjaxEvent(self.input, "blur", self.check, self.callBack);
                return emailField
            },
            areaField: function(phoneField, need_keep_contract) {
                if (!phoneField) {
                    return
                }
                E.on(D.get("J_Area"), "change",
                function() {
                    var option = TRegister.common.find_selected_option(this);
                    var data_entry = option.getAttribute("data-entry");
                    if (!data_entry) {
                        return
                    }
                    phoneField.check_key = option.getAttribute("check-key");
                    var area_data;
                    try {
                        area_data = window.eval("(" + data_entry + ")")
                    } catch(e) {
                        return
                    }
                    D.get("code_content").innerHTML = "+" + area_data.code;
                    phoneField.input.value = "";
                    phoneField.input.focus();
                    if (need_keep_contract) {
                        return
                    }
                    TRegister.common[(area_data.code === "86" ? "show": "hide") + "_alipay_contract"]()
                })
            },
            phoneField: function(config, isPhoneType) {
                var userId = D.get("J_UserNumId"),
                userIdValue = userId ? userId.value.trim() : "";
                var phoneField = new TRegister.app.AjaxField(("J_PhoneField"), {
                    remoteValidateUrl: config.phoneValidateUrl,
                    appName: "\u624b\u673a\u53f7\u7801",
                    postParams: {
                        userId: userIdValue,
                        mobile: function() {
                            return phoneField.input.value.trim()
                        },
                        mobile_area: function() {
                            return D.get("J_Area").value.trim()
                        }
                    }
                });
                var self = phoneField;
                var selected_option = TRegister.common.find_selected_option(D.get("J_Area"));
                self.check_key = selected_option.getAttribute("check-key");
                phoneField.check = function() {
                    var phone = D.get("code_content").innerHTML.replace("+", "") + self.input.value.trim(),
                    field = self.field;
                    var pattern = new RegExp(self.check_key);
                    if (!pattern.test(phone)) {
                        self.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS.ERROR_MALFORM_MOBILE);
                        return false
                    }
                    return true
                };
                phoneField.callBack = function(result) {
                    if (result.success) {
                        if (!result.alipay) {
                            self.showMsg(MSG_TYPE_TIPS);
                            if (isPhoneType) {
                                disabledAlipay()
                            }
                            return
                        }
                        if (isPhoneType) {
                            if (!is_hidden("#J_RegForm .alipay-field")) {
                                checkAlipay()
                            }
                        }
                    }
                };
                phoneField.addAjaxEvent(self.input, "blur", self.check, self.callBack);
                return phoneField
            },
            userNameField: function(config) {
                var userNameField = new TRegister.app.AjaxField(("J_UserNameField"), {
                    remoteValidateUrl: config.userNameValidateUrl,
                    appName: "\u7528\u6237\u540d",
                    postParams: {
                        nick: function() {
                            return userNameField.input.value.trim()
                        },
                        tt: function() {
                            return D.get("tt").value.trim()
                        }
                    }
                });
                var self = userNameField;
                userNameField.check = function() {
                    var input = self.input,
                    field = self.field;
                    if (!input) {
                        return true
                    }
                    var userName = input.value.trim(),
                    len = TRegister.common.getCharCount(userName);
                    if (len < 5 || len > 20) {
                        self.showMsg(MSG_TYPE_ERROR, "\u4f1a\u5458\u540d\u57285-20\u4e2a\u5b57\u7b26\u5185\u3002");
                        return false
                    } else {
                        if (/^\d*$/.test(userName)) {
                            self.showMsg(MSG_TYPE_ERROR, "\u4f1a\u5458\u540d\u4e0d\u80fd\u5168\u4e3a\u6570\u5b57\u3002");
                            return false
                        } else {
                            if (/\.\.|--|__|\uff0d|\uff3f|\u203b|\u25b2|\u25b3|\u3000| /.test(userName)) {
                                self.showMsg(MSG_TYPE_ERROR, "\u975e\u6cd5\u7684\u4f1a\u5458\u540d\u3002");
                                return false
                            }
                        }
                    }
                    return true
                };
                userNameField.showChouter = function() {
                    if (!this.counter) {
                        this.counter = D.query("div.J_CharCounter", this.field)[0];
                        this.counterNum = D.query("span.num", this.counter)[0]
                    }
                    var value = this.input.value.trim();
                    if (value === "") {
                        this.counter.style.display = "none"
                    } else {
                        var len = TRegister.common.getCharCount(value);
                        this.counterNum.innerHTML = len;
                        this.counter.style.display = "block"
                    }
                };
                userNameField.callBack = function(result, args) {
                    if (!result) {
                        return
                    }
                    if (!result.commandNick || result.commandNick.length == 0) {
                        D.get("another-name").style.display = "none";
                        return
                    }
                    var tpl = '<li><input type="radio" name="another-name" value="{0}" id="anothor-name-{1}" /><label for="anothor-name-{1}">{0}</label></li>';
                    var inner = "";
                    for (var i = 0, len = result.commandNick.length; i < len; i++) {
                        inner += tpl.replace(/\{0\}/g, result.commandNick[i]).replace(/\{1\}/g, i)
                    }
                    var containerBox = D.get("another-name"),
                    container = D.query("ul", containerBox)[0];
                    container.innerHTML = inner;
                    containerBox.style.display = "block";
                    E.on(D.query("input", containerBox), "click",
                    function(e) {
                        var radio = e.target;
                        this.input.value = radio.value;
                        this.currentValue = radio.value;
                        this.localValidate = true;
                        this.showMsg(MSG_TYPE_OK);
                        D.removeClass(this.input, "error");
                        this.input.focus();
                        this.showChouter()
                    },
                    userNameField)
                };
                E.on(userNameField.input, "keyup",
                function() {
                    this.showChouter()
                },
                userNameField);
                userNameField.addAjaxEvent(userNameField.input, "blur", userNameField.check, userNameField.callBack);
                return userNameField
            },
            pwdField: function(config) {
                var pwdField = new TRegister.app.AjaxField(("J_PasswordField"), {
                    remoteValidateUrl: config.passwordValidateUrl,
                    appName: "\u5bc6\u7801",
                    postParams: {
                        password: function() {
                            return pwdField.input.value.trim()
                        },
                        nick: function() {
                            return D.get("J_UserName").value.trim()
                        }
                    }
                }),
                self = pwdField;
                pwdField.addRepeatField = function(repeatField) {
                    pwdField.repeatField = repeatField;
                    E.on(repeatField.input, "blur", pwdField.check)
                };
                pwdField.check = function() {
                    var password = self.input.value.trim();
                    var repeatErrorText = "ERROR_PASSWORD_NOT_MATCH";
                    if (self.repeatField) {
                        var rpw = self.repeatField.input.value;
                        if (rpw !== "") {
                            if (password !== rpw) {
                                self.repeatField.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[repeatErrorText]);
                                self.repeatField.localValidate = false
                            } else {
                                self.repeatField.showMsg(MSG_TYPE_OK, TEMP);
                                self.repeatField.localValidate = true
                            }
                        } else {
                            self.repeatField.localValidate = false
                        }
                    } else {
                        if (self.input) {
                            var fpw = self.input.value;
                            if (password != "" && password !== fpw) {
                                self.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[repeatErrorText]);
                                return false
                            }
                        }
                    }
                    if (password == "") {} else {
                        if (password.length < 6) {
                            self.showMsg(MSG_TYPE_ERROR, "\u5bc6\u7801\u57286-16\u4e2a\u5b57\u7b26\u5185\u3002");
                            return false
                        } else {
                            if (/^\d*$/.test(password)) {
                                self.showMsg(MSG_TYPE_ERROR, "\u5bc6\u7801\u4e0d\u80fd\u5168\u4e3a\u6570\u5b57\u3002");
                                return false
                            } else {
                                if (/^[a-zA-Z]*$/.test(password)) {
                                    self.showMsg(MSG_TYPE_ERROR, "\u5bc6\u7801\u4e0d\u80fd\u5168\u4e3a\u5b57\u6bcd\u3002");
                                    return false
                                } else {
                                    if (/^(\S)\1*$/.test(password)) {
                                        self.showMsg(MSG_TYPE_ERROR, "\u60a8\u7684\u5bc6\u7801\u8fc7\u4e8e\u7b80\u5355\uff0c\u8bf7\u4e0d\u8981\u4f7f\u7528\u8fde\u7eed\u76f8\u540c\u5b57\u7b26\u3002");
                                        return false
                                    }
                                }
                            }
                        }
                    }
                    return true
                };
                pwdField.callBack = function(result) {
                    if (!result.success) {
                        self.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason]);
                        pwdField.localValidate = false
                    } else {
                        self.showMsg(MSG_TYPE_OK);
                        pwdField.localValidate = true
                    }
                };
                pwdField.addAjaxEvent(pwdField.input, "blur", self.check, self.callBack, "");
                var passwordStatus = new TRegister.app.PasswordStatus("J_PasswordStatus", pwdField);
                passwordStatus.check();
                E.on(pwdField.input, "copy",
                function(e) {
                    e.halt();
                    return false
                });
                return pwdField
            },
            repeatField: function() {
                var repeatField = new TRegister.app.AbstractField("J_RePasswordField");
                E.on(repeatField.input, "paste",
                function(e) {
                    e.halt();
                    return false
                });
                return repeatField
            },
            codeField: function() {
                var code = new TRegister.app.AbstractField("J_CodeField"),
                self = code;
                E.on(self.input, "keyup",
                function() {
                    if (self.input.value.trim().length !== 0) {
                        self.localValidate = true;
                        self.hideMsg()
                    }
                });
                return self
            },
            verifyCodeField: function(config) {
                var verifyCodeField = new TRegister.app.AjaxField(("J_PhoneFieldCode"), {
                    remoteValidateUrl: config.checkCodeUrl,
                    appName: "\u6821\u9a8c\u7801",
                    postParams: {
                        mobile_area: function() {
                            return D.get("J_Area").value
                        }
                    }
                }),
                self = verifyCodeField;
                verifyCodeField.currentValue = self.input.value.trim();
                var getParams = function(phoneField, emailField) {
                    var params = "userId=" + D.get("J_UserNumId").value.trim() + "&code=" + self.input.value.trim() + "&mobile_area=" + D.get("J_Area").value.trim() + "&alipay=" + (D.get("create-alipay") ? D.get("create-alipay").checked: "");
                    if (emailField) {
                        params = params + "&TPL_redirect_url=" + D.get("TPL_redirect_url").value.trim() + "&redirect_url_name=" + D.get("redirect_url_name").value.trim()
                    }
                    if (phoneField) {
                        params = params + "&mobile=" + phoneField.input.value.trim();
                        var nick_name = D.get("nickName");
                        if (nick_name) {
                            params = params + "&nick=" + nick_name.value.trim()
                        }
                    }
                    if (emailField) {
                        params = params + "&email=" + emailField.input.value.trim()
                    }
                    return params
                };
                verifyCodeField.check = function() {
                    var code = self.input.value.trim();
                    if (code.length === 6) {
                        if (self.currentValue !== code) {
                            self.hideMsg()
                        }
                        self.localValidate = true;
                        self.clienValidate = true;
                        self.currentValue = code;
                        return true
                    }
                    if (code !== "") {
                        self.showMsg(MSG_TYPE_ERROR, "\u683c\u5f0f\u4e0d\u6b63\u786e, \u6821\u9a8c\u7801\u4e3a\u516d\u4f4d\u6570\u3002")
                    } else {
                        self.hideMsg()
                    }
                    self.localValidate = false;
                    self.clienValidate = false;
                    return false
                };
                verifyCodeField.checkVerifyCode = function(phoneField, emailField) {
                    var params = getParams(phoneField, emailField);
                    TRegister.common.ajaxCreate(config.checkCodeUrl, params,
                    function(result) {
                        if (result.success) {
                            var alipay = D.get("alipay"),
                            mobilePhone = D.get("mobilePhone");
                            mobilePhone.value = phoneField ? phoneField.input.value.trim() : "";
                            if (result.alipay && D.get("alipay")) {
                                alipay.value = "true"
                            } else {
                                alipay.value = "false"
                            }
                            if (result.ss_url) {
                                window.location.href = result.ss_url;
                                return false
                            }
                            D.get("J_CheckCodeForm").submit()
                        } else {
                            verifyCodeField.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason] || result.reason)
                        }
                        verifyCodeField.hasSubmit = true
                    })
                };
                verifyCodeField.callBack = function(result) {
                    if (result.success) {
                        var alipay = D.get("alipay"),
                        mobilePhone = D.get("mobilePhone");
                        mobilePhone.value = phoneField ? phoneField.input.value.trim() : "";
                        if (result.alipay && D.get("alipay")) {
                            alipay.value = "true"
                        } else {
                            alipay.value = "false"
                        }
                        D.get("J_CheckCodeForm").submit()
                    } else {
                        self.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason])
                    }
                };
                E.on(self.input, "blur", verifyCodeField.check);
                E.on(self.input, "change",
                function() {
                    verifyCodeField.hasSubmit = false
                });
                return verifyCodeField
            }
        },
        stepOneInitialize: function(config) {
            var userNameField = TRegister.fieldObj.userNameField(config);
            userNameField.focus();
            userNameField.showChouter();
            var pwdField = TRegister.fieldObj.pwdField(config);
            var repeatField = TRegister.fieldObj.repeatField();
            pwdField.addRepeatField(repeatField);
            var codeField = TRegister.fieldObj.codeField();
            var btn = new TRegister.app.SubmitField("J_RegForm", [userNameField, pwdField, repeatField, codeField]);
            E.on(D.get("J_ChangeCodeImg"), "click",
            function(e) {
                e.halt();
                D.get("J_CheckCode").src = config.changeCodeUrl + "&r=" + new Date().getTime()
            });
            E.on(D.get("J_ViewAgreement"), "click",
            function(e) {
                e.halt();
                D.get("agreements").style.display = (D.get("agreements").style.display === "block" ? "none": "block")
            })
        },
        phoneInitialize: function(config) {
            var phoneField = TRegister.fieldObj.phoneField(config, true),
            areaField = TRegister.fieldObj.areaField(phoneField),
            codePop = new TRegister.app.Popup("popup", "mask"),
            countDownCls = "J_CountDown",
            verifyCodeField = TRegister.fieldObj.verifyCodeField(config);
            var sendCode = function(stopSendCode) {
                var params = "userNumId=" + D.get("J_UserNumId").value.trim() + "&mobile=" + phoneField.input.value.trim() + "&alipay=" + alipayCheckValue() + "&mobile_area=" + D.get("J_Area").value.trim() + "&stopSendCode=" + (stopSendCode || "");
                TRegister.common.ajaxCreate(config.sendCodeUrl, params,
                function(result) {
                    if (result.success) {
                        phoneField.hasSubmit = true;
                        D.get("J_SendedPhone").innerHTML = phoneField.input.value.trim();
                        codePop.show();
                        verifyCodeField.input.value = "";
                        verifyCodeField.focus();
                        D.get("J_SendCodeMsg").style.display = "none";
                        if (!stopSendCode) {
                            countDown(countDownCls)
                        }
                    } else {
                        phoneField.localValidate = false;
                        phoneField.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason] || result.reason)
                    }
                })
            };
            var reCode = D.get(countDownCls);
            E.on(reCode, "click",
            function() {
                if (reCode.disabled) {
                    return
                }
                reCode.disabled = true;
                var msg = D.get("J_SendCodeMsg"),
                p = D.query("p", msg)[0];
                msg.style.display = "none";
                var params = "userNumId=" + D.get("J_UserNumId").value.trim() + "&mobile=" + phoneField.input.value.trim() + "&mobile_area=" + D.get("J_Area").value.trim() + "&alipay=" + alipayCheckValue();
                TRegister.common.ajaxCreate(config.reSendCodeUrl, params,
                function(result) {
                    if (result.success) {
                        p.className = "ok";
                        p.innerHTML = "\u6821\u9a8c\u7801\u5df2\u6210\u529f\u53d1\u9001\uff0c\u8bf7\u6ce8\u610f\u67e5\u6536\u3002";
                        countDown(countDownCls)
                    } else {
                        p.className = "error";
                        p.innerHTML = TRegister.CONSTANTS[result.reason] || result.reason;
                        reCode.disabled = false
                    }
                    msg.style.display = ""
                })
            });
            if (config.validateOnInit) {
                codePop.show();
                verifyCodeField.input.value = "";
                D.get("J_SendedPhone").innerHTML = phoneField.input.value.trim();
                verifyCodeField.focus();
                D.get("J_SendCodeMsg").style.display = "none"
            } else {
                phoneField.focus()
            }
            var btn = new TRegister.app.SubmitField("J_RegForm", [phoneField],
            function() {
                if (!phoneField.hasSubmit) {
                    sendCode()
                } else {
                    if ((phoneField.alipay != D.get("create-alipay").checked)) {
                        sendCode(true)
                    } else {
                        codePop.show();
                        verifyCodeField.input.value = "";
                        D.get("J_SendCodeMsg").style.display = "none";
                        verifyCodeField.focus()
                    }
                }
                phoneField.alipay = D.get("create-alipay").checked
            });
            var codeBtn = new TRegister.app.SubmitField("J_CheckCodeForm", [verifyCodeField],
            function() {
                if (!verifyCodeField.hasSubmit) {
                    verifyCodeField.checkVerifyCode(phoneField)
                }
            })
        },
        emailInitialize: function(config) {
            var emailField = TRegister.fieldObj.emailField(config),
            phoneField = TRegister.fieldObj.phoneField(config),
            areaField = TRegister.fieldObj.areaField(phoneField, true),
            pop = new TRegister.app.Popup("popupMobile", "mask"),
            codePop = new TRegister.app.Popup("popup", "mask", {
                is_code_pop: true
            }),
            countDownCls = "J_CountDown",
            verifyCodeField = TRegister.fieldObj.verifyCodeField(config);
            var sendCode = function() {
                var params = "userNumId=" + D.get("J_UserNumId").value.trim() + "&email=" + emailField.input.value.trim() + "&mobile=" + phoneField.input.value.trim() + "&alipay=" + alipayCheckValue() + "&mobile_area=" + D.get("J_Area").value.trim() + "&TPL_redirect_url=" + D.get("TPL_redirect_url").value.trim() + "&redirect_url_name=" + D.get("redirect_url_name").value.trim();
                TRegister.common.ajaxCreate(config.sendCodeUrl, params,
                function(result) {
                    if (result.success) {
                        pop.hide();
                        D.get("J_SendedPhone").innerHTML = phoneField.input.value.trim();
                        codePop.show();
                        verifyCodeField.input.value = "";
                        verifyCodeField.focus();
                        D.get("J_SendCodeMsg").style.display = "none";
                        countDown(countDownCls)
                    } else {
                        phoneField.localValidate = false;
                        phoneField.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason] || result.reason)
                    }
                    phoneField.hasSubmit = true
                })
            };
            var reCode = D.get(countDownCls);
            E.on(reCode, "click",
            function() {
                if (reCode.disabled) {
                    return
                }
                reCode.disabled = true;
                var msg = D.get("J_SendCodeMsg"),
                p = D.query("p", msg)[0];
                msg.style.display = "none";
                var params = "userNumId=" + D.get("J_UserNumId").value.trim() + "&mobile=" + phoneField.input.value.trim() + "&mobile_area=" + D.get("J_Area").value.trim() + "&alipay=" + alipayCheckValue();
                TRegister.common.ajaxCreate(config.reSendCodeUrl, params,
                function(result) {
                    if (result.success) {
                        p.className = "ok";
                        p.innerHTML = "\u6821\u9a8c\u7801\u5df2\u6210\u529f\u53d1\u9001\uff0c\u8bf7\u6ce8\u610f\u67e5\u6536\u3002";
                        countDown(countDownCls)
                    } else {
                        p.className = "error";
                        p.innerHTML = TRegister.CONSTANTS[result.reason] || result.reason;
                        reCode.disabled = false
                    }
                    msg.style.display = ""
                })
            });
            var sendEmail = function(stopSendCode) {
                var params = "userNumId=" + D.get("J_UserNumId").value.trim() + "&email=" + emailField.input.value.trim() + "&alipay=" + alipayCheckValue() + "&TPL_redirect_url=" + D.get("TPL_redirect_url").value.trim() + "&redirect_url_name=" + D.get("redirect_url_name").value.trim() + "&stopSendCode=" + (stopSendCode || "");
                TRegister.common.ajaxCreate(config.sendEmailUrl, params,
                function(result) {
                    if (result.success) {
                        if (result.np) {
                            pop.show();
                            phoneField.focus()
                        } else {
                            D.get("J_RegForm").submit()
                        }
                    } else {
                        emailField.localValidate = false;
                        emailField.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason] || result.reason)
                    }
                    emailField.hasSubmit = true
                })
            };
            if (config.validateOnInit) {
                pop.show();
                phoneField.focus()
            } else {
                emailField.focus()
            }
            var reCode = D.get(countDownCls);
            E.on(reCode, "click",
            function() {
                if (reCode.disabled) {
                    return
                }
                reCode.disabled = true;
                sendCode()
            });
            var rePhone = D.get("J_RePhone");
            E.on(rePhone, "click",
            function() {
                codePop.hide();
                pop.show();
                phoneField.focus();
                D.get("J_SendCodeMsg").style.display = "none"
            });
            var sendbtn = new TRegister.app.SubmitField("J_RegForm", [emailField],
            function() {
                if (!emailField.hasSubmit) {
                    sendEmail()
                } else {
                    if (emailField.alipay != D.get("create-alipay").checked) {
                        sendEmail(true)
                    } else {
                        pop.show();
                        phoneField.focus()
                    }
                }
                emailField.alipay = D.get("create-alipay").checked
            });
            var btn = new TRegister.app.SubmitField("J_CheckMobileForm", [phoneField],
            function() {
                if (!phoneField.hasSubmit) {
                    sendCode()
                } else {
                    pop.hide();
                    codePop.show();
                    verifyCodeField.input.value = "";
                    verifyCodeField.focus()
                }
            });
            var codeBtn = new TRegister.app.SubmitField("J_CheckCodeForm", [verifyCodeField],
            function() {
                if (!verifyCodeField.hasSubmit) {
                    verifyCodeField.checkVerifyCode(phoneField, emailField)
                }
            })
        },
        jihuoInitialize: function(config) {
            var activationEmail = D.get("J_ActivationEmail"),
            changeEmail = D.get("J_ChangeEmail");
            E.on(activationEmail, "click",
            function() {
                var self = this;
                TRegister.common.ajaxCreate(config.activationUrl, "userNumId=" + D.get("J_UserNumId").value.trim(),
                function(result) {
                    if (result.success) {
                        activationEmail.innerHTML = "\u53d1\u9001\u6210\u529f"
                    } else {
                        activationEmail.innerHTML = TB.app.reg.CONSTANTS[result.reason] || result.reason
                    }
                    D.addClass(activationEmail, "inactive");
                    E.remove(activationEmail, "click", self.callee)
                })
            })
        },
        alipayInitialize: function(config) {
            var userNameField = TRegister.fieldObj.userNameField(config),
            phoneField = TRegister.fieldObj.phoneField(config),
            areaField = TRegister.fieldObj.areaField(phoneField),
            pop = new TRegister.app.Popup("popupMobile", "mask"),
            codePop = new TRegister.app.Popup("popup", "mask"),
            countDownCls = "J_CountDown",
            verifyCodeField = TRegister.fieldObj.verifyCodeField(config);
            userNameField.focus();
            userNameField.showChouter();
            var sendCode = function() {
                var params = "userNumId=" + D.get("J_UserNumId").value.trim() + "&mobile=" + phoneField.input.value.trim() + "&mobile_area=" + D.get("J_Area").value.trim() + "&TPL_redirect_url=" + D.get("TPL_redirect_url").value.trim() + "&redirect_url_name=" + D.get("redirect_url_name").value.trim();
                TRegister.common.ajaxCreate(config.sendCodeUrl, params,
                function(result) {
                    if (result.success) {
                        pop.hide();
                        D.get("J_SendedPhone").innerHTML = phoneField.input.value.trim();
                        codePop.show();
                        verifyCodeField.input.value = "";
                        verifyCodeField.focus();
                        D.get("J_SendCodeMsg").style.display = "none";
                        countDown(countDownCls)
                    } else {
                        phoneField.localValidate = false;
                        phoneField.showMsg(MSG_TYPE_ERROR, TRegister.CONSTANTS[result.reason] || result.reason)
                    }
                    phoneField.hasSubmit = true
                })
            };
            var reCode = D.get(countDownCls);
            E.on(reCode, "click",
            function() {
                if (reCode.disabled) {
                    return
                }
                reCode.disabled = true;
                var msg = D.get("J_SendCodeMsg"),
                p = D.query("p", msg)[0];
                msg.style.display = "none";
                var params = "userNumId=" + D.get("J_UserNumId").value.trim() + "&mobile=" + phoneField.input.value.trim() + "&mobile_area=" + D.get("J_Area").value.trim() + "&alipay=" + alipayCheckValue();
                TRegister.common.ajaxCreate(config.reSendCodeUrl, params,
                function(result) {
                    if (result.success) {
                        p.className = "ok";
                        p.innerHTML = "\u6821\u9a8c\u7801\u5df2\u6210\u529f\u53d1\u9001\uff0c\u8bf7\u6ce8\u610f\u67e5\u6536\u3002";
                        countDown(countDownCls)
                    } else {
                        p.className = "error";
                        p.innerHTML = TRegister.CONSTANTS[result.reason] || result.reason;
                        reCode.disabled = false
                    }
                    msg.style.display = ""
                })
            });
            if (config.validateOnInit) {
                pop.show();
                phoneField.focus()
            } else {
                userNameField.focus()
            }
            var reCode = D.get(countDownCls);
            E.on(reCode, "click",
            function() {
                if (reCode.disabled) {
                    return
                }
                reCode.disabled = true;
                sendCode()
            });
            var rePhone = D.get("J_RePhone");
            E.on(rePhone, "click",
            function() {
                codePop.hide();
                pop.show();
                phoneField.focus();
                D.get("J_SendCodeMsg").style.display = "none"
            });
            var sendbtn = new TRegister.app.SubmitField("J_RegForm", [userNameField],
            function() {
                pop.show();
                phoneField.focus()
            });
            var btn = new TRegister.app.SubmitField("J_CheckMobileForm", [phoneField],
            function() {
                if (!phoneField.hasSubmit) {
                    sendCode()
                } else {
                    pop.hide();
                    codePop.show();
                    verifyCodeField.input.value = "";
                    verifyCodeField.focus()
                }
            });
            var codeBtn = new TRegister.app.SubmitField("J_CheckCodeForm", [verifyCodeField],
            function() {
                if (!verifyCodeField.hasSubmit) {
                    if (D.get("nickName")) {
                        D.get("nickName").value = userNameField.input.value.trim()
                    }
                    verifyCodeField.checkVerifyCode(phoneField)
                }
            });
            E.on(D.get("J_ViewAgreement"), "click",
            function(e) {
                e.halt();
                D.get("agreements").style.display = (D.get("agreements").style.display === "block" ? "none": "block")
            })
        },
        alipayPhoneInitialize: function(config) {
            var userNameField = TRegister.fieldObj.userNameField(config);
            userNameField.focus();
            var sendbtn = new TRegister.app.SubmitField("J_RegForm", [userNameField]);
            E.on(D.get("J_ViewAgreement"), "click",
            function(e) {
                e.halt();
                D.get("agreements").style.display = (D.get("agreements").style.display === "block" ? "none": "block")
            })
        }
    }
});
KISSY.ready(function(b) {
    var a = KISSY.one("#logo .sub-logo");
    if (!a) {
        return
    }
    a[0].href = "http://member1.taobao.com/member/new_register.jhtml?from=&ex_info=&ex_sign="
});

