import $ from 'jquery';

import Server from '../server/server_config.json';

export default class Utils {

  constructor() {
  }

  static post = (action = '', payload = {}, success = () => {}, error = () => {}, dataType = 'json') => {
    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      type: 'POST',
      url: Utils.getUrl() + action,
      dataType: dataType,
      data: payload,
      success: success,
      error: error
    });
  }

  static get = (action = '', payload = {}, success = () => {}, error = () => {}) => {
    /*$.ajax({
      xhrFields: {
        withCredentials: true
      },
      type: 'GET',
      url: Utils.getUrl() + action,
      dataType: 'json',
      data: payload,
      success: success,
      error: error
    });*/
  }

  static getUrl = () => {
    let url = '';
    if(process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
       url = 'http://localhost:80/';
    } else {
       url = 'http://' + Server.server_domain + ':' + Server.server_port + '/';
    }

    return url;
  }

  static setlocalStorageItem = (cname, cvalue, exdays) => {
    if (window.localStorage) {
      window.localStorage.setItem(cname, cvalue);
    } else {
      Utils.setCookie(cname, cvalue, exdays);
    }
  }

  static getlocalStorageItem = (cname) => {
    let value = '';
    if (window.localStorage) {
      value = window.localStorage.getItem(cname);
    } else {
      value = Utils.getCookie(cname);
    }

    return (value === null ? '' : value);
  }

  static setCookie = (cname, cvalue, exdays) => {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  }

  static getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++)
    {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if(c.indexOf(name) === 0) return c.substring(name.length,c.length);
    }

    return "";
  }

  static isValidEmailAddress = (emailAddress) => {
    let pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

    return pattern.test(emailAddress);
  }

  static getCurrentTime = (date) => {
    let d = (date ? new Date(date) : new Date());
    let offset = (new Date().getTimezoneOffset() / 60) * -1;
    let n = new Date(d.getTime() + offset);
    let time = n.getDate() + '.' + (n.getMonth() + 1) + '.' + n.getFullYear() + '  '
    + (n.getHours() < 10 ? '0' : '') + n.getHours() + ':' + (n.getMinutes() < 10 ? '0' : '') + n.getMinutes();
    return time;
  }

}
