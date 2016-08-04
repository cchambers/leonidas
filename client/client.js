var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

key = 1;


var struct = {

}

var leo = {
    init: function () {
        leo.setup();
    },

    setup: function () {
        leo.$modules = $("[class*='-module']");

        leo.$modules.on("click", function () {
            var $el = $(this);
            $el.attr('contentEditable', false);
            leo.temp = {
                structure: {},
                content: {}
            }
            leo.walk($el);
        });
    },

    toggleEditable: function (e) {
        e.stopPropagation();
        var $el = $(this);
        $el.attr('contentEditable', true);
    },

    walk: function ($el) {
        leo.temp.structure = leo.mapStructure($el);
    },

    areChildrenInline: function ($children) {
        var inline = false;
        $.each($children, function () {
            var element = $(this).get(0);
            var display = leo.getDisplayStyle(element);
            if (display == "inline") {
                inline = true;
            }
        });
        return inline;
    },

    getDisplayStyle: function (element) {
        var cStyle = element.currentStyle || window.getComputedStyle(element, "");
        return cStyle.display;
    },

    mapStructure: function ($el) {
        var tagName = $el.prop("tagName").toLowerCase();
        var item = {
            "element": tagName
        }

        var $children = $el.children();
        var children;
        if ($children.length > 0) {
            children = leo.getChildren($children);
        }

        if (children) {
            item.children = children;
        }

        var $children = $el.children();
        var hasInline = leo.areChildrenInline($children);
        var text = false;

        if (hasInline) {
            text = $el.html();
        } else {
            text = $el
            .clone()    //clone the element
            .children() //select all the children
            .remove()   //remove all the children
            .end()  //again go back to selected element
            .html()
            .trim();
        }

        if (text) {
            key++;
            var k = "k-" + tagName + "-" + key;
            item.contentKey = k;
            leo.temp.content[k] = text;
        }

        return item;
        // key = super-element-number?

    },

    getChildren: function ($nodes) {
        var arr = [];
        for (var x = 0; x < $nodes.length; x++) {
            var $el = $($nodes[x]);
            var el = $el.get(0);
            var displayStyle = leo.getDisplayStyle(el);
            var item = leo.mapStructure($($nodes[x]));
            arr.push(item);
        }
        return arr;
    },

    mapAttributes: function (attrs) {
        var obj = {};
        for (var attr in attrs) {
            var wat = attrs[attr];
            console.log(wat);
            // var attribute = wat.split("=")[0];
            // var value = wat.split("\"")[1];
            // obj[attribute] = value;
        }
        //console.log(obj);
        return obj;
    }

}

$(document).ready(leo.init);