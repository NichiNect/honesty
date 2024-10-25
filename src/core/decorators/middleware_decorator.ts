import type { Context } from 'hono';
import { middlewareAliases } from '../../middleware';

const middlewareMetadataKey = Symbol('middleware');

/**
 * Decorator for add HTTP middlewares.
 */
export function Middleware(middlewareNames: string[]) {

    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(ctx: Context) => Promise<any>>) {

        if (descriptor.value) {
            Reflect.defineMetadata(middlewareMetadataKey, [...middlewareNames], target, propertyKey);
        } else {
            throw new Error('Descriptor value is undefined. Make sure the Middleware decorator is applied correctly.');
        }
    }
  }

/**
 * Function for get middleware called from controller that own specified HTTP route.
 */
export function getMiddlewares(target: any, propertyKey: string) {

    const middlewareNames = Reflect.getMetadata(middlewareMetadataKey, target, propertyKey) || [];

    // ? Find middleware called from specified controller method.
    return middlewareNames.map((name: string) => {
        const [middlewareKey, param] = name?.split(':');
        const middleware = middlewareAliases[middlewareKey];

        if (!middleware) {
            throw new Error(`Middleware ${middlewareKey} not found`);
        }

        return param ? middleware(param) : middleware();
    });
}
