import { Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';

export const routes: Routes = [
    {
        path: ":id",
        component: HelloComponent
    },
    {
        path: "_share-target",
        component: HelloComponent
    }
];
