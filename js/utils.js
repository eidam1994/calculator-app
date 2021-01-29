var Utils = {
    getParam: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
    saveData: function (key, obj) {
        var value = JSON.stringify(obj);
        localStorage.setItem(key, value);
    },
    getData: function (key) {
        var value = localStorage.getItem(key);
        if (value == undefined || value == null || value == "") {
            return null;
        } else {
            return JSON.parse(value);   
        }
    },
    deleteData: function(key) {
        localStorage.removeItem(key);
    },
    createId: function () {
        var id = "";
        for (var i = 0; i < 4; i++) {
            id += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return id;
    },
    createStl: function (url, stlCanvas, width, height) {
        draw(url, stlCanvas, width, height);
    }
}
