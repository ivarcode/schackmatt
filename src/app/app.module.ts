import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { GameComponent } from './components/game.component';
import { AccountComponent } from './components/account/account.component';
import { TacticsTrainerComponent } from './components/tactics-trainer/tactics-trainer.component';
import { RepertoireBuilderComponent } from './components/repertoire-builder/repertoire-builder.component';
import { MyStudiesComponenet } from './components/studies/my-studies/my-studies.component';
import { PublicStudiesComponent } from './components/studies/public-studies/public-studies.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        GameComponent,
        AccountComponent,
        TacticsTrainerComponent,
        RepertoireBuilderComponent,
        MyStudiesComponenet,
        PublicStudiesComponent
    ],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
