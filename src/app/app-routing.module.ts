import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game.component';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainerComponent } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilderComponent } from './components/repertoire-builder/repertoire-builder.component';
import { MyBooksComponent } from './components/studies/my-books/my-books.component';
import { PublicBooksComponent } from './components/studies/public-books/public-books.component';
import { BookComponent } from './components/studies/book/book.component';
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
        component: MyBooksComponent,
        path: 'my-books'
    },
    {
        component: PublicBooksComponent,
        path: 'public-books'
    },
    {
        component: BookComponent,
        path: 'book'
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
