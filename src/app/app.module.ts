import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { GameComponent } from './components/game/game.component';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainerComponent } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilderComponent } from './components/repertoire-builder/repertoire-builder.component';
import { MyBooksComponent } from './components/studies/my-books/my-books.component';
import { PublicBooksComponent } from './components/studies/public-books/public-books.component';
import { GameDetailTableComponent } from './components/game-details-table/game-details-table.component';
import { BookThumbnailComponent } from './components/studies/book-thumbnail/book-thumbnail.component';
import { BookComponent } from './components/studies/book/book.component';
import { ChapterComponent } from './components/studies/chapter/chapter.component';
import { OpeningTrainingGameComponent } from './components/opening-training-game/opening-training-game.component';
import { PageComponent } from './components/studies/page/page.component';
import { AboutComponent } from './components/about/about.component';
import { BoardOverlayComponent } from './components/board-overlay/board-overlay.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        GameComponent,
        AccountComponent,
        TacticsTrainerComponent,
        RepertoireBuilderComponent,
        MyBooksComponent,
        PublicBooksComponent,
        GameDetailTableComponent,
        BookThumbnailComponent,
        BookComponent,
        ChapterComponent,
        OpeningTrainingGameComponent,
        PageComponent,
        AboutComponent,
        BoardOverlayComponent
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
