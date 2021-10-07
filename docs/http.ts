//@ts-ignore
import * as events from '../api/events';

/*/
    this file is a adaptation of https://github.com/neutralinojs/neutralino.js/blob/main/src/http/request.ts
/*/

// Test here the type checking
request ("app.getConfig", "get").then (config => console.log (config.modes.window.title))


declare global {interface Window {
    NL_PORT: number
    NL_TOKEN: string
}}

import type * as Api from '../neutralino.api'


// The original signature is `function request(options: RequestOptions): Promise<any>`,
// note that an 'arguments' is already an object in Javascript,
// it is not necessary to create a sub-object (`RequestOptions`) to pass to this function

export function request <P extends Paths, T extends GetRequestMethods <P>> (
    url: P, type: T, data?: GetOptions <P, T>, isNativeMethod?: boolean
): Promise <GetResponse <P, T>>

export function request <P extends Paths, T extends GetRequestMethods <P>> (
    url: string, type: "get"|"post", data?: any, isNativeMethod: boolean = true
): Promise <GetResponse <P, T>>
{
    return new Promise((resolve: any, reject: any) => {

        if(isNativeMethod)
            url = 'http://localhost:' + window.NL_PORT + '/__nativeMethod_' + url;

        if(data)
            data = JSON.stringify(data);
            
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic ' + window.NL_TOKEN);

        fetch(url, {
            method: type,
            headers,
            body: data
        })
            .then(async (resp: Response) => {
                let respData: string = await resp.text();
                let respObj: any = null;
                
                if(respData) {
                    respObj = JSON.parse(respData);
                }

                if(respObj && respObj.success) {
                    resolve(respObj.hasOwnProperty('returnValue') 
                        ? respObj.returnValue 
                        : respObj);
                }
                if(respObj && respObj.error)
                    reject(respObj.error);
            })
            .catch((e: any) => {
                let error = {
                    code: 'NE_CL_NSEROFF',
                    message: 'Neutralino server is offline. Try restarting the application'
                };
                events.dispatch('serverOffline', error);
                reject(error);
            });
    });
}

// Types utilities

type Paths
    = keyof Api.paths extends `/__nativeMethod_${infer P}` ? P
    : never

type NativePath <P extends Paths> = `/__nativeMethod_${P}`

type GetRequestMethods <P extends Paths>
    = keyof Api.paths[NativePath <P>]

type GetOptions <P extends Paths, T extends GetRequestMethods <P>>
    = Api.paths[NativePath <P>][T] extends {
        requestBody: {
            content: { ["application/json"]: any }
        }
    }
    ? Api.paths[NativePath <P>][T]["requestBody"]["content"]["application/json"]
    : never

type GetResponse <P extends Paths, T extends GetRequestMethods <P>>
    = Api.paths[NativePath <P>][T] extends {
        responses: {
            '200': { content: { ["application/json"]: any } }
        }
    }
    ? Api.paths[NativePath <P>][T]["responses"]['200']["content"]["application/json"]
    : never

