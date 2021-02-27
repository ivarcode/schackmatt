import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { GameComponent } from './components/game/game.component';
import { PuzzlesComponent } from './components/puzzles/puzzles.component';
import { GameDetailTableComponent } from './components/game-details-table/game-details-table.component';
import { OpeningTrainingGameComponent } from './components/opening-training-game/opening-training-game.component';
import { AboutComponent } from './components/about/about.component';
import { BoardOverlayComponent } from './components/board-overlay/board-overlay.component';
import { EndgameTrainerComponent } from './components/endgame-trainer/endgame-trainer.component';
import { EndgamePuzzlesComponent } from './components/puzzles/endgame-puzzles/endgame-puzzles.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        GameComponent,
        GameDetailTableComponent,
        OpeningTrainingGameComponent,
        AboutComponent,
        BoardOverlayComponent,
        EndgameTrainerComponent,
        PuzzlesComponent,
        EndgamePuzzlesComponent
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
