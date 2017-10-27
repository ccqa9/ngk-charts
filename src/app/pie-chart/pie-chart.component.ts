import { Component, OnInit, NgModule, ElementRef, ViewChild, AfterViewInit, Input, ViewEncapsulation, Output, EventEmitter, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from "@angular/common/src/common";

import * as d3 from "d3";
import { PieChartConfig } from "app/pie-chart/config";
import { Data } from "app/pie-chart/data";

@Component({
  selector: 'ngk-pie-chart',
  template: `<div #container class="chart-container" 
    [style.width]="width" [style.height]="height"></div>`,
  encapsulation: ViewEncapsulation.None,
  styles:[
    `
    :host{
      display: block;
    }

    .tooltip{
      background: #000;
      color: #ffffff;
      display: inline-block;
      position: absolute;
      border-radius: 3px;
      padding: 4px;
    }
    ` 
  ],
  changeDetection: ChangeDetectionStrategy.OnPush  
})
export class PieChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('container') container: ElementRef;

  @Input() dataset: Data[];

  @Input() config: PieChartConfig;

  @Input() width: any;

  @Input() height: any;

  @Output() click: EventEmitter<Data> = new EventEmitter<Data>();

  @Output() mouseenter: EventEmitter<Data> = new EventEmitter<Data>();

  @Output() mouseleave: EventEmitter<Data> = new EventEmitter<Data>();

  private svg;

  private pieGraph;

  private arc;

  private pieElements;

  private outerRadius: number;

  private innerRadius: number;

  private tooltip;

  private tooltipDuration: number = 200;

  private TOOLTIP_CLASS = "tooltip";

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    this.init();
    this.render();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['dataset'] && !changes['dataset'].isFirstChange()){
      this.update();
    }
  }

  private init(){
    this.outerRadius = this.container.nativeElement.scrollWidth * this.config.outer_radius_ratio_to_width;
    this.innerRadius = this.outerRadius * this.config.inner_radius_ratio;
    this.svg = d3.select(this.container.nativeElement)
            .append('svg')
            .attr("class", "svg-container")
            .attr("width", this.container.nativeElement.offsetWidth)
            .attr("height", this.container.nativeElement.offsetHeight)
            .attr("style", "background-color : " + this.config.background_color)
    this.pieGraph = this.svg.append("g").attr("class", "pie-graph")

    this.tooltip = d3.select(this.container.nativeElement)
                .append("div")
                .attr("class", this.TOOLTIP_CLASS)
                .style("opacity", 0)
                .attr("transform", this.getTransformToCenter())
  }

  private render(){
    this.arc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius)
    this.pieElements = this.pieGraph.append("g")
                          .attr("class", "pieElements")
                          .attr("transform", this.getTransformToCenter())
    
    //let pie:any = d3.pie().sort(null).value((d:any) => d.value);

    this.pieElements.selectAll('path').data(this.getPie(this.dataset)).enter()
            .append('path')
            .attr("d", this.arc)
            .attr("fill", (d, i) => this.config.colors[i])
            .on("mouseenter", (d, i) => {
              this.onMouseenter(d, i, this);
            })
            .on("mouseleave", (d, i) => {
              this.onMouseleave(d, i, this);
            })
            .on("click", (d, i) => {
              this.onClick(d, i, this);
            })
            .transition()
            .duration(this.config.transition_duration)
            .delay((d, i) => 50 * i )
            .ease(d3.easeLinear)
            .attrTween("d", (d, i) => {
              var interpolate = d3.interpolate(
                {startAngle : d.startAngle, endAngle : d.startAngle},
                {startAngle : d.startAngle, endAngle : d.endAngle}
              );
              return t => {
                return this.arc(interpolate(t));
              }
            })
  }

  private update(){
    this.pieGraph.selectAll('*').remove();
    this.render();
  }

  private getPie(dataset : any){
    return d3.pie().sort(null).value((d:any) => d.value)(dataset);
  }

  private onMouseenter(d, index, self){
      self.mouseenter.emit(d.data);
      d3.select(d3.event.target).attr("fill", (d) => {
              if(typeof self.config.hover_colors === 'string') return self.config.hover_colors;
              else return self.config.hover_colors[index];
            });
      self.setTooltip(d, d3.event.target);
  }

  private onMouseleave(d, index, self){
    self.mouseleave.emit(d.data);
    d3.select(d3.event.target).attr("fill", self.config.colors[index])
    self.removeTooltip();
  }

  private onClick(d, i, self){
    self.click.emit(d.data);
  }

  private setTooltip(d: any, el){
    let tooltip_content;
    tooltip_content = [d.data.label + ' : ', d.data.value, this.config.unit];
    this.tooltip.html(tooltip_content.join(''))
    let coordinates = d3.mouse(el);
    this.tooltip.transition()
                .duration(this.tooltipDuration)
                .style('left', coordinates[0] + this.config.pie_center_x_ratio * this.container.nativeElement.scrollWidth + 15 + 'px')
                .style('top', coordinates[1] + this.config.pie_center_y_ratio * this.container.nativeElement.scrollHeight + 15 + 'px')    
                .style('opacity', 0.8)
   
    }

  private removeTooltip(){
    this.tooltip.transition()
                .duration(this.tooltipDuration)
                .style('opacity', 0)
  }

  private getTransformToCenter(): string{
    return "translate(" + this.config.pie_center_x_ratio * this.container.nativeElement.scrollWidth + "," 
                        + this.config.pie_center_y_ratio * this.container.nativeElement.scrollHeight + ")";
  }

  
  
}
