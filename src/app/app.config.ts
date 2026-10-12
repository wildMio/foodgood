import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CustomTitleStrategyService } from './service/custom-title-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
    provideClientHydration(withEventReplay()),
  ],
};
