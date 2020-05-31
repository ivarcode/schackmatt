import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { GameComponent } from './components/game.component';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainerComponent } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilderComponent } from './components/repertoire-builder/repertoire-builder.component';
import { MyBooksComponent } from './components/studies/my-books/my-books.component';
import { PublicStudiesComponent } from './components/studies/public-studies/public-studies.component';
import { GameDetailTableComponent } from './components/game-details-table/game-details-table.component';
import { BookThumbnailComponent } from './components/studies/book-thumbnail/book-thumbnail.component';

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
        PublicStudiesComponent,
        GameDetailTableComponent,
        BookThumbnailComponent
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
