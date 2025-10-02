export interface BalanceDataPoint {
  date: Date;
  balance: number;
}

export interface ChartDimensions {
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
}

export interface ChartScales {
  x: d3.ScaleTime<number, number>;
  y: d3.ScaleLinear<number, number>;
}

export interface ChartConfig {
  dimensions: ChartDimensions;
  colors: {
    line: string;
    cursor: string;
    grid: string;
    text: string;
    tooltipBackground: string;
    tooltipText: string;
  };
  cursor: {
    radius: number;
    strokeWidth: number;
  };
  line: {
    strokeWidth: number;
  };
  tooltip: {
    padding: number;
    borderRadius: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface SelectedPoint {
  data: BalanceDataPoint;
  x: number;
  y: number;
}
