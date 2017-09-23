import { Component } from '@angular/core';
import { Data } from "app/pie-chart/data";
import { Config } from "app/pie-chart/config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demo pie chart';
  dataset: Data[] = [
    { value : 20, label : 'data1' },
    { value : 40, label : 'data2' },
    { value : 60, label : 'data3' },
    { value : 30, label : 'data4' },
    { value : 10, label : 'data5' }
  ];
  config = new Config();

  onClick(event){
    console.log(event);
  }

  onMouseenter(event){
    console.log(event);
  }

  onMouseleave(event){
    console.log(event);
  }
 }
