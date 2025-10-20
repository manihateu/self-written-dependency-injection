import 'reflect-metadata';

type Token<T = any> = string | symbol | { new (...args: any[]): T };

interface DependencyRegistration {
  token: Token;
  useClass?: { new (...args: any[]): any };
  useValue?: any;
  singleton?: boolean;
}

export class Container {
  private registrations = new Map<Token, DependencyRegistration>();
  private instances = new Map<Token, any>();

  register<T>(token: Token<T>, useClass: { new (...args: any[]): T }, singleton: boolean = true): void {
    this.registrations.set(token, { token, useClass, singleton });
  }

  registerValue<T>(token: Token<T>, value: T): void {
    this.registrations.set(token, { token, useValue: value, singleton: true });
    this.instances.set(token, value);
  }

  registerSingleton<T>(token: Token<T>, useClass: { new (...args: any[]): T }): void {
    this.register(token, useClass, true);
  }

  registerTransient<T>(token: Token<T>, useClass: { new (...args: any[]): T }): void {
    this.register(token, useClass, false);
  }

  get<T>(token: Token<T>): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const registration = this.registrations.get(token);
    
    if (!registration) {
      throw new Error(`Dependency not registered: ${this.getTokenName(token)}`);
    }

    if (registration.useValue !== undefined) {
      return registration.useValue;
    }

    const instance = this.instantiateClass(registration.useClass!);
    
    if (registration.singleton) {
      this.instances.set(token, instance);
    }

    return instance;
  }

  private instantiateClass<T>(cls: { new (...args: any[]): T }): T {
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', cls) || [];
    
    const dependencies = paramTypes.map((paramType: any) => {
      if (!paramType) {
        throw new Error(`Cannot resolve dependency for ${cls.name}. Make sure all dependencies are registered and decorators are properly set.`);
      }
      return this.get(paramType);
    });

    return new cls(...dependencies);
  }

  private getTokenName(token: Token): string {
    if (typeof token === 'string') return token;
    if (typeof token === 'symbol') return token.toString();
    return token.name;
  }

  clear(): void {
    this.registrations.clear();
    this.instances.clear();
  }
}

export const container = new Container();

export function Injectable(token?: Token): ClassDecorator {
  return function (target: any) {
    const injectionToken = token || target;
    container.register(injectionToken, target, true);
  };
}

export function Inject(token: Token): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const propertyType = Reflect.getMetadata('design:type', target, propertyKey);
    const injectionToken = token || propertyType;
    
    Object.defineProperty(target, propertyKey, {
      get: () => container.get(injectionToken),
      enumerable: true,
      configurable: true
    });
  };
}