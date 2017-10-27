import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild, SimpleChanges, OnChanges, ChangeDetectionStrategy, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Data } from "app/line-chart/data";
import { LineChartConfig } from "app/line-chart/config";

@Component({
  selector: 'ngk-line-chart',
  template:  `
    <div #container class="chart-container"></div>
  `,
  styleUrls:['./../line-chart/line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('container') container: ElementRef;

  @Input() dataset: Data[];

  @Input() config: LineChartConfig;

  @Input() yAxisLabel: string;

  @Input() yAxisUnit: string;

  @Output() click: EventEmitter<Data> = new EventEmitter<Data>();

  @Output() mouseenter: EventEmitter<Data> = new EventEmitter<Data>();

  @Output() mouseleave: EventEmitter<Data> = new EventEmitter<Data>();

  private svg;

  private tooltip;

  private bar;

  private barElements;

  private max: number;

  private xScale;

  private yScale;

  private offsetLeft: number;

  private offsetTop: number;
  /**
   * width of svg
   */
  private svgWidth: number;
  /**
   * height of svg
   */
  private svgHeight: number;
  /**
   * width of svg width minus offset
   */
  private width: number;
  /**
   * height of svg height minus offset
   */
  private height: number;

  private totalLength: number;

  private labelConf;
  
  constructor() { }

  ngOnInit() {
    // this._domStore.windowResize.subscribe(size => {
    //   this.resize();
    // });
  }

  ngAfterViewInit(){
    this.init();
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges){
    if(!changes['dataset'].isFirstChange()){
      this.svg.selectAll('*').remove();
      this.draw();
    }
  }

  private init(){
    this.setConfig();
    this.svg = d3.select(this.container.nativeElement)
                  .append('svg')
                  .attr("class", "svg-container")
                  .attr("width", this.svgWidth)
                  .attr("height", this.svgHeight)
                  .attr("style", "background-color : " + this.config.background_color)
    this.tooltip = d3.select(this.container.nativeElement)
                  .append('span')
                  .attr('class', 'graph-tooltip')
                  .style('opacity', 0)
                  .style('position', 'absolute')
  }

  private draw(){
    this.max = d3.max(this.dataset, d => d.value );
    this.render(true);
  }

  private resize(){
    this.svg.selectAll('*').remove();
    this.setConfig();
    d3.select(this.container.nativeElement).style('height', this.svgHeight + 'px')
    this.svg.attr("width", this.svgWidth).attr("height", this.svgHeight + 'px')
    this.render(false);
  }

  private setTooltip(self, d){
    let tooltip_content;
    if(d.value < 0) d.value = 0;
    tooltip_content = ['<p>', d.label, '</p>', '<p>', d3.format('.1f')(d.value), this.yAxisLabel, '</p>'];
    this.tooltip.html(tooltip_content.join(''))
    this.tooltip.transition().duration(200).style('opacity', 0.8)
    let tooltip_attr = this.tooltip.node().getBoundingClientRect();

    if(Number(d3.select(self).attr('cx')) + tooltip_attr.width + 20 > this.width){
      this.tooltip.style('left', parseInt(d3.select(self).attr('cx')) - tooltip_attr.width - 10 + 'px')
    }else{
      this.tooltip.style('left', parseInt(d3.select(self).attr('cx')) + 10 + 'px')
    }
    if(Number(d3.select(self).attr('cy')) + tooltip_attr.height > this.height - this.config.axis_offsetY_bottom){
      this.tooltip.style('top', parseInt(d3.select(self).attr('cy')) - tooltip_attr.height - 10 + 'px')
    }else{
      this.tooltip.style('top', parseInt(d3.select(self).attr('cy')) + 10 + 'px')
    }
  }

  private render(isTransition: boolean){
    let x = d3.scaleLinear()
        .domain([0, this.dataset.length - 1])
        .range([this.config.axis_offsetX_left, this.svgWidth - this.config.axis_offsetX_right]);
    let y = d3.scaleLinear()
        .domain([0, this.max])
        .range([this.svgHeight - this.config.axis_offsetY_bottom, this.config.axis_offsetY_top]);

    let line = d3.line<Data>()
        .x((d, i) => x(i))
        .y((d, i) => d.value < 0 ? y(0) : y(d.value))
        .curve(d3.curveMonotoneX)

    let area = d3.area<Data>()
        .x((d, i) => x(i))
        .y0((d, i) => this.svgHeight - this.config.axis_offsetY_bottom)
        .y1((d, i) => d.value < 0 ? y(0) : y(d.value))
        .curve(d3.curveMonotoneX)

    let xAxisCall = d3.axisBottom(x)
            .tickArguments([this.dataset.length])
            .tickFormat((d, i) => this.dataset[i]['label'])

    let yAxisCall = d3.axisLeft(y).tickArguments([this.config.y_axis_tick_number])

    let yAxisGridCall = d3.axisLeft(y)
            .tickSizeInner((-1) * this.width)
            .tickFormat(d3.format(this.config.y_axis_tick_format))
            .tickArguments([this.config.y_axis_tick_number])

    let xAxis = this.svg.append("g")
                        .attr("class", "x axis")
                        .call(xAxisCall)
                        .attr("transform", "translate(0, " + (this.svgHeight - this.config.axis_offsetY_bottom) + ")")
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("font-size", this.config.x_axis_label_font_size)
                        .attr('fill', this.config.axis_color)
                        .attr("dx", this.config.x_axis_label_dx)
                        .attr("dy", this.config.x_axis_label_dy)
                        .attr("transform", "rotate(" + this.config.x_axis_label_rotate + ")")

    let xAxisGrid = this.svg.append("g")
                            .attr("class", "y grid")
                            .call(yAxisGridCall)
                            .attr("transform", "translate(" + this.config.axis_offsetX_left + ",0)")

    xAxisGrid.selectAll('.tick').select('line').attr('stroke', this.config.grid_color)

    this.svg.append("text")
            .attr("x", this.labelConf.pos_x)
            .attr("y", this.labelConf.pos_y)
            .attr("fill", this.config.label_color)
            .attr("text-anchor", this.labelConf.text_anchor)
            .style("font-size", this.labelConf.font_size)
            .text(this.yAxisLabel + "[" + this.yAxisUnit + "]")

    let path_area = this.animate(this.dataset, area, "area", isTransition);
    let path_line = this.animate(this.dataset, line, "line", isTransition);

    let circle = this.svg.append('g').selectAll('circle').data(this.dataset).enter().append('circle')
                    .attr('r', this.config.circleOverLine_r)
                    .attr('cx', (d, i) => x(i))
                    .attr('cy', (d) => y(d.value))
                    .attr('fill', this.config.circleOverLine_color)
                    .attr('stroke', 'none')
                    .on('mouseenter', (d, i) => {
                        d3.select(d3.event.target).attr('r', 5)
                        this.setTooltip(d3.event.target, d)
                        this.mouseenter.emit(d)
                    })
                    .on('mouseleave', (d, i) => {
                        d3.select(d3.event.target).attr('r', this.config.circleOverLine_r)
                        this.tooltip.transition().duration(400).style('opacity', 0)
                        this.mouseleave.emit(d)
                    })

  }

  private animate(dataset, drawType, cssClassName, isTransition){
    this.totalLength = 0;
    let path = this.svg.append("path")
                        .attr("class", cssClassName)
                        .attr("d", d => drawType(dataset))
                        .attr("fill", cssClassName === "area" ? this.config.ele_color : "none")
                        .attr("opacity", cssClassName === "area" ? this.config.area_opacity : 1)
                        .attr("stroke", this.config.ele_color)
                        .attr("stroke-width", this.config.axis_stroke_width)

    let totalLength = path.node().getTotalLength();
    if(isTransition){
      path.attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .ease(d3.easeCubic)
          .duration(this.config.ele_transition_duration)
          .attr("stroke-dashoffset", 0)
    }else{
      path.attr("stroke-dashoffset", 0)
    }
    return path;
  }

  private setConfig(){
    this.svgWidth = this.container.nativeElement.offsetWidth;
    this.svgHeight = this.container.nativeElement.offsetHeight;
    this.offsetLeft = this.container.nativeElement.offsetLeft;
    this.offsetTop = this.container.nativeElement.offsetTop;

    this.labelConf = {
      pos_x : this.config.axis_offsetX_left + 15,
      pos_y : 18,
      font_size : "0.875em",
      text_anchor : "end"
    }

    this.width = this.svgWidth - this.config.axis_offsetX_left - this.config.axis_offsetX_right;
    this.height = this.svgHeight - this.config.axis_offsetY_top - this.config.axis_offsetY_bottom;
  }

}
