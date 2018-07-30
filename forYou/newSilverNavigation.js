document.addEventListener("DOMContentLoaded", function () {
  'use strict';
  console.info("silverNavigation builder is called");
  
  var defaults = {
    switchPoint       : "768px",
    animationTime     : 1,
    buttonTagType     : "BUTTON",
    subButtonContent  : '<svg viewBox="0 0 1024 1024"><path d="M256 1024c-6.552 0-13.102-2.499-18.101-7.499-9.998-9.997-9.998-26.206 0-36.203l442.698-442.698-442.698-442.699c-9.998-9.997-9.998-26.206 0-36.203s26.206-9.998 36.203 0l460.8 460.8c9.998 9.997 9.998 26.206 0 36.203l-460.8 460.8c-5 5-11.55 7.499-18.102 7.499z" /></svg>',
    mainButtonContent : 'Menü'
  };
  
  var options = {
    activeClassForLI  : "active",
    openButtonClass   : "open",
    subpageULClass    : "subpages",
    navigationClass   : "silverNavigation",
    horizontalClass   : "horizontal",
    propertyParameter : "silverNavData"
  };


  
  var remInPixel;
  function refreshRemInPixel () {
    remInPixel = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return remInPixel;
  }
  refreshRemInPixel();
  
  function getValueData (dataString, toFind) {
    var start = dataString.indexOf(toFind);
    var data = "";
    if (start !== -1) {
      start += toFind.lenght;
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
  
  var allSilverNavigations;
  (function(){
    allSilverNavigations = document.getElementsByClassName(options.navigationClass);
    if (allSilverNavigations.length < 1) {
      console.warn("No element with the class '%s' found!", options.navigationClass);
      return;
    } 
    function searchForSubpage (ULChildren) {
      var dRunMax = ULChildren.length;
      for (var d = 0; d < dRunMax; d++) {
        var LI = ULChildren[d];
        if (LI.tagName === "LI") {
          var LIChildren = LI.children;
          for (var e = 0; e < LIChildren.length; e++) {
            var subUL = LIChildren[e];
            if (subUL.tagName === "UL") {
              var subButton = document.createElement(buttonTagType);
              var subULChildrenLength = subUL.children.length;
              silverNavData.buttons.push(subButton);
              searchForSubpage(subUL.children);
              if (LI.className.indexOf(options.activeClassForLI) > -1) {
                silverNavData.activeULs.push(subUL);
              } else {
                silverNavData.normalULs.push(subUL);
              }
              subUL[options.propertyParameter] = subButton;
              subButton[options.propertyParameter] = {
                target        : subUL,
                animationTime : animationTime * (subULChildrenLength / 5)
              };
              subUL.style.overflowY = "hidden";
              addClass(LI, options.subpageULClass);
              subButton.innerHTML = subButtonContent;
              LI.insertBefore(subButton, subUL);
              e++;
            }
          }
        }
      }
    }
    for (var b = 0; b < allSilverNavigations.length; b++) {
      var tempNav = allSilverNavigations[b];
      var tempData = tempNav.getAttribute("data-silvernavigation");
      var navChildren = tempNav.children;
      var animationTime = defaults.animationTime;
      var buttonTagType = defaults.buttonTagType;
      var subButtonContent = defaults.subButtonContent;
      var mainButtonContent = defaults.mainButtonContent;
      tempNav[options.propertyParameter] = {
        switchPoint : defaults.switchPoint,
        status      : 0,
        buttons     : [],
        normalULs   : [],
        activeULs   : []
      };
      var silverNavData = tempNav[options.propertyParameter];
      if (tempData !== null && tempData !== "") {
        saveInSave(silverNavData, "switchPoint", getValueData(tempData, "switchPoint"));
        var tempValue = getValueData(tempData, "switchPoint");
        if (tempValue !== undefined && tempValue !== null && tempValue !== "") {
          silverNavData.switchPoint = tempValue; 
        }
        tempValue = getValueData(tempData, "animationTime");
        if (tempValue !== undefined && tempValue !== null && tempValue !== "") {
          animationTime = parseFloat(tempValue); 
        }
        tempValue = getValueData(tempData, "mainButtonContent");
        if (tempValue !== undefined && tempValue !== null && tempValue !== "") {
          mainButtonContent = tempValue; 
        }
        tempValue = getValueData(tempData, "buttonTagType");
        if (tempValue !== undefined && tempValue !== null && tempValue !== "") {
          buttonTagType = tempValue; 
        }
        tempValue = getValueData(tempData, "subButtonContent");
        if (tempValue !== undefined && tempValue !== null && tempValue !== "") {
          subButtonContent = tempValue; 
        }
      }
      for (var c = 0; c < navChildren.length; c++) {
        var mainUL = navChildren[c];
        if (mainUL.tagName === "UL") {
          var mainButton = document.createElement(buttonTagType);
          var mainULChildrenLength = mainUL.children.length;
          silverNavData.normalULs.push(mainUL);
          silverNavData.buttons.push(mainButton);
          searchForSubpage(mainUL.children);
          mainUL[options.propertyParameter] = mainButton;
          mainButton[options.propertyParameter] = {
            target        : mainUL,
            animationTime : animationTime * (mainULChildrenLength / 5)
          };
          mainUL.style.overflowY = "hidden";
          mainButton.innerHTML = mainButtonContent;
          tempNav.insertBefore(mainButton, mainUL);
          break;
        }
      }
      changeToDesktop(tempNav);
    }
  })();

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
  
  function addClass (element, classString) {
    var className = element.className;
    if (className.indexOf(classString) === -1) {
      element.className = className + classString;
    }
  }
  
  function removeClass (element, classString) {
    var className = element.className;
    while (className.indexOf(classString) > -1) {
      className = className.replace(classString, "");
    }
    element.className = className;
  }
  
  function expandToAutoHeight () {
    this.removeEventListener("click", expandToAutoHeight);
    var button = this;
    var element = button[options.propertyParameter].target;
    var targetHeight = element.scrollHeight;
    var startHeight = element.offsetHeight;
    var addingPerFrame = Math.round((targetHeight - startHeight) / (1000 * button[options.propertyParameter].animationTime / 60));
    var heightChange = function () {
      startHeight += addingPerFrame;
      if (startHeight < targetHeight) {
        element.style.height = startHeight + "px";
        requestAnimationFrame(heightChange);
      } else {
        element.style.height = "";
        button.addEventListener("click", collapseToNullHeight);
      }
    };
    addClass(button, options.openButtonClass);
    requestAnimationFrame(heightChange);
  }
  
  function collapseToNullHeight () {
    this.removeEventListener("click", collapseToNullHeight);
    var button = this;
    var element = button[options.propertyParameter].target;
    var startHeight = element.offsetHeight;
    var removePerFrame = Math.round(startHeight / (1000 * button[options.propertyParameter].animationTime / 60));
    var heightChange = function () {
      startHeight -= removePerFrame;
      if (startHeight >= 1) {
        element.style.height = startHeight + "px";
        requestAnimationFrame(heightChange);
      } else {
        removeClass(button, options.openButtonClass);
        element.style.height = "0px";
        button.addEventListener("click", expandToAutoHeight);
      }
    };
    requestAnimationFrame(heightChange);
  }
  
  function changeToDesktop (navigation) {
    var data = navigation[options.propertyParameter];
    var normalULs = data.normalULs;
    var activeULs = data.activeULs;
    var buttons = data.buttons;
    for (var h = 1; h < normalULs.length; h++) {
      normalULs[h].style.height = "0px";  
    }
    normalULs[0].style.height = "";
    for (h = 0; h < activeULs.length; h++) {
      activeULs[h].style.height = "";  
    }
    for (h = 0; h < buttons.length; h++) {
      buttons[h].style.display = "none";
    }
  }
  
  function changeToMobile (navigation) {
    var data = navigation[options.propertyParameter];
    var normalULs = data.normalULs;
    var activeULs = data.activeULs;
    var buttons = data.buttons;
    var openButtonClass = options.openButtonClass;
    for (var h = 0; h < buttons.length; h++) {
      var tempButton = buttons[h];
      tempButton.removeEventListener("click", collapseToNullHeight);
      tempButton.addEventListener("click", expandToAutoHeight);
      removeClass(tempButton, openButtonClass);
      tempButton.style.display = "";
    }
    for (h = 0; h < activeULs.length; h++) {
      var tempActiveUL = activeULs[h];
      tempButton = tempActiveUL[options.propertyParameter];
      tempButton.removeEventListener("click", expandToAutoHeight);
      tempButton.addEventListener("click", collapseToNullHeight);
      addClass(tempButton, openButtonClass);
      tempActiveUL.style.height = "";
    }
    for (h = 0; h < normalULs.length; h++) {
      normalULs[h].style.height = "0px";  
    }
  }

  function changesForResize () {
    refreshRemInPixel();
    var windowInnerWidth = window.innerWidth;
    for (var g = 0; g < allSilverNavigations.length; g++) {
      var tempNavigation = allSilverNavigations[g];
      var tempData = tempNavigation[options.propertyParameter];
      var switchPoint = parseFloat(tempData.switchPoint);
      if (tempData.switchPoint[tempData.switchPoint.length - 1] === "m") {
        switchPoint *= remInPixel; 
      }
      if (tempData.status === 0 && windowInnerWidth <= switchPoint) {
        tempData.status = 1;
        changeToMobile(tempNavigation);
      } else if (tempData.status === 1 && windowInnerWidth > switchPoint) {
        tempData.status = 0;
        changeToDesktop(tempNavigation);
      }
    }
  };
  changesForResize();
  window.addEventListener("resize", changesForResize);
});