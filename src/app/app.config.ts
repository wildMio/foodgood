import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CustomTitleStrategyService } from './service/custom-title-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: TitleStrategy, useClass: CustomTitleStrategyService },
  ],
};
