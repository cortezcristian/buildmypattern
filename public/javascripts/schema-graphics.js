/**
* __     ___               _       
* \ \   / (_)___ _   _  __| | ___  
*  \ \ / /| / __| | | |/ _` |/ _ \ 
*   \ V / | \__ \ |_| | (_| | (_) |
*    \_/  |_|___/\__,_|\__,_|\___/ 
*                                  
*  ____       _   _                  _          
* |  _ \ __ _| |_| |_ ___ _ __ _ __ (_)_____ __ 
* | |_) / _` | __| __/ _ \ '__| '_ \| |_  / '__|
* |  __/ (_| | |_| ||  __/ |  | | | | |/ /| |   
* |_|   \__,_|\__|\__\___|_|  |_| |_|_/___|_|   
*                                               
* 
* Graphics plugin
* @author Cristian Cortez  
* @requires KineticJS v4.0.5 or above - http://www.kineticjs.com/
* 
*/

/**
 * xUmlRenderer Global Namespace
 * @module xUmlRenderer
 */
var xUml = {};
/*
 * xUmlRenderer Version
 * @property ver
 * @type string
 */
xUml.ver = '1.0';

/*
 * xUmlRenderer Extend utility
 * @namespace xUmlRenderer
 * @method Extend
 * @param {Object} obj1 Child Class Object
 * @param {Object} obj2 Parent Class Object
 */
xUml.extend = function(obj1, obj2) {
    for(var key in obj2.prototype) {
        if(obj2.prototype.hasOwnProperty(key) && obj1.prototype[key] === undefined) {
            obj1.prototype[key] = obj2.prototype[key];
        }
    }
}

xUml.override = function(obj1, obj2) {
    for(var key in obj2) {
            obj1[key] = obj2[key];
    }
}

xUml.log = function(a){try{console.log(a);} catch(e) {}};

/*
    http://james.padolsey.com/javascript/get-document-height-cross-browser/
*/
xUml.getDocHeight = function() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

/**
* Global Objects
*/

xUml.stage = {};
xUml.desktop = {};
xUml.desktopBar = {};
xUml.desktopCon = {};
xUml.WIDTH = "";
xUml.HEIGHT = "";

/**
* Global Gradient Objects Mixin
*/
xUml.gradients = {};
xUml.gradients.dark = function(){
    //xUml.desktop.getContext()
    var grad = {
        start: {
          x: -50,
          y: -50
        },
        end: {
          x: 50,
          y: -50
        },
        colorStops: [0, '#6d6b68', 0.3, "#595854",1, '#3c3b37']
      };
    return grad;
}
xUml.gradients.orange = function(){
    //xUml.desktop.getContext()
    var grad = {
        start: {
          x: 0,
          y: 0
        },
        end: {
          x: 0,
          y: 50
        },
        colorStops: [0, '#F16C3A', 0.1, "#F16C3A", 0.4, "#F84705", 1, '#F87240']
      };
    return grad;
}
/**
* Init Method
*/
xUml.init = function(o){
    //TODO: add right click support: document.oncontextmenu = function(e) {alert("a"); return false;} 
    var obj = {
        container: "container",
        width: window.innerWidth || window.screen.width,
        height: xUml.getDocHeight() || window.screen.height
    }
    xUml.override(obj, o);
   
    xUml.WIDTH = obj.width;
    xUml.HEIGHT = obj.height;
    //console.dir(obj);
     
    xUml.stage = new Kinetic.Stage({
        container: obj.container,
        width: obj.width,
        height: obj.height
    });

    xUml.desktop  = new Kinetic.Layer({x:60});
    xUml.desktopCon  = new Kinetic.Layer({x:60}); /*Desktop icons container*/
    xUml.desktopBar  = new Kinetic.Layer();
}
/**
* Class Box
*/
xUml.classBox = function(o){ 
    this.conf = {
        name: "class-name",
        title: "Class Name",
        rectX: 50,
        rectY: 20,
        width: 150,
        height: 100
    };
    
    xUml.override(this.conf, o || {});

    this.grp = new Kinetic.Group({
        x: 0,
        y: 0,
        name: this.conf.name,
        draggable: true
    });
    
    var rectX = this.conf.rectX, rectY = this.conf.rectY;
    
    var txtTitle = new Kinetic.Text({
        x: rectX + 7,
        y: rectY + 3,
        text: this.conf.title,
        alpha: 0.9,
        fontSize: 12,
        fontFamily: "Arial",
        textFill: "#d1d1d1",
        padding: 10,
        align: "left",
        verticalAlign: "middle",
        fontStyle: "bold"
    });
    var sepLine = new Kinetic.Line({
        points: [{x:rectX+0,y:rectY+30},{x:rectX+this.conf.width,y:rectY+30}],
        stroke: "#333",
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        name: "sepLine"
    });
    var box = new Kinetic.Rect({
      x: rectX,
      y: rectY,
      width: this.conf.width,
      height: this.conf.height,
      cornerRadius: 5,
      fill: xUml.gradients.dark(),
      stroke: "black",
      strokeWidth: 1,
      name: "box"
    });
    
    this.grp.add(box);
    this.grp.add(sepLine);
    this.grp.add(txtTitle);
    this.grp.conf = this.conf;
    this.grp.on("dragstart", function() {
        this.moveToTop();
    });
    this.grp.on("dragend", function() {
        this.moveToTop();
    });
    return this.grp;
}
/**
* Menu for Main Bar
*/
xUml.optionssMenu = {
    label: "xUmlCanvas",
    name: "xUmlCanvas",
    icon: "./img/logo.png",
    items: [{
        //submenu: true,//fijarse si tiene items
        label:"Class",
        name: "application",
        icon: "./img/ico-applications.png",
        onClick: function(){
            var classNew = new xUml.classBox({title: "sample", rectX:220});
            xUml.desktop.add(classNew);
            xUml.desktop.draw();
            console.log(classNew);
            socket.emit('classCreated', { classConf: classNew.conf });
        }
    },{
        label:"Relation",
        name: "game",
        icon: "./img/ico-games.png",
        onClick: function(){}
    },{
        label:"About",
        name: "about",
        icon: "./img/ico-about.png",
        onClick: function(){}
    }]
}


