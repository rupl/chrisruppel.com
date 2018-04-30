//
// Variables shared across files.
//
var OFFLINE_ARTICLE_PREFIX = 'chrisruppel-offline--';
var WEBMENTIONS_GET = '/webmentions/get/';
var WEBMENTIONS_POST = '/webmentions/post/';

//
// bling.js but using both qS and qSA
//
window.$ = document.querySelector.bind(document);
window.$$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
}

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.on(name, fn);
  });
}


//
// Blur all form fields
//
// @see http://stackoverflow.com/a/29237391/175551
//
function blurAll() {
  var tmp = document.createElement("input");
  document.body.appendChild(tmp);
  tmp.focus();
  document.body.removeChild(tmp);
}


//
// Avoid analytics errors during local development.
//
var _paq = window._paq || function () {};
if (typeof _paq.push !== 'function') {
  _paq.push = function () {
    console.log('💁 Matomo would have logged:', arguments[0].join(', '));
  };
}
