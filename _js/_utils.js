//
// Variables shared across files.
//
var OFFLINE_ARTICLE_PREFIX = 'chrisruppel-offline--';


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
var ga = window.ga || function () {
  console.log('💁 GA would have logged:', [].slice.call(arguments).join(', '));
};

var _paq = window._paq || function () {};
if (typeof _paq.push !== 'function') {
  _paq.push = function () {
    console.log('💁 Piwik would have logged:', arguments[0].join(', '));
  };
}
