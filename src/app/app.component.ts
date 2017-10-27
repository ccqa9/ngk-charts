import { Component, AfterViewInit } from '@angular/core';
import { Data } from "app/pie-chart/data";
import { PieChartConfig } from "app/pie-chart/config";
import { LineChartConfig } from "app/line-chart/config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'demo pie chart';
  dataset: Data[] = [
    { value : 20, label : 'data1' },
    { value : 40, label : 'data2' },
    { value : 60, label : 'data3' },
    { value : 30, label : 'data4' },
    { value : 10, label : 'data5' }
  ];
  pieChartConfig = new PieChartConfig();
  lineChartConfig = new LineChartConfig();

  ngAfterViewInit(){
    setTimeout(t => {
      let newData = [];
      let length = Math.floor(Math.random()*(10 + 1 - 3)) + 3;
      for (var index = 0; index < length; index++) {
        newData.push({ value : (Math.floor(Math.random() * (10 + 1 - 1)) + 1) * 10, label: 'data'});
      }
      this.dataset = newData;
    }, 3000)
  }

  onClick(event){

  }

  onMouseenter(event){

  }

  onMouseleave(event){

  }

 }
