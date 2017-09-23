import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from "app/pie-chart/pie-chart.component";
import { PieChartLabelComponent } from "app/pie-chart/pie-chart-label.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PieChartComponent, PieChartLabelComponent],
  exports: [PieChartComponent, PieChartLabelComponent]
})
export class PieChartModule { }
