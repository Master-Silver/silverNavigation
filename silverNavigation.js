document.addEventListener("DOMContentLoaded", function () {
  'use strict';
  var options = {
    navigationClass : "silverNavigation",
    buttonClass     : "silverSubpageAcces",
    buttonParameter : "silverData",
    buttonTagType   : "BUTTON",
    buttonValue     : "+",
    pxChangeInS     : 3
  };
  
  var allNavigations = document.getElementsByClassName(options.navigationClass);
  for (var a = 0; a < allNavigations.length; a++) {
    var currentNav = allNavigations[a];
    if (currentNav.children[0].tagName === "UL") {
      searchForSubpage(currentNav.children[0].children);
    }
  }
  
  function searchForSubpage (ULchildren) {
    console.log(ULchildren);
    var zRunMax = ULchildren.length;
    for (var z = 0; z < zRunMax; z++) {
      var nextChildren = ULchildren[z].children;
      var yRunMax = nextChildren.length;
      for (var y = 0; y < yRunMax; y++) {
        if (nextChildren[y].tagName === "UL") {
          var nextUL = nextChildren[y];
          var viewButton = document.createElement(options.buttonTagType);
          viewButton[options.buttonParameter] = nextUL;
          viewButton.classList.add(options.buttonClass);
          viewButton.innerHTML = options.buttonValue;
          viewButton.addEventListener("click", expandToAutoHeight);
          nextUL.style.height = "0px";
          nextUL.style.overflowY = "hidden";
          nextUL.parentElement.insertBefore(viewButton, nextUL);
          searchForSubpage(nextUL.children);
        }
      }
    }
  }
  
  function expandToAutoHeight () {
    var button = this;
    var element = button[options.buttonParameter];
    var targetHeight = element.scrollHeight;
    var startHeight = element.offsetHeight;
    var heightChange = function () {
      startHeight += options.pxChangeInS;
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
    var element = button[options.buttonParameter];
    var startHeight = element.offsetHeight;
    var heightChange = function () {
      startHeight -= options.pxChangeInS;
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
});


