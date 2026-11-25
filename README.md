# 工厂消防设备 3D 数字孪生原型

基于 React、TypeScript、Vite 和 React Three Fiber 的纯前端演示项目。无需后端，设备信息和运行状态均为本地模拟数据。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 Vite 输出的本地地址即可。生产构建：

```bash
npm run build
npm run preview
```

## 原型功能

- 可拖拽旋转、缩放的工厂 3D 场景，点击设备查看详情
- 消防设备台账、搜索与状态筛选
- 故障告警、状态总览、最近巡检动态
- 故障设备处置工单交互（仅演示，不会提交至后端）
- 桌面与移动端自适应布局

设备数据在 `src/App.tsx` 的 `initialDevices` 中维护。此原型不接入真实消防系统、BIM 模型或实时传感器。
