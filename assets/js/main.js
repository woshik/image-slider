'use strict';

(function () {
  var parent,
    sliderItems,
    left = 0,
    mouseDownPosition = 0,
    mouseMovePosition = 0,
    newDistance = 0,
    interval = null,
    touchDevice;
  document.addEventListener('DOMContentLoaded', function () {
    touchDevice = is_touch_device();
    parent = document.querySelector('#image-slider'); // main slider element

    sliderItems = document.querySelectorAll('#image-slider .item'); // slider children element

    if (sliderItems.length > 1) {
      appendImageList();
      prependImageList();
    } // clone last image slider

    parent.addEventListener('mousedown', dragStart);
    parent.addEventListener('mouseup', dragEnd);
    parent.addEventListener('mousemove', dragAction);
    parent.addEventListener('mouseleave', dragEnd); // browser defult drag event override

    document.ondragstart = function () {
      return false;
    };
  }); // slider autoplay  seting

  window.onload = function () {
    if (!touchDevice) {
      var animationInterval = function animationInterval() {
        if (interval === null) {
          interval = setInterval(animation, 30);
        }
      };

      var animation = function animation() {
        left -= 1;
        parent.style.transform = 'translateX(' + left + 'px)';
        infinityScroll();
      };

      var stopAnimation = function stopAnimation() {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };

      left = -sliderItems[0].getBoundingClientRect().left;
      parent.style.transform = 'translateX(' + left + 'px)'; // animation

      setTimeout(function () {
        animationInterval();
        parent.addEventListener('mouseover', stopAnimation);
        parent.addEventListener('mouseout', animationInterval);
      }, 500);
    } else {
      var imageList = document.querySelectorAll('#image-slider .item');
      document
        .querySelector('.slider-scroller')
        .scrollTo(imageList[sliderItems.length].getBoundingClientRect().left, 0);
      document.querySelector('.slider-scroller').style.overflowX = 'scroll';
      document.querySelector('.slider-scroller').addEventListener('scroll', function (e) {
        var imageList = document.querySelectorAll('#image-slider .item');

        if (inViewPort(imageList[imageList.length - 1])) {
          var newposition =
            e.currentTarget.scrollLeft +
            imageList[sliderItems.length - 1].getBoundingClientRect().left -
            window.innerWidth;
          document.querySelector('.slider-scroller').scrollTo(newposition, 0);
        } else if (e.currentTarget.scrollLeft === 0) {
          var newposition = imageList[sliderItems.length].getBoundingClientRect().left;
          document.querySelector('.slider-scroller').scrollTo(newposition, 0);
        }
      });
    }
  }; // slider drag start event

  function dragStart(e) {
    e.preventDefault();
    parent.style.cursor = 'grabbing';
    mouseDownPosition = e.clientX;
  } // slider dragging event

  function dragAction(e) {
    e.preventDefault();

    if (mouseDownPosition !== 0) {
      mouseMovePosition = e.clientX;
      newDistance = left + (mouseMovePosition - mouseDownPosition);

      if (newDistance >= 0) {
        newDistance = 0;
      }

      parent.style.transform = 'translateX(' + newDistance + 'px)';
      infinityScroll();
    }
  } // slider drag end event

  function dragEnd() {
    parent.style.cursor = 'grab';
    left = getTransformPosition();
    mouseDownPosition = 0;
  }

  function infinityScroll() {
    var imageList = document.querySelectorAll('#image-slider .item');

    if (imageList.length > 1) {
      if (inViewPort(imageList[imageList.length - 1])) {
        dragEnd();
        var currentPosition = getTransformPosition();
        var imageNumver = (sliderItems.length - 1) * 2;
        var newposition = currentPosition - imageList[imageNumver].getBoundingClientRect().right;
        left = newposition + window.innerWidth;
        parent.style.transform = 'translateX(' + left + 'px)';
      } else if (inViewPort(imageList[0])) {
        dragEnd();
        var currentPosition = getTransformPosition();
        var imageNumver = sliderItems.length + 1;
        var newposition = currentPosition - imageList[imageNumver].getBoundingClientRect().left;
        left = newposition;
        parent.style.transform = 'translateX(' + left + 'px)';
      }
    }
  }

  function getTransformPosition() {
    return parseInt((parent.style.transform.match(/-*[0-9]+/) || {})[0] || 0);
  }

  function is_touch_device() {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  }

  function appendImageList() {
    for (var i = 0; i < sliderItems.length; i++) {
      var cloneImage = sliderItems[i].cloneNode(true);
      document.querySelector('#image-slider').appendChild(cloneImage);
    }
  }

  function prependImageList() {
    for (var i = sliderItems.length - 1; i >= 0; i--) {
      var cloneImage = sliderItems[i].cloneNode(true);
      document
        .querySelector('#image-slider')
        .insertBefore(cloneImage, document.querySelectorAll('#image-slider .item')[0]);
    }
  }

  function inViewPort(element) {
    var bounding = element.getBoundingClientRect();

    if (
      bounding.top >= 0 &&
      bounding.right >= 0 &&
      bounding.left <= (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
      return true;
    } else {
      return false;
    }
  }
})();
