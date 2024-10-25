import type { Context } from 'hono';
import { middlewares } from '../../middleware';

const middlewareMetadataKey = Symbol('middleware');

export function Middleware(middlewareNames: string[]) {

    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(ctx: Context) => Promise<any>>) {

        if (descriptor.value) {
            Reflect.defineMetadata(middlewareMetadataKey, [...middlewareNames], target, propertyKey);
        } else {
            throw new Error('Descriptor value is undefined. Make sure the Middleware decorator is applied correctly.');
        }
    };
  }

export function getMiddlewares(target: any, propertyKey: string) {

    const middlewareNames = Reflect.getMetadata(middlewareMetadataKey, target, propertyKey) || [];

    return middlewareNames.map((name: string) => {
        const [middlewareKey, param] = name?.split(':');
        const middleware = middlewares[middlewareKey];

        if (!middleware) {
            throw new Error(`Middleware ${middlewareKey} not found`);
        }

        return param ? middleware(param) : middleware();
    });
}