xUml.buildMainMenu = function(){
    var mainMenu = new Kinetic.Group({x:0, y:0, name: 'start-menu'}), menuItems = [],  
        itemX = 0, itemY = 0, itemW = 60, itemH = 60, itemBoxY = 0, itemBoxW = 60,
         sMenu = xUml.optionssMenu;
   
    for(var i=0; i<sMenu.items.length;i++){
        console.log(sMenu.items[i].label);
        var itemBox = new Kinetic.Rect({
          x: 0,
          y: 0,
          width: itemW,
          height: itemH,
          fill: xUml.gradients.dark(),
          stroke: "black",
          strokeWidth: 1,
          name: 'box-'+sMenu.items[i].name
        });
        var itemMenuLabel = new Kinetic.Text({
            x: 0,
            y: itemH-20,
            text: sMenu.items[i].label,
            alpha: 0.9,
            fontSize: 11,
            fontFamily: "Arial",
            textFill: "#d1d1d1",
            padding: 2,
            align: "center",
            verticalAlign: "middle",
            fontStyle: "normal"
        });
        menuItems[i] = new Kinetic.Group({
            x: itemX,
            y: itemH*i,
            name: sMenu.items[i].name
        });
        menuItems[i].bgBoxName = 'box-'+sMenu.items[i].name;
        menuItems[i].add(itemBox);
        menuItems[i].add(itemMenuLabel);
        menuItems[i].on('click', sMenu.items[i].onClick);
        menuItems[i].on('mouseover', function(){
            document.body.style.cursor = "pointer";
            xUml.desktopBar.get("."+this.bgBoxName)[0].attrs.fill = xUml.gradients.orange(); 
            xUml.desktopBar.draw();
        });
        menuItems[i].on('mouseout', function(){
            document.body.style.cursor = "default";
            xUml.desktopBar.get("."+this.bgBoxName)[0].attrs.fill = xUml.gradients.dark(); 
            xUml.desktopBar.draw();
        });

        //Add item to the menu
        mainMenu.add(menuItems[i]);
    } 
    
    
    return mainMenu;
}

/**
* Main Bar 
*/
xUml.mainBar = function(){

    this.bar = new Kinetic.Group({
        x: 0,
        y: 0
    });

    var grd = xUml.gradients.dark();

    var box = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: 60,
      height: xUml.HEIGHT,
      fill: grd,
      stroke: "black",
      strokeWidth: 1,
      name: "topBar"
    });
    
    var d = new Date(),
    h = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()),
    m = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()),
    s = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()),
    da = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()),
    mo = (d.getMonth() < 10 ? '0' + (d.getMonth() + 1): d.getMonth()),
    text = d.toString().substring(0,3) + ' ' + da + ' ' + d.toString().substring(4,7) + ', ' + h + ':' + m + ':' + s ;
    
    
    var clockLabel = new Kinetic.Text({
        x: window.innerWidth - 150,
        y: 15,
        text: text,
        alpha: 0.9,
        fontSize: 10,
        fontFamily: "Arial",
        textFill: "#d1d1d1",
        padding: 15,
        align: "left",
        verticalAlign: "middle",
        name: "mainClock",
        fontStyle: "normal"
    });

    var mainMenu = xUml.buildMainMenu();

    console.log(mainMenu);

    this.bar.add(box);
    this.bar.add(mainMenu);
    //this.bar.add(clockLabel);
    return this.bar;
}


/**
* Renderer Method
*/

xUml.render = function(o){
    
    //adding stuff
    xUml.stage.add(xUml.desktopCon);
    xUml.stage.add(xUml.desktop);
    xUml.desktopBar.add(new xUml.mainBar());
    xUml.stage.add(xUml.desktopBar);
}
/**
* Magic starts here :)
*/
window.onload = function() {
    xUml.init({
        container: "graph-container",
        width: $("#graph-container").width() || 578,
        height: 400
    });
    xUml.render();
};

/**
* Socket IO: Receive events
*/

socket.on('classCreation', function (data) {
        console.log("Class drawn");
        var classBox = new xUml.classBox(data.classConf);
        xUml.desktop.add(classBox);
        xUml.desktop.draw();
}); 

