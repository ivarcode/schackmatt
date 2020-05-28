import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game.component';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainer } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilder } from './components/repertoire-builder/repertoire-builder.component';
import { MyStudies } from './components/studies/my-studies/my-studies.component';
import { PublicStudies } from './components/studies/public-studies/public-studies.component';
const routes: Routes = [
    {
        component: GameComponent,
        path: 'game'
    },
    {
        component: AccountComponent,
        path: 'account'
    },
    {
        component: TacticsTrainer,
        path: 'tactics-trainer'
    },
    {
        component: RepertoireBuilder,
        path: 'repertoire-builder'
    },
    {
        component: MyStudies,
        path: 'my-studies'
    },
    {
        component: PublicStudies,
        path: 'public-studies'
    },
    {
        redirectTo: 'game',
        path: '**'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
