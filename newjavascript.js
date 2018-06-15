var silverNavigationStarter = function () {
  'use strict';
  console.info("silverNavigation builder is called");
  var options = {
    switchValue       : 768,
    activeClassForLI  : "active",
    navigationClass   : "silverNavigation",
    buttonTagType     : "BUTTON",
    menuButtonValue   : "---",
    supButtonValue    : ">",
    timeForAnimation  : 1,
    propertyParameter : "silverNavData",
    switchHorizontal  : false
  };
  
  var remInPixel;
  function refreshRemInPixel () {
    remInPixel = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return remInPixel;
  }
  refreshRemInPixel();
  
  function findAndReturnValueData (dataString, toFind) {
    var start = dataString.indexOf(toFind);
    var data = "";
    if (start !== -1) {
      start += toFind;
      if (start === "=") {
        for (start += 1; start < dataString.length; start++) {
          var tempChar = dataString[start];
          if (tempChar === "," || tempChar === " ") {
            break;
          }
          data += tempChar;
        }
      }
    }
    return data;
  }
  
  var allNavigations = [];
  (function(){
    var tempAllNavList = document.getElementsByTagName("NAV");
    for (var tempCount; tempCount < tempAllNavList.length; tempCount++) {
      var tempNav = tempAllNavList[tempCount];
      var tempData = tempNav.getAttribute("data-silvernavigation");
      if (tempData !== null && tempData !== "") {
        var tempDataValue = findAndReturnValueData(tempData, "switchPoint");
        if (tempDataValue === "") {
          
        }
      }
    }
  })();

  
  var allMainULs = [];
  var allMobilOpenButtons = [];
  var allViewButtons = [];
  var allActiveSubUL = [];
  var allNotActiveSubUL = [];
  
  if (window.requestAnimationFrame === undefined) {
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
  } else {
    var requestAnimationFrame = window.requestAnimationFrame;
  }
  
  var allNavigations = getElementsByClassName(document.body, options.navigationClass);
  if (allNavigations.length < 1) {
    console.warn("No element with the class '%s' found!", options.navigationClass);
  } 
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
        mobilOpenButton[options.propertyParameter] = mainUL;
        mobilOpenButton.onclick = expandToAutoHeight;
        mainUL.style.overflowY = "hidden";
        mobilOpenButton.innerHTML = options.menuButtonValue;
        currentNav.insertBefore(mobilOpenButton, mainUL);
        c++;
      }
    }
  }
  
  function searchForSubpage (ULChildNodes) {
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
              allActiveSubUL.push(subUL);
              viewButton.onclick = collapseToNullHeight;  
            } else {
              allNotActiveSubUL.push(subUL);
              subUL.style.height = "0px";
              viewButton.onclick = expandToAutoHeight;
            }
            subUL[options.propertyParameter] = viewButton;
            viewButton[options.propertyParameter] = subUL;
            subUL.style.overflowY = "hidden";
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
    var element = button[options.propertyParameter];
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
    var element = button[options.propertyParameter];
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
      changeStyleForAll(allActiveSubUL, "height", "");
      changeStyleForAll(allNotActiveSubUL, "height", "0px");
      for (var u = 0; u < allActiveSubUL.length; u++) {
        allActiveSubUL[u][options.propertyParameter].onclick = collapseToNullHeight;
      }
      for (var t = 0; t < allNotActiveSubUL.length; t++) {
        allNotActiveSubUL[t][options.propertyParameter].onclick = expandToAutoHeight;
      }
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
};

if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", silverNavigationStarter);
} else if (window.onload === null) {
  window.onload = silverNavigationStarter;
} else {
  var priorOnloadFuncSure = window.onload;
  window.onload = function () {
    priorOnloadFuncSure();
    silverNavigationStarterSure();
  };
}