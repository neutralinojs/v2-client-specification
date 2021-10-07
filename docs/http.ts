//@ts-ignore
import * as events from '../api/events';

/*/
    this file is a adaptation of https://github.com/neutralinojs/neutralino.js
/*/

// Test here the type checking
request ("app.getConfig", "get")



declare global {interface Window {
    NL_PORT: number
    NL_TOKEN: string
}}


import type * as Api from '../neutralino.api'


type Paths
    = keyof Api.paths extends `/__nativeMethod_${infer P}` ? P
    : never

type NativePath <P extends Paths> = `/__nativeMethod_${P}`

type GetRequest <P extends Paths, T extends keyof Api.paths[NativePath <P>]>
    = Api.paths[NativePath <P>][T] extends {
        requestBody: {
            content: { ["application/json"]: any }
        }
    }
    ? Api.paths[NativePath <P>][T]["requestBody"]["content"]["application/json"]
    : never

type GetResponse <P extends Paths, T extends keyof Api.paths[NativePath <P>]>
    = Api.paths[NativePath <P>][T] extends {
        responses: {
            '200': { content: { ["application/json"]: any } }
        }
    }
    ? Api.paths[NativePath <P>][T]["responses"]['200']["content"]["application/json"]
    : never

export function request <P extends Paths, T extends keyof Api.paths[NativePath <P>]> (
    url: P, type: T, data?: GetRequest <P, T>
): Promise <GetResponse <P, T>>

{
    return new Promise((resolve: any, reject: any) => {

        if(data)
            data = JSON.stringify(data) as any;
            
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic ' + window.NL_TOKEN);

        fetch(url, {
            method: type as "get"|"post",
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
