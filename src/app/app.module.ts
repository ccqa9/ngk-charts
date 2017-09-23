import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PieChartModule } from "app/pie-chart/pie-chart.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PieChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
