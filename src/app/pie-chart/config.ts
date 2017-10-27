export class PieChartConfig{
    
  background_color: string = "#ffffff";

  outer_radius_ratio_to_width: number = 0.18;

  inner_radius_ratio: number = 0;

  pie_center_x_ratio: number = 0.5;

  pie_center_y_ratio: number = 0.5;

  colors: string[] = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  
  hover_colors: string | Array<string> = "#bdbdbd";

  transition_duration: number = 700;
  
  unit: string;
}