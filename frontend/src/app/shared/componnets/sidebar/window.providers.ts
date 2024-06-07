import { InjectionToken, FactoryProvider } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WindowToken');

export function windowFactory(): Window | any {
  if (typeof window !== 'undefined') {
    return window;
  } else {
    return {
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }
}

export const WINDOW_PROVIDERS: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
};
