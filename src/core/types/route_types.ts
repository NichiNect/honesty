import type { Context } from "hono"

export type IHTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type IRouteSchema = {
    method: IHTTPMethod,
    path: string,
    handler: (ctx: Context) => Promise<any>,
    handlerName: string
}
