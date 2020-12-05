import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainerComponent } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilderComponent } from './components/repertoire-builder/repertoire-builder.component';
import { MyBooksComponent } from './components/studies/my-books/my-books.component';
import { PublicBooksComponent } from './components/studies/public-books/public-books.component';
import { BookComponent } from './components/studies/book/book.component';
import { ChapterComponent } from './components/studies/chapter/chapter.component';
import { OpeningTrainingGameComponent } from './components/opening-training-game/opening-training-game.component';
import { PageComponent } from './components/studies/page/page.component';
import { AboutComponent } from './components/about/about.component';
import { EndgameTrainerComponent } from './components/endgame-trainer/endgame-trainer.component';

const routes: Routes = [
    {
        component: EndgameTrainerComponent,
        path: 'endgame-trainer'
    },
    {
        component: OpeningTrainingGameComponent,
        path: 'opening-training-game'
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
        component: ChapterComponent,
        path: 'chapter'
    },
    {
        component: PageComponent,
        path: 'page'
    },
    {
        component: AboutComponent,
        path: 'about'
    },
    {
        redirectTo: 'endgame-trainer',
        path: '**'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
