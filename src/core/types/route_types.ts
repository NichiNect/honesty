export type HTTPMethod = 'get' | 'post'

export type RouteSchema = {
    method: HTTPMethod,
    path: string,
    handler: Function
}