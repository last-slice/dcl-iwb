/*

var req = new XMLHttpRequest;
            var k, tmp, arr, str=opts.body;
            var headers = opts.headers || {};

            // IE compatible
            if (opts.timeout) req.timeout = opts.timeout;
            req.ontimeout = req.onerror = function (err) {
                err.timeout = err.type == 'timeout';
                rej(err);
            };

            req.open(method, uri.href || uri);

            req.onload = function () {
                arr = req.getAllResponseHeaders().trim().split(/[\r\n]+/);
                apply(req, req); //=> req.headers

                while (tmp = arr.shift()) {
                    tmp = tmp.split(': ');
                    req.headers[tmp.shift().toLowerCase()] = tmp.join(': ');
                }

                tmp = req.headers['content-type'];
                if (tmp && !!~tmp.indexOf('application/json')) {
                    try {
                        req.data = JSON.parse(req.data, opts.reviver);
                    } catch (err) {
                        apply(req, err);
                        return rej(err);
                    }
                }

                (req.status >= 400 ? rej : res)(req);
            };

            if (typeof FormData < 'u' && str instanceof FormData) ; else if (str && typeof str == 'object') {
                headers['content-type'] = 'application/json';
                str = JSON.stringify(str);
            }

            req.withCredentials = !!opts.withCredentials;

            for (k in headers) {
                req.setRequestHeader(k, headers[k]);
            }

            req.send(str);
*/
/*
type xx = {
    [index: string]: string;
}*/

import { banPlayer } from "../iwb/components/Player"

//looked good but does not work :(
//https://www.npmjs.com/package/xmlhttprequest-ts
//imports node types that conflict with dcl console???
//https://decentralandteam.slack.com/archives/C0292P4HJ93/p1683749722241919
//import { XMLHttpRequest } from 'xmlhttprequest-ts';
//writing my own

//const myx:xx = {2: 's'}

const CLASSNAME = "XMLHttpRequest"
export class XMLHttpRequest {
  ontimeout?: (err: any) => void
  onerror?: (err: any) => void
  onload?: () => void
  withCredentials: any//???
  requestHeaders: Record<string, any> = {}
  timeout?: number

  //responseHeaders:Record<string,any>={}
  responseHeadersRaw?: string
  status?: number
  statusText?: string
  response?: any
  url?: string
  method?: string
  constructor() {
    const METHOD_NAME = "constructor"
    console.log(CLASSNAME, METHOD_NAME, "ENTRY")
  }

  getAllResponseHeaders() {
    return this.responseHeadersRaw
  }

  setRequestHeader(key: string, val: any) {
    const METHOD_NAME = "setRequestHeader"
    console.log(CLASSNAME, METHOD_NAME, "ENTRY", key, val)
    this.requestHeaders[key] = val
  }

  open(method: string, url: string) {
    const METHOD_NAME = "open"
    console.log(CLASSNAME, METHOD_NAME, "ENTRY", method, url)
    //prepares open
    this.method = method
    this.url = url
  }

  send(data: any) {
    const METHOD_NAME = "send"
    console.log(CLASSNAME, METHOD_NAME, "ENTRY", data)
    if (!this.url) {
      throw new Error("url is required")
    }
    if (!this.method) {
      throw new Error("method is required")
    }
    //does the actual open
    fetch(this.url, {
      method: this.method,
      headers: this.requestHeaders, //pretty sure Record<string,string> == { [index: string]: string }
      body: data,
      timeout: this.timeout
    }).then(async (val: Response) => {
      console.log(CLASSNAME, METHOD_NAME, "PROMISE.ENTRY", val)

      this.status = val.status
      this.statusText = val.statusText
      this.response = await val.text() //need to do async
      //must turn this into raw version

      this.responseHeadersRaw = ""
      val.headers.forEach((value: string, key: string) => {
        this.responseHeadersRaw += key + ": " + value + "\r\n"
      })
      console.log(CLASSNAME, METHOD_NAME, "PROMISE.RESULT", "this.status", this.status
        , "this.responseHeadersRaw"
        , this.responseHeadersRaw)
      if (this.onload) this.onload()
    }).catch((reason: any) => {
      console.log('catching reason', reason)
      //colysesus wanted this 'err.timeout = err.type == 'timeout';'
      //20 == abort, 23 == timeout//
      if (reason.code && (reason.code == 20 || reason.code == 23)) reason.type = 'timeout'

      if (this.onerror){
        this.onerror(reason)
        console.log("on error reason", reason)
      }
    })
  }

}