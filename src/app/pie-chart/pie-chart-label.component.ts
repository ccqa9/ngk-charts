import { Component, OnInit, EventEmitter, Output, Input, HostListener, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Data } from "app/pie-chart/data";

@Component({
  selector: 'ngk-pie-chart-label',
  template: `
    <div class="label-group" (click)="onClick()">
      <span class="box" [style.background]="color"></span>
      <span class="label">{{label}}</span>
    </div>
  `,
  styleUrls:['./pie-chart-label.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChartLabelComponent implements OnInit {
  @Input() label: string;

  @Input() isHighlighted: boolean;

  @Input() color: string;
  
  @Output() click: EventEmitter<string> = new EventEmitter<string>();
  
  @Output() mouseenter: EventEmitter<string> = new EventEmitter<string>();

  @Output() mouseleave: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    
  }

  onClick(d){
    this.click.emit(this.label);
  }

  @HostListener('mouseenter')
  onMouseenter(){
    this.mouseenter.emit();
  }

  @HostListener('mouseleave')
  onMouseleave(){
    this.mouseleave.emit();
  }

}
