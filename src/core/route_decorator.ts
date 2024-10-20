import 'reflect-metadata';
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { RouteSchema, HTTPMethod } from './types/route_types';

const routeMetadataKey = Symbol('routes');

export function Get(path: string) {

    return function (target: any,  _: string, descriptor: TypedPropertyDescriptor<(ctx: Context) => Promise<any>>) {

        const routes = Reflect.getMetadata(routeMetadataKey, target.constructor) || [];
        routes.push({ method: 'get', path, handler: descriptor.value });

        Reflect.defineMetadata(routeMetadataKey, routes, target.constructor);
    };
  }

export function Post(path: string) {

    return function (target: any,  _: string, descriptor: TypedPropertyDescriptor<(ctx: Context) => Promise<any>>) {

        const routes = Reflect.getMetadata(routeMetadataKey, target.constructor) || [];
        routes.push({ method: 'post', path, handler: descriptor.value });

        Reflect.defineMetadata(routeMetadataKey, routes, target.constructor);
    };
}

export function applyRoutes(app: Hono, controller: any) {

    const instance = new controller();
    const routes: RouteSchema[] = Reflect.getMetadata(routeMetadataKey, controller);

    if (routes) {

        routes.forEach((route: any) => {
            app[route.method as HTTPMethod](route.path, (ctx: Context) => route.handler.call(instance, ctx));
        });
    }
}
