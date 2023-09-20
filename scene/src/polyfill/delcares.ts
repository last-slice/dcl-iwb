import * as utils from '@dcl-sdk/utils'
import { XMLHttpRequest } from './xmlhttprequest'

console.log("DECLARING!!!")

type Timeout={}

function clearTimeout(timer:string | number | Timeout | undefined){
    //console.log("DECLARING","clearTimeout called!!!",timer)
    //simulate
    if(timer !== undefined){
        utils.timers.clearTimeout(timer as any)
    }
}
function setTimeout(fn:()=>void,time:number){
    //console.log("DECLARING","setTimeout called!!!",fn,time)
    //simulate
    return utils.timers.setTimeout( fn, time )
}
class FormData{} 

//https://github.com/mathiasbynens/base64/blob/master/src/base64.js
//start base64 encode
    /*var InvalidCharacterError = function(message:any) {
        this.message = message;
    };
    
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';
    */
    class InvalidCharacterError extends Error{}

    var error = function(message:any) {
        // Note: the error messages used throughout this file match those used by
        // the native `atob`/`btoa` implementation in Chromium.
        throw new InvalidCharacterError(message);
    };

    var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // http://whatwg.org/html/common-microsyntaxes.html#space-character
    var REGEX_SPACE_CHARACTERS = /<%= spaceCharacters %>/g;
    // `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	const btoaEncode = function(input:string) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};
    export const base64 = {
		'encode': btoaEncode,
		//'decode': decode,
		//'version': '<%= version %>'
	};
//end base64 encode

/**
 * This is a workaround to solve a runtime issues
 * 
 */
Object.assign(globalThis, {
    FormData: FormData,
    XMLHttpRequest: XMLHttpRequest,
    clearTimeout: clearTimeout,
    setTimeout: setTimeout,
    btoa: btoaEncode,
})

if (console != null && !(console as any).warn) (console as any).warn = (...args: any[]) => console.log('WARNING', ...args)
