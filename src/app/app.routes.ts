import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'menu',
    loadComponent: () =>
      import('./menu/menu.component').then((c) => c.MenuComponent),
    title: '菜單',
  },
  {
    path: 'menu-collection',
    loadComponent: () =>
      import('./menu-collection/menu-collection.component').then(
        (c) => c.MenuCollectionComponent
      ),
    title: '精選組合',
  },
  {
    path: 'menu-create',
    loadComponent: () =>
      import('./menu-create/menu-create.component').then(
        (c) => c.MenuCreateComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'menu',
    pathMatch: 'full',
  },
];
