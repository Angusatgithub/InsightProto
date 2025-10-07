# InsightProto - AI Agent Instructions

## Project Overview
React Native prototype built with Expo showcasing an interactive balance line chart with gesture controls and haptic feedback. Uses `@shopify/react-native-skia` for high-performance canvas rendering and React Native Reanimated for smooth animations.

## Architecture

### Chart System (Core Feature)
The chart is a composition of specialized components that work together:

- **`BalanceLineChart.tsx`** - Main orchestrator that combines grid, line path, cursor, and tooltip
- **`useChartScale.ts`** - D3 scales (time + linear) with 10% y-axis padding via `.nice()`
- **`useChartGesture.ts`** - Gesture handling with pre-computed point positions for performance
- **`ChartGrid.tsx`** - Three horizontal lines (top/mid/bottom) with vertical sections
- **`ChartCursor.tsx`** - Vertical line + dual circle (filled + stroke ring) at touch point
- **`ChartTooltip.tsx`** - Auto-positioning tooltip (shifts left near right edge)

**Data flow**: Mock data → D3 scales → Skia path → Gesture detector → Shared values → Cursor/tooltip render

### Key Technical Patterns

#### Skia Canvas Rendering
All chart elements use `@shopify/react-native-skia` primitives (`Path`, `Line`, `Circle`, `RoundedRect`, `Text`). Canvas size and margins defined in `CHART_CONFIG.dimensions`.

```tsx
// Typical pattern: Group with style attributes
<Group color="#e5e7eb" style="stroke" strokeWidth={1} opacity={0.3}>
  <Line p1={{ x: left, y: top }} p2={{ x: right, y: top }} />
</Group>
```

#### Gesture-Driven Interactivity
`useChartGesture` pre-computes point positions in `useMemo` to avoid scale calculations during gestures. Uses `runOnJS` to bridge worklet → JS for state updates and haptics.

```typescript
// Pattern: Pre-compute positions, then find closest by distance
const pointPositions = useMemo(() => 
  data.map((point) => ({ x: scales.x(point.date), y: scales.y(point.balance), data: point })),
  [data, scales]
);
```

#### Reanimated Shared Values
Position and opacity state managed via `useSharedValue` for 60fps animations. Components receive `SharedValue<number>` props directly.

```tsx
// Pattern: Shared values as props
const touchX = useSharedValue(0);
<ChartCursor x={touchX} y={touchY} isActive={isActive} />
```

#### Haptic Feedback Configuration
`haptics.ts` exports functions with try-catch wrappers. `HAPTIC_CONFIG` enables global control and style customization. Triggered on:
- Gesture start: `ImpactFeedbackStyle.Heavy`
- Point change: `ImpactFeedbackStyle.Heavy` (only when index changes)
- Gesture end: Disabled by default

## Development Workflow

### Running the App
```bash
npm install
npx expo start
```
Scan QR code with Expo Go app on mobile device (iOS/Android).

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Expo typed routes enabled via `experiments.typedRoutes`

### Styling Conventions
- StyleSheet.create for React Native styles
- Inline style objects for Skia canvas properties
- Color palette in `CHART_CONFIG.colors` (hex strings)
- Dark theme: Background `#1A1A22`, header `#1f2937`

## File Organization

```
app/             - Expo Router file-based routing
components/      - Reusable UI components
  charts/        - Skia-based chart components
constants/       - Configuration objects (chartConfig.ts)
hooks/           - Custom React hooks for chart logic
types/           - TypeScript interfaces (chart.types.ts)
utils/           - Helpers (chartHelpers.ts, formatters.ts, haptics.ts)
data/            - Mock data (mockBalanceData.ts)
```

## Common Tasks

### Adding Chart Components
1. Create component in `components/charts/`
2. Accept `ChartConfig`, `ChartDimensions`, and `SharedValue` props
3. Use Skia primitives inside `<Canvas>` or as children
4. Reference existing components for prop patterns

### Modifying Chart Appearance
- Update `constants/chartConfig.ts` for colors, dimensions, or styling
- Margins affect `scales.x/y.range()` calculations in `useChartScale`
- Grid lines use `DashPathEffect` with `intervals={[2, 10]}`

### Adding Gestures
- Extend `useChartGesture` gesture composition
- Use `runOnJS` for haptic triggers or state updates
- Pre-compute positions in `useMemo` when possible

### Text Rendering in Skia
Use `matchFont` with platform-specific font families:
```typescript
const font = matchFont({
  fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
  fontSize: 14,
});
```

## Known Issues & Patterns

### Grid Label Formatting
`ChartGrid.tsx` has "fix this" placeholders at top/bottom labels. Use `formatCurrency` or `formatDateLong` from `utils/formatters.ts` for proper display.

### Worklet Boundaries
D3 scale functions can't run in worklets. Pre-compute positions in JS (see `useChartGesture.pointPositions`).

### Canvas Coordinate System
- Y-axis: 0 at top, increases downward (invert via scale.range)
- X-axis: 0 at left, increases rightward
- Margins define chart plotting area within canvas

## Dependencies of Note

- `d3` (v7.9.0) - Scales and path generators (not DOM rendering)
- `@shopify/react-native-skia` (2.2.12) - Canvas rendering engine
- `react-native-reanimated` (~4.1.1) - Shared values and worklets
- `react-native-gesture-handler` (~2.28.0) - Touch gesture system
- `expo-haptics` (~15.0.7) - Native haptic feedback
- `expo-router` (~6.0.10) - File-based navigation

## React Architecture Notes

- Expo Router uses file-based routing (see `app/_layout.tsx`)
- GestureHandlerRootView must wrap gesture-enabled components
- SafeAreaView + ScrollView pattern in `app/index.tsx`
- New React architecture enabled (`newArchEnabled: true` in app.json)
