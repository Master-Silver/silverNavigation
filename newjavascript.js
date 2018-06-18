document.addEventListener("DOMContentLoaded", function () {
  'use strict';
  console.info("silverNavigation builder is called");
  
  var defaults = {
    switchPoint       : "768px",
    animationTime     : 0.7,
    buttonTagType     : "BUTTON",
    subButtonContent  : ">",
    mainButtonContent : "menu"
  };
  
  var options = {
    activeClassForLI  : "active",
    navigationClass   : "silverNavigation",
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
  
  var allMainULs = [];
  var allMainButtons = [];
  var allSubButtons = [];
  var allActiveSubUL = [];
  var allNotActiveSubUL = [];
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
              allSubButtons.push(subButton);
              var subULChildrenLength = subUL.children.length;
              searchForSubpage(subUL.children);
              if (LI.className.indexOf(options.activeClassForLI) > -1) {
                allActiveSubUL.push(subUL);
                subButton.addEventListener("click", collapseToNullHeight);
              } else {
                allNotActiveSubUL.push(subUL);
                subUL.style.height = "0px";
                subButton.addEventListener("click", expandToAutoHeight);
              }
              subUL[options.propertyParameter] = subButton;
              subButton[options.propertyParameter] = {
                target        : subUL,
                animationTime : animationTime * (subULChildrenLength / 5)
              };
              subUL.style.overflowY = "hidden";
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
        switchPoint       : defaults.switchPoint,
        status            : 0
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
          allMainULs.push(mainUL);
          allMainButtons.push(mainButton);
          searchForSubpage(mainUL.children);
          mainButton[options.propertyParameter] = {
            target        : mainUL,
            animationTime : animationTime * (mainULChildrenLength / 5)
          };
          mainButton.addEventListener("click", expandToAutoHeight);
          mainUL.style.overflowY = "hidden";
          mainButton.innerHTML = mainButtonContent;
          tempNav.insertBefore(mainButton, mainUL);
          break;
        }
      }
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
  
  function expandToAutoHeight () {
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
        button.removeEventListener("click", expandToAutoHeight);
        button.addEventListener("click", collapseToNullHeight);
      }
    };
    requestAnimationFrame(heightChange);
  }
  
  function collapseToNullHeight () {
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
        element.style.height = "0px";
        button.removeEventListener("click", collapseToNullHeight);
        button.addEventListener("click", expandToAutoHeight);
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
    changeStyleForAll(allMainButtons, "display", "inline-block");
    changeStyleForAll(allSubButtons, "display", "inline-block");
    changeStyleForAll(allMainULs, "height", "0px");
  } else {
    var menuStatus = 0;
    changeStyleForAll(allMainButtons, "display", "none");
    changeStyleForAll(allSubButtons, "display", "none");
    changeStyleForAll(allMainULs, "height", "");
  }
  
  var changesForResize = function () {
    refreshRemInPixel();
    var windowInnerWidth = window.innerWidth;
    for (g = 0; g < allSilverNavigations.length; g++) {
      var tempNavigation = allSilverNavigations[g];
      var tempData = tempNavigation[options.propertyParameter];
      var switchPoint = parseFloat(tempData.switchPoint);
      if (tempData.switchPoint[tempData.switchPoint.length - 1] === "m") {
        switchPoint *= remInPixel; 
      }
      if (tempData.status === 0 && windowInnerWidth <= switchPoint) {
        tempData.status = 1;
        for (var v = 0;v < allMainButtons.length; v++) {
          allMainButtons[v].removeEventListener("click", collapseToNullHeight);
          allMainButtons[v].addEventListener("click", expandToAutoHeight);
        }
        changeStyleForAll(allMainButtons, "display", "inline-block");
        changeStyleForAll(allSubButtons, "display", "inline-block");
        changeStyleForAll(allMainULs, "height", "0px");
      } else if (tempData.status === 1 && windowInnerWidth > switchPoint) {
        tempData.status = 0;
        changeStyleForAll(allMainButtons, "display", "none");
        changeStyleForAll(allSubButtons, "display", "none");
        changeStyleForAll(allMainULs, "height", "");
        changeStyleForAll(allActiveSubUL, "height", "");
        changeStyleForAll(allNotActiveSubUL, "height", "0px");
        for (var u = 0; u < allActiveSubUL.length; u++) {
          var tempButton = allActiveSubUL[u][options.propertyParameter];
          tempButton.removeEventListener("click", expandToAutoHeight);
          tempButton.addEventListener("click", collapseToNullHeight);
        }
        for (var t = 0; t < allNotActiveSubUL.length; t++) {
          tempButton = allNotActiveSubUL[t][options.propertyParameter];
          tempButton.removeEventListener("click", collapseToNullHeight);
          tempButton.addEventListener("click", expandToAutoHeight);
        }
      }
    }
  };
  
  window.addEventListener("resize", changesForResize);
});