import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import * as echarts from 'echarts';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasRenderTime: 0,
      echartsRenderTime: 0,
      rechartsRenderTime: 0,
      currentChart: 'CanvasJS', // Current chart library
    };
    this.echartsContainer = React.createRef(); // Ref for ECharts container
  }

  handleCanvasRender = () => {
    const startTime = new Date();
    setTimeout(() => {
      const endTime = new Date();
      this.setState({
        canvasRenderTime: endTime - startTime,
      });
    }, 0);
  };

  handleEChartsRender = () => {
    const startTime = new Date();

    if (this.echartsInstance) {
      this.echartsInstance.dispose(); // Clean re-initialization
    }

    // Initialize ECharts with Canvas renderer
    this.echartsInstance = echarts.init(this.echartsContainer.current, null, {
      renderer: 'canvas',
    });

    const option = {
      title: { text: 'ECharts Chart (Canvas Renderer)' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'line',
          data: this.dataPoints.map((point) => [point.x, point.y]),
        },
      ],
    };

    this.echartsInstance.setOption(option);

    setTimeout(() => {
      const endTime = new Date();
      this.setState({
        echartsRenderTime: endTime - startTime,
      });
    }, 0);
  };

  handleRechartsRender = () => {
    const startTime = new Date();
    setTimeout(() => {
      const endTime = new Date();
      this.setState({
        rechartsRenderTime: endTime - startTime,
      });
    }, 0);
  };

  componentDidMount() {
    // Generate random data
    const limit = 100000;
    let y = 100;
    this.dataPoints = [];
    for (let i = 0; i < limit; i += 1) {
      y += Math.round(Math.random() * 10 - 5);
      this.dataPoints.push({ x: i, y });
    }

    // Initial render for CanvasJS
    this.handleCanvasRender();
  }

  handleChartToggle = (chartType) => {
    this.setState({ currentChart: chartType }, () => {
      if (chartType === 'ECharts') {
        this.handleEChartsRender();
      } else if (chartType === 'Recharts') {
        this.handleRechartsRender();
      } else if (chartType === 'CanvasJS') {
        this.handleCanvasRender();
      }
    });
  };

  render() {
    const { canvasRenderTime, echartsRenderTime, rechartsRenderTime, currentChart } = this.state;

    return (
      <div className="flex flex-col gap-8 p-4">
        <div>
          <button onClick={() => this.handleChartToggle('CanvasJS')}>CanvasJS</button>
          <button onClick={() => this.handleChartToggle('ECharts')}>ECharts</button>
          <button onClick={() => this.handleChartToggle('Recharts')}>Recharts</button>
        </div>

        {currentChart === 'CanvasJS' && (
          <div>
            <CanvasJSChart
              options={{
                zoomEnabled: true,
                animationEnabled: true,
                title: { text: 'CanvasJS Chart' },
                data: [{ type: 'line', dataPoints: this.dataPoints }],
              }}
              onRef={(ref) => {
                if (ref) this.handleCanvasRender();
              }}
            />
            <div>CanvasJS Render Time: {canvasRenderTime} ms</div>
          </div>
        )}

        {currentChart === 'ECharts' && (
          <div>
            <div
              ref={this.echartsContainer}
              style={{ width: '100%', height: '400px' }}
            ></div>
            <div>ECharts Render Time (Canvas Renderer): {echartsRenderTime} ms</div>
          </div>
        )}

        {currentChart === 'Recharts' && (
          <div>
            <LineChart
              width={1000}
              height={400}
              data={this.dataPoints}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <Line type="monotone" dataKey="y" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
            </LineChart>
            <div>Recharts Render Time: {rechartsRenderTime} ms</div>
          </div>
        )}

        <div>
          {canvasRenderTime && echartsRenderTime && rechartsRenderTime ? (
            <div>
              {Math.min(canvasRenderTime, echartsRenderTime, rechartsRenderTime) ===
              canvasRenderTime
                ? 'CanvasJS is the most efficient.'
                : Math.min(canvasRenderTime, echartsRenderTime, rechartsRenderTime) ===
                  echartsRenderTime
                ? 'ECharts is the most efficient.'
                : 'Recharts is the most efficient.'}
            </div>
          ) : (
            'Render times not yet recorded.'
          )}
        </div>
      </div>
    );
  }
}
