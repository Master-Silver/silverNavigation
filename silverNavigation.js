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
  var allNavigations = [];
  var allMobilOpenButtons = [];
  
  window.silverNavigationStart = function () {
    alert("hello");
    if (this.children[0] !== undefined && this.children[0].tagName === "UL") {
      var mainUL = this.children[0];
      var mobilOpenButton = document.createElement(options.buttonTagType);
      var ULchildren = mainUL.children;
      var zRunMax = ULchildren.length;
      allNavigations.push(this);
      allMainULs.push(mainUL);
      allMobilOpenButtons.push(mobilOpenButton);
      for (var z = 0; z < zRunMax; z++) {
        var nextChildren = ULchildren[z].children;
        var yRunMax = nextChildren.length;
        for (var y = 0; y < yRunMax; y++) {
          if (nextChildren[y].tagName === "UL") {
            var nextUL = nextChildren[y];
            var viewButton = document.createElement(options.buttonTagType);
            if (ULchildren[z].classList.contains(options.activeClassForLI) === false) {
              nextUL.style.height = "0px";
              viewButton.addEventListener("click", expandToAutoHeight);
            } else {
              viewButton.addEventListener("click", collapseToNullHeight); 
            }
            viewButton[options.buttonParameter] = nextUL;
            viewButton.innerHTML = options.supButtonValue;
            nextUL.parentElement.insertBefore(viewButton, nextUL);
            searchForSubpage(nextUL.children);
          }
        }
      }
      this.classList.add(options.navigationClass);
      mobilOpenButton[options.buttonParameter] = mainUL;
      mobilOpenButton.innerHTML = options.menuButtonValue;
      mobilOpenButton.addEventListener("click", expandToAutoHeight);
      this.insertBefore(mobilOpenButton, mainUL);
    }
  };
  
  /*var allNavigations = document.getElementsByClassName(options.navigationClass);
  for (var a = 0; a < allNavigations.length; a++) {
    var currentNav = allNavigations[a];
    if (currentNav.children[0].tagName === "UL") {
      var mainUL = currentNav.children[0];
      allMainULs.push(mainUL);
      searchForSubpage(mainUL.children);
      var mobilOpenButton = document.createElement(options.buttonTagType);
      mobilOpenButton[options.buttonParameter] = mainUL;
      mobilOpenButton.innerHTML = options.menuButtonValue;
      mobilOpenButton.addEventListener("click", expandToAutoHeight);
      currentNav.insertBefore(mobilOpenButton, mainUL);
    }
  }
  
  function searchForSubpage (ULchildren) {
    //console.log(ULchildren);
    var zRunMax = ULchildren.length;
    for (var z = 0; z < zRunMax; z++) {
      var nextChildren = ULchildren[z].children;
      var yRunMax = nextChildren.length;
      for (var y = 0; y < yRunMax; y++) {
        if (nextChildren[y].tagName === "UL") {
          var nextUL = nextChildren[y];
          var viewButton = document.createElement(options.buttonTagType);
          if (ULchildren[z].classList.contains(options.activeClassForLI) === false) {
            nextUL.style.height = "0px";
            viewButton.addEventListener("click", expandToAutoHeight);
          } else {
            viewButton.addEventListener("click", collapseToNullHeight); 
          }
          viewButton[options.buttonParameter] = nextUL;
          viewButton.innerHTML = options.supButtonValue;
          nextUL.parentElement.insertBefore(viewButton, nextUL);
          searchForSubpage(nextUL.children);
        }
      }
    }
  }*/
  
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
    var removePerFrame = Math.round(startHeight / (1000 * options.timeForAnimation / 60));
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
  
  function addForAllClass (elementList, cssClass) {
    for (var x = 0; x < elementList.length; x++) {
      elementList[x].classList.add(cssClass);  
    }
  }
  
  function removeForAllClass (elementList, cssClass) {
    for (var x = 0; x < elementList.length; x++) {
      elementList[x].classList.remove(cssClass);  
    }
  }
  
  function setStyleHeightForAll (elementList, value) {
    for (var w = 0; w < elementList.length; w++) {
      elementList[w].style.height = value; 
    }
  }
  
  if (window.innerWidth <= options.switchValue) {
    var menuStatus = 1; 
    addForAllClass(allNavigations, options.mobileClass);
    setStyleHeightForAll(allMainULs, "0px");
  } else {
    var menuStatus = 0;
    removeForAllClass(allNavigations, options.mobileClass);
    setStyleHeightForAll(allMainULs, "");
  }
  
  window.addEventListener("resize", function () {
    if (menuStatus === 0 && window.innerWidth <= options.switchValue) {
      menuStatus = 1;
      for (var v = 0;v < allMobilOpenButtons.length; v++) {
        allMobilOpenButtons[v].removeEventListener("click", collapseToNullHeight);
        allMobilOpenButtons[v].addEventListener("click", expandToAutoHeight);
      }
      addForAllClass(allNavigations, options.mobileClass);
      setStyleHeightForAll(allMainULs, "0px");
    } else if (menuStatus === 1 && window.innerWidth > options.switchValue) {
      menuStatus = 0;
      removeForAllClass(allNavigations, options.mobileClass);
      setStyleHeightForAll(allMainULs, "");
    }
  });
})();


