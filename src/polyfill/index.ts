import 'core-js/features/url'
import { timers } from '@dcl-sdk/utils'
import {XMLHttpRequest} from "./xmlhttprequest";

Object.assign(globalThis, {
  FormData: class FormData {},
  clearTimeout: timers.clearTimeout,
  setTimeout: timers.setTimeout,
  XMLHttpRequest: XMLHttpRequest,
})


if (console != null && !(console as any).warn) (console as any).warn = (...args: any[]) => console.log('WARNING', ...args)