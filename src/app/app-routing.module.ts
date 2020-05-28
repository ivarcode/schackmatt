import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game.component';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainerComponent } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilderComponent } from './components/repertoire-builder/repertoire-builder.component';
import { MyStudiesComponenet } from './components/studies/my-studies/my-studies.component';
import { PublicStudiesComponent } from './components/studies/public-studies/public-studies.component';
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
        component: TacticsTrainerComponent,
        path: 'tactics-trainer'
    },
    {
        component: RepertoireBuilderComponent,
        path: 'repertoire-builder'
    },
    {
        component: MyStudiesComponenet,
        path: 'my-studies'
    },
    {
        component: PublicStudiesComponent,
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
export class AppRoutingModule {}
