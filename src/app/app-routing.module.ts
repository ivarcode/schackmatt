import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game.component';

const routes: Routes = [
    {
        component: GameComponent,
        path: 'game'
    },
    {
        redirectTo: 'game', // to be changed to direct to a live (or random) chess game
        path: '**'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
