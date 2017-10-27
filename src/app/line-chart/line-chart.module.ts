import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from "app/line-chart/line-chart.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ LineChartComponent ],
  exports: [ LineChartComponent ]
})
export class LineChartModule { }
