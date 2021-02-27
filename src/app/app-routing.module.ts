import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuzzlesComponent } from './components/puzzles/puzzles.component';
import { OpeningTrainingGameComponent } from './components/opening-training-game/opening-training-game.component';
import { AboutComponent } from './components/about/about.component';
import { EndgameTrainerComponent } from './components/endgame-trainer/endgame-trainer.component';
import { EndgamePuzzlesComponent } from './components/puzzles/endgame-puzzles/endgame-puzzles.component';

const routes: Routes = [
    {
        component: PuzzlesComponent,
        path: 'puzzles'
    },
    {
        component: EndgamePuzzlesComponent,
        path: 'endgame-puzzles'
    },
    {
        component: EndgameTrainerComponent,
        path: 'endgame-trainer'
    },
    {
        component: OpeningTrainingGameComponent,
        path: 'opening-training-game'
    },
    {
        component: AboutComponent,
        path: 'about'
    },
    {
        redirectTo: 'endgame-puzzles',
        path: '**'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
