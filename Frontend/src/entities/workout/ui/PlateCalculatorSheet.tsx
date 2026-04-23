import { useWeightEngine } from '../lib/useWeightEngine';
import React, { useCallback } from 'react';
import { XStack, YStack, useTheme } from 'tamagui';
import { X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { 
  BottomSheetModal, 
  BottomSheetView, 
  BottomSheetBackdrop, 
  BottomSheetScrollView 
} from '@gorhom/bottom-sheet';
import { AppText } from '@/shared/ui/AppText';
import { AppIcon } from '@/shared/ui/AppIcon';
import { calculatePlates } from '../lib/plateMath';


// -----------------------------------------------------------------------------
// PLATE COLOR MAP — Temper-adjusted Olympic colors
// -----------------------------------------------------------------------------

const PLATE_COLOR_MAP: Record<number, {
  bg: string;
  border: string;
  text: string;
  isDark: boolean;
}> = {
  25:   { bg: '#B83232', border: 'rgba(255,255,255,0.15)', text: '#FFFFFF', isDark: false },
  20:   { bg: '#2E5E9E', border: 'rgba(255,255,255,0.12)', text: '#FFFFFF', isDark: false },
  15:   { bg: '#D4882A', border: 'rgba(255,255,255,0.10)', text: '#FFFFFF', isDark: false },
  10:   { bg: '#2A7A52', border: 'rgba(255,255,255,0.12)', text: '#FFFFFF', isDark: false },
  5:    { bg: '#EAE6DF', border: 'rgba(0,0,0,0.08)',       text: '#28241C', isDark: false },
  2.5:  { bg: '#28241C', border: 'rgba(255,255,255,0.08)', text: '#EAE6DF', isDark: true  },
  1.25: { bg: '#28241C', border: 'rgba(255,255,255,0.08)', text: '#EAE6DF', isDark: true  },
};

const FALLBACK_PLATE = { bg: '#4A4A4A', border: 'rgba(255,255,255,0.08)', text: '#FFFFFF', isDark: true };

const COLOR_DOT_SIZE = 8;
const SET_CHIP_VERTICAL_PADDING = 6;
const BAR_LABEL_FONT_SIZE = 7;
const PLATE_CHIP_GAP = 6;

function getPlateColors(weight: number) {
  return PLATE_COLOR_MAP[weight] ?? FALLBACK_PLATE;
}

function getPlateHeight(weight: number) {
  if (weight >= 25) return 72;
  if (weight >= 20) return 64;
  if (weight >= 15) return 56;
  if (weight >= 10) return 48;
  if (weight >= 5)  return 40;
  return 32;
}

function getPlateWidth(weight: number) {
  if (weight >= 20) return 18;
  if (weight >= 10) return 14;
  if (weight >= 5)  return 10;
  return 8;
}

// -- Sub-components --

function Plate({ weight, side }: { weight: number; side: 'left' | 'right' }) {
  const colors = getPlateColors(weight);
  const h = getPlateHeight(weight);
  const w = getPlateWidth(weight);

  const borderSide = side === 'left'
    ? { borderRightWidth: 1, borderRightColor: colors.border }
    : { borderLeftWidth: 1, borderLeftColor: colors.border };

  return (
    <View
      style={{
        width: w,
        height: h,
        backgroundColor: colors.bg,
        borderRadius: 2,
        ...borderSide,
      }}
    />
  );
}

function Collar() {
  return (
    <View
      style={{
        width: 6,
        height: 16,
        backgroundColor: '#6B6B6B',
        borderRadius: 1,
      }}
    />
  );
}

function PlateChip({ weight, count }: { weight: number; count: number }) {
  const colors = getPlateColors(weight);

  return (
    <XStack
      backgroundColor="$surfaceSecondary"
      paddingHorizontal="$sm"
      paddingVertical="$xs"
      borderRadius="$md"
      alignItems="center"
      gap={PLATE_CHIP_GAP}
    >
      <View
        style={{
          width: COLOR_DOT_SIZE,
          height: COLOR_DOT_SIZE,
          borderRadius: COLOR_DOT_SIZE / 2,
          backgroundColor: colors.bg,
        }}
      />
      <AppText variant="bodySm" tabularNums>
        {count} × {weight}kg
      </AppText>
    </XStack>
  );
}

// -- Types --

interface SetForCalculator {
  weight: number;
  reps: number;
  isCompleted: boolean;
}

// -- Main Component --

export type PlateCalculatorSheetRef = BottomSheetModal;



export interface PlateCalculatorSheetProps {
  value: number;
  onChange: (weight: number) => void;
  barWeight: number;
  availablePlates: number[];
  sets?: SetForCalculator[];
  selectedSetIndex?: number;
  onSelectSet?: (index: number) => void;
  onClose: () => void;
  bottomInset?: number;
}

export const PlateCalculatorSheet = React.forwardRef<PlateCalculatorSheetRef, PlateCalculatorSheetProps>(
  (
    { value, onChange, barWeight, availablePlates, sets = [], selectedSetIndex = 0, onSelectSet, onClose, bottomInset = 0 },
    ref
  ) => {
    const theme = useTheme();
    const { result } = useWeightEngine({
      type: 'barbell',
      config: { barWeight, availablePlates },
      input: { targetWeight: value },
    });

    // Derivar todo del engine, sin estado local
    const hasSets = sets.length > 0;
    const plates = result.type === 'barbell' || result.type === 'dumbbell' ? result.plates : [];
    const remainder = result.type === 'barbell' || result.type === 'dumbbell' ? result.remainder : 0;
    // const barWeightDisplay = result.type === 'barbell' || result.type === 'dumbbell' ? result.barWeight : barWeight;
    const hasPlates = plates.length > 0;

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['55%']}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        onDismiss={onClose}
        backgroundStyle={{
          backgroundColor: theme.surface?.val,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.borderColor?.val,
        }}
        bottomInset={bottomInset}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <YStack padding="$xl" gap="$lg">
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center">
              <AppText variant="titleSm">Calculadora de Discos</AppText>
              <Pressable onPress={onClose} hitSlop={12}>
                <AppIcon icon={X} color="textSecondary" size={20} />
              </Pressable>
            </XStack>

            {/* Set selector */}
            {hasSets && (
              <BottomSheetScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 2, paddingHorizontal: 4 }}
              >
                {sets.map((s, i) => {
                  const isActive = i === selectedSetIndex;
                  const weightLabel = s.weight > 0 ? `${s.weight}kg` : '—';
                  // React hook cannot be called in a callback, use inline function instead
                  return (
                    <Pressable 
                      key={`set-${i}`} 
                      onPress={() => { if (onSelectSet) onSelectSet(i); }}
                    >
                      <YStack
                        paddingHorizontal="$md"
                        paddingVertical={SET_CHIP_VERTICAL_PADDING}
                        borderRadius="$full"
                        borderWidth={1}
                        backgroundColor={isActive ? '$primarySubtle' : '$surfaceSecondary'}
                        borderColor={isActive ? '$primary' : '$borderColor'}
                      >
                        <AppText
                          variant="label"
                          color={isActive ? 'primary' : 'textSecondary'}
                          fontWeight="700"
                          tabularNums
                        >
                          {`Set ${i + 1} · ${weightLabel}`}
                        </AppText>
                      </YStack>
                    </Pressable>
                  );
                })}
              </BottomSheetScrollView>
            )}

            {/* Barbell visualization */}
            <YStack alignItems="center" paddingVertical="$lg">
              <XStack alignItems="center" gap={2}>
                {/* Left plates (reversed: heaviest outside) */}
                <XStack gap={2} flexDirection="row-reverse" alignItems="center">
                  {hasPlates && <Collar />}
                  {plates.map((p: { weight: number; count: number }) =>
                    Array.from({ length: p.count }).map((_: unknown, i: number) => (
                      <Plate key={`l-${p.weight}-${i}`} weight={p.weight} side="left" />
                    )),
                  )}
                </XStack>

                {/* Bar center */}
                <YStack
                  width={hasPlates ? 40 : 80}
                  height={10}
                  backgroundColor="$borderColor"
                  borderRadius={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  {!hasPlates && (
                    <AppText variant="label" color="textTertiary" fontSize={BAR_LABEL_FONT_SIZE}>
                      {barWeight}kg
                    </AppText>
                  )}
                </YStack>

                {/* Right plates */}
                <XStack gap={2} alignItems="center">
                  {hasPlates && <Collar />}
                  {plates.map((p: { weight: number; count: number }) =>
                    Array.from({ length: p.count }).map((_: unknown, i: number) => (
                      <Plate key={`r-${p.weight}-${i}`} weight={p.weight} side="right" />
                    )),
                  )}
                </XStack>
              </XStack>

              {!hasPlates && (
                <AppText variant="bodySm" color="textTertiary" marginTop="$sm">
                  Solo barra — {barWeight}kg
                </AppText>
              )}
            </YStack>

            {/* Weight summary */}
            <YStack gap="$sm">
              <XStack justifyContent="space-between">
                <AppText variant="bodyMd" color="textSecondary">Peso Objetivo</AppText>
                <AppText variant="bodyMd" fontWeight="700" tabularNums>{value} kg</AppText>
              </XStack>
              <XStack justifyContent="space-between">
                <AppText variant="bodyMd" fontWeight="700" tabularNums>{result?.actualTotalWeight ?? 0} kg</AppText>
              </XStack>
              {remainder > 0 && (
                <AppText variant="label" color="danger" textAlign="right">
                  Faltan {remainder} kg (ajusta tus discos)
                </AppText>
              )}
            </YStack>

            {/* Plate breakdown chips */}
            {hasPlates && (
              <YStack borderTopWidth={1} borderTopColor="$borderColor" paddingTop="$md">
                <AppText variant="label" color="textTertiary" marginBottom="$sm">
                  DISCOS POR LADO
                </AppText>
                <XStack flexWrap="wrap" gap="$sm">
                  {plates.map((p: { weight: number; count: number }) => (
                    <PlateChip key={p.weight} weight={p.weight} count={p.count} />
                  ))}
                </XStack>
              </YStack>
            )}
          </YStack>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

// Name the forwardRef component so ESLint/react devtools recognize it
PlateCalculatorSheet.displayName = 'PlateCalculatorSheet';
