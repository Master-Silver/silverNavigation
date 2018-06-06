(function () {
  'use strict';
  var options = {
    switchValue      : 600,
    activeClassForLI : "active",
    navigationClass  : "silverNavigation",
    buttonParameter  : "silverData",
    mobileClass      : "mobile",
    buttonTagType    : "BUTTON",
    menuButtonValue  : "---",
    supButtonValue   : ">",
    timeForAnimation : 1
  };
  
  var allMainULs = [];
  var allMobilOpenButtons = [];
  var allViewButtons = [];
  
  if (document.getElementsByClassName === undefined) {
    var checkChildrenForCLass = function (childNodes, className, elementArray) {
      var aRunMax = childNodes.length;
      for (var a = 0; a < childNodes < aRunMax; a++) {
        var tempChildNode = childNodes[a];
        if (tempChildNode !== undefined) {
          var classNameOf = tempChildNode.className;
          if (classNameOf !== undefined && classNameOf.indexOf(className) > -1) {
            elementArray.push(tempChildNode);
          }
          var childNodesOfTemp = tempChildNode.childNodes;
          if (childNodesOfTemp !== undefined) {
            checkChildrenForCLass(childNodesOfTemp, className, elementArray); 
          }
        }  
      }
    };
    var getElementsByClassName = function (element, className) {
      var elementArray = [];
      if (element !== undefined) {
        if (element.className.indexOf(className) > -1) {
          elementArray.push(element);
        }
        var childNodes = element.childNodes;
        if (childNodes !== undefined) {
          checkChildrenForCLass(childNodes, className, elementArray);
        }
        if (elementArray.length >= 1) {
          return elementArray;  
        }
      }
      return null;
    };
  } else {
    var getElementsByClassName = function (element, className) {
      return element.getElementsByClassName(className);
    };
  }
  
  if (requestAnimationFrame === undefined) {
    var runInNewFrame = [];
    var runAnimationFrame = false;
    var lastInterval = null;
    var requestAnimationFrame = function (func) {
      runInNewFrame.push(func);
      if (runAnimationFrame === false) { 
        lastInterval = setInterval(intervalForNewFrame, 1000/60);
        runAnimationFrame = true;
      }
    };
    var intervalForNewFrame = function () {
      console.log(runInNewFrame.length);
      if (runInNewFrame.length >= 1) {
        var lokalCache = runInNewFrame;
        runInNewFrame = [];
        for (var f = 0; f < lokalCache.length; f++) {
          lokalCache[f]();
        }
      } else {
        clearInterval(lastInterval);
        runAnimationFrame = false;
      }
    };
  }
  
  var allNavigations = getElementsByClassName(document.body, options.navigationClass);
  for (var b = 0; b < allNavigations.length; b++) {
    var currentNav = allNavigations[b];
    var navChildNodes = currentNav.childNodes;
    for (var c = 0; c < navChildNodes.length; c++) {
      var mainUL = navChildNodes[c];
      if (mainUL.tagName === "UL") {
        var mobilOpenButton = document.createElement(options.buttonTagType);
        allMainULs.push(mainUL);
        allMobilOpenButtons.push(mobilOpenButton);
        searchForSubpage(mainUL.childNodes);
        mobilOpenButton[options.buttonParameter] = mainUL;
        mobilOpenButton.onclick = expandToAutoHeight;
        mobilOpenButton.innerHTML = options.menuButtonValue;
        currentNav.insertBefore(mobilOpenButton, mainUL);
        c++;
      }
    }
  }
  
  function searchForSubpage (ULChildNodes) {
    //console.log(ULchildren);
    var dRunMax = ULChildNodes.length;
    for (var d = 0; d < dRunMax; d++) {
      var LI = ULChildNodes[d];
      if (LI !== undefined && LI.tagName === "LI") {
        var LIChildNodes = LI.childNodes;
        var eRunMax = LIChildNodes.length;
        for (var e = 0; e < eRunMax; e++) {
          var subUL = LIChildNodes[e];
          if (subUL !== undefined && subUL.tagName === "UL") {
            var viewButton = document.createElement(options.buttonTagType);
            allViewButtons.push(viewButton);
            searchForSubpage(subUL.childNodes);
            if (LI.className.indexOf(options.activeClassForLI) > -1) {
              viewButton.onclick = collapseToNullHeight;  
            } else {
             subUL.style.height = "0px";
             viewButton.onclick = expandToAutoHeight;
            }  
            viewButton[options.buttonParameter] = subUL;
            viewButton.innerHTML = options.supButtonValue;
            LI.insertBefore(viewButton, subUL);
            e++;
          }
        }
      }
    }
  }
  
  function expandToAutoHeight () {
    var button = this;
    var element = button[options.buttonParameter];
    var targetHeight = element.scrollHeight;
    var startHeight = element.offsetHeight;
    var addingPerFrame = Math.round((targetHeight - startHeight) / (1000 * options.timeForAnimation / 60));
    var heightChange = function () {
      startHeight += addingPerFrame;
      if (startHeight < targetHeight) {
        element.style.height = startHeight + "px";
        requestAnimationFrame(heightChange);
      } else {
        element.style.height = "";
        button.onclick = collapseToNullHeight;
      }
    };
    requestAnimationFrame(heightChange);
  }
  
  function collapseToNullHeight () {
    var button = this;
    var element = button[options.buttonParameter];
    var startHeight = element.offsetHeight;
    var removePerFrame = Math.round(startHeight / (1000 * options.timeForAnimation / 60));
    var heightChange = function () {
      startHeight -= removePerFrame;
      if (startHeight >= 1) {
        element.style.height = startHeight + "px";
        requestAnimationFrame(heightChange);
      } else {
        element.style.height = "0px";
        button.onclick = expandToAutoHeight;
      }
    };
    requestAnimationFrame(heightChange);
  }
    
  function changeStyleForAll (elementList, style, value) {
    for (var f = 0; f < elementList.length; f++) {
      elementList[f].style[style] = value;
    }
  }
  
  if (document.body.clientWidth <= options.switchValue) {
    var menuStatus = 1;
    changeStyleForAll(allMobilOpenButtons, "display", "inline-block");
    changeStyleForAll(allViewButtons, "display", "inline-block");
    changeStyleForAll(allMainULs, "height", "0px");
  } else {
    var menuStatus = 0;
    changeStyleForAll(allMobilOpenButtons, "display", "none");
    changeStyleForAll(allViewButtons, "display", "none");
    changeStyleForAll(allMainULs, "height", "");
  }
  
  var changesForResize = function () {
    if (menuStatus === 0 && document.body.clientWidth <= options.switchValue) {
      menuStatus = 1;
      for (var v = 0;v < allMobilOpenButtons.length; v++) {
        allMobilOpenButtons[v].onclick = expandToAutoHeight;
      }
      changeStyleForAll(allMobilOpenButtons, "display", "inline-block");
      changeStyleForAll(allViewButtons, "display", "inline-block");
      changeStyleForAll(allMainULs, "height", "0px");
    } else if (menuStatus === 1 && document.body.clientWidth > options.switchValue) {
      menuStatus = 0;
      changeStyleForAll(allMobilOpenButtons, "display", "none");
      changeStyleForAll(allViewButtons, "display", "none");
      changeStyleForAll(allMainULs, "height", "");
    }
  };
  
  if (window.addEventListener) {
    window.addEventListener("resize", changesForResize);
  } else if (window.onresize === null) {
    window.onresize = changesForResize;    
  } else {
    var oldResizeFunc = window.onresize;
    window.onresize = function () {
      oldResizeFunc();
      changesForResize();
    };
  } 
})();


