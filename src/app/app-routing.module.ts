import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainerComponent } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilderComponent } from './components/repertoire-builder/repertoire-builder.component';
import { MyBooksComponent } from './components/studies/my-books/my-books.component';
import { PublicBooksComponent } from './components/studies/public-books/public-books.component';
import { BookComponent } from './components/studies/book/book.component';
import { ChapterComponent } from './components/studies/chapter/chapter.component';
import { StandardGameComponent } from './components/standard-game/standard-game.component';
import { PageComponent } from './components/studies/page/page.component';
const routes: Routes = [
    {
        component: StandardGameComponent,
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
        component: ChapterComponent,
        path: 'chapter'
    },
    {
        component: PageComponent,
        path: 'page'
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
