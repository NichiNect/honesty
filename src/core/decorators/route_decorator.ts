import 'reflect-metadata';
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { IRouteSchema, IHTTPMethod } from '../types/route_types';
import { getMiddlewares } from './middleware_decorator';
import { middlewareAliases } from '../../middleware';

const routeMetadataKey = Symbol('routes');

/**
 * Decorator for HTTP Get method.
 */
export function Get(path: string) {

    return function (target: any,  propertyKey: string, descriptor: TypedPropertyDescriptor<(ctx: Context) => Promise<any>>) {

        if (!descriptor.value) {
            throw new Error('Descriptor value is undefined. Make sure the decorator Get is applied correctly.');
        }

        const routes: IRouteSchema[] = Reflect.getMetadata(routeMetadataKey, target.constructor) || [];
        routes.push({
            method: 'get', 
            path, 
            handler: descriptor.value,
            handlerName: propertyKey
        });

        Reflect.defineMetadata(routeMetadataKey, routes, target.constructor);
    }
}

/**
 * Decorator for HTTP Post method.
 */
export function Post(path: string) {

    return function (target: any,  propertyKey: string, descriptor: TypedPropertyDescriptor<(ctx: Context) => Promise<any>>) {

        if (!descriptor.value) {
            throw new Error('Descriptor value is undefined. Make sure the decorator Get is applied correctly.');
        }

        const routes: IRouteSchema[] = Reflect.getMetadata(routeMetadataKey, target.constructor) || [];
        routes.push({
            method: 'post',
            path, 
            handler: descriptor.value,
            handlerName: propertyKey
        });

        Reflect.defineMetadata(routeMetadataKey, routes, target.constructor);
    }
}

/**
 * Function for applying the route by controller class.
 */
export function applyRoutes(app: Hono, controller: any, injectMiddlewares: string[] | Function[] = []): void {

    const instance = new controller();
    const routes: IRouteSchema[] = Reflect.getMetadata(routeMetadataKey, controller) || [];

    if (routes) {

        routes.forEach((route: IRouteSchema) => {

            // ? Registering Middleware to route declaration.
            const middlewares = getMiddlewares(controller.prototype, route.handlerName) || [];

            // ? Push injectable middleware controller.
            if (injectMiddlewares?.length > 0) {

                for (const injectableMiddleware of injectMiddlewares) {

                    if (typeof injectableMiddleware == 'string') {
                        if (!middlewareAliases[injectableMiddleware]) {
                            throw new Error(`Middleware alias ${injectableMiddleware} not found. Please be sure to register.`);
                        }
                        middlewares.push(middlewareAliases[injectableMiddleware])
                    } else if (typeof injectableMiddleware == 'function') {
                        middlewares.push(injectableMiddleware);
                    }
                }
            }

            if (middlewares.length > 0) {
                app[route.method as IHTTPMethod](route.path, ...middlewares, (ctx: Context) => route.handler.call(instance, ctx));
            } else {
                app[route.method as IHTTPMethod](route.path, (ctx: Context) => route.handler.call(instance, ctx));
            }
        })
    }
}
