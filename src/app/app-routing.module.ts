import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PuzzleComponent } from './components/puzzle.component';

const appRoutes: Routes = [
    {
        component: PuzzleComponent,
        path: 'puzzle'
    },
    {
        redirectTo: '#', // to be changed to direct to a live (or random) chess game
        path: '**'
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(appRoutes)]
})
export class AppRoutingModule {}
