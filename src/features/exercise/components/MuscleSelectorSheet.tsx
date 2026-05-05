import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { AppText } from '@/shared/ui/AppText';
import { HIERARCHICAL_MUSCLES, MUSCLE_LABELS, MuscleKey } from '@/shared/constants/exercise';
import type { MuscleGroup } from '@kernel';
import { useTheme } from 'tamagui';

interface MuscleSelectorSheetProps {
  muscleRole: 'primary' | 'secondary';
  setMuscleRole: (role: 'primary' | 'secondary') => void;
  pendingPrimary: MuscleGroup[];
  pendingSecondary: MuscleGroup[];
  expandedGroup: string | null;
  setExpandedGroup: (g: string | null) => void;
  muscleError: string | null;
  handleToggleMuscle: (m: MuscleGroup) => void;
  confirmMuscles: () => void;
  closeSheet: () => void;
}



export function MuscleSelectorSheet({
  muscleRole,
  setMuscleRole,
  pendingPrimary,
  pendingSecondary,
  expandedGroup,
  setExpandedGroup,
  muscleError,
  handleToggleMuscle,
  confirmMuscles,
  closeSheet,
}: MuscleSelectorSheetProps) {
  const theme = useTheme();


  const activePending = muscleRole === 'primary' ? pendingPrimary : pendingSecondary;

  const primaryCount = pendingPrimary.length;
  const secondaryCount = pendingSecondary.length;

  const expandedSubdivisions = useMemo(
    () => HIERARCHICAL_MUSCLES.find((hm) => hm.category === expandedGroup)?.subdivisions ?? [],
    [expandedGroup]
  );

  const switchRole = (role: 'primary' | 'secondary') => {
    setMuscleRole(role);
    Haptics.selectionAsync();
  };

  const toggleMuscle = (muscle: MuscleGroup) => {
    handleToggleMuscle(muscle);
    Haptics.selectionAsync();
  };

  const openSubdivisions = (category: string) => {
    setExpandedGroup(category);
    Haptics.selectionAsync();
  };

  const goBack = () => {
    setExpandedGroup(null);
    Haptics.selectionAsync();
  };

  const handleConfirm = () => {
    confirmMuscles();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const surfaceBg = theme.surface?.val ?? '#fff';
  const primaryColor = theme.primary?.val ?? '#6C63FF';
  const borderColor = theme.borderColor?.val ?? '#E5E5E5';

  const surfaceSecondary = theme.surfaceSecondary?.val ?? '#F5F5F5';
  const dangerColor = theme.danger?.val ?? '#EF4444';
  const secondaryColor = theme.secondary?.val ?? '#9CA3AF';

  return (
    <View style={styles.container}>
      {/* Header con handle */}
      <View style={styles.header}>
        <View style={[styles.handle, { backgroundColor: borderColor }]} />
        <AppText variant="titleSm" fontWeight="700" color="color" style={{ marginTop: 8 }}>
          Selección de músculos
        </AppText>
      </View>

      {/* Segmented control para rol */}
      <View style={[styles.segmentedControl, { backgroundColor: surfaceSecondary, borderColor }]}>
        <Pressable
          style={[
            styles.segmentTab,
            muscleRole === 'primary' && { backgroundColor: primaryColor },
          ]}
          onPress={() => switchRole('primary')}
          accessibilityRole="tab"
          accessibilityState={{ selected: muscleRole === 'primary' }}
        >
          <AppText
            variant="bodyMd"
            fontWeight="700"
            color={muscleRole === 'primary' ? 'background' : 'textSecondary'}
          >
            Primario
          </AppText>
          {primaryCount > 0 && (
            <View style={[styles.badge, { backgroundColor: muscleRole === 'primary' ? 'rgba(255,255,255,0.3)' : primaryColor }]}>
              <AppText variant="bodySm" fontWeight="700" color={muscleRole === 'primary' ? 'background' : 'background'}>
                {primaryCount}
              </AppText>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.segmentTab,
            muscleRole === 'secondary' && { backgroundColor: secondaryColor },
          ]}
          onPress={() => switchRole('secondary')}
          accessibilityRole="tab"
          accessibilityState={{ selected: muscleRole === 'secondary' }}
        >
          <AppText
            variant="bodyMd"
            fontWeight="700"
            color={muscleRole === 'secondary' ? 'background' : 'textSecondary'}
          >
            Secundario
          </AppText>
          {secondaryCount > 0 && (
            <View style={[styles.badge, { backgroundColor: muscleRole === 'secondary' ? 'rgba(255,255,255,0.3)' : secondaryColor }]}>
              <AppText variant="bodySm" fontWeight="700" color="background">
                {secondaryCount}
              </AppText>
            </View>
          )}
        </Pressable>
      </View>

      {/* Error */}
      {muscleError && (
        <View style={[styles.errorBanner, { backgroundColor: dangerColor + '18', borderColor: dangerColor + '44' }]}>
          <AppText variant="bodySm" color="danger">⚠️ {muscleError}</AppText>
        </View>
      )}

      {/* Contenido scrollable */}

      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vista de grupos principales */}
        {!expandedGroup && (
          <View style={styles.grid}>
            {HIERARCHICAL_MUSCLES.map((hm) => {
              const isSelected = activePending.includes(hm.category as MuscleGroup);
              const hasSubdivisions = !!hm.subdivisions?.length;
              return (
                <Pressable
                  key={hm.category}
                  onPress={() => hasSubdivisions ? openSubdivisions(hm.category) : toggleMuscle(hm.category as MuscleGroup)}
                  style={({ pressed }) => [
                    styles.muscleCard,
                    {
                      backgroundColor: isSelected ? primaryColor : surfaceSecondary,
                      borderColor: isSelected ? primaryColor : borderColor,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${MUSCLE_LABELS[hm.category as MuscleKey] ?? hm.category}${hasSubdivisions ? ', expandir' : ''}${isSelected ? ', seleccionado' : ''}`}
                >
                  <AppText
                    variant="bodyMd"
                    fontWeight="700"
                    color={isSelected ? 'background' : 'color'}
                    numberOfLines={1}
                  >
                    {MUSCLE_LABELS[hm.category as MuscleKey] ?? hm.category}
                  </AppText>
                  {hasSubdivisions && (
                    <AppText
                      variant="bodySm"
                      color={isSelected ? 'background' : 'textSecondary'}
                      style={{ opacity: 0.8 }}
                    >
                      {hm.subdivisions!.length} zonas  ›
                    </AppText>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Vista de subdivisiones */}
        {expandedGroup && (
          <View>
            <Pressable
              onPress={goBack}
              style={[styles.backRow, { borderColor }]}
              accessibilityRole="button"
              accessibilityLabel="Volver a grupos"
            >
              <AppText variant="bodyMd" color="primary" fontWeight="600">‹ Volver</AppText>
              <AppText variant="titleSm" fontWeight="700" color="color">
                {MUSCLE_LABELS[expandedGroup as MuscleKey]}
              </AppText>
            </Pressable>

            <View style={styles.grid}>
              {/* Opción "todo el grupo" */}
              {(() => {
                const isWholeSelected = activePending.includes(expandedGroup as MuscleGroup);
                return (
                  <Pressable
                    onPress={() => { toggleMuscle(expandedGroup as MuscleGroup); goBack(); }}
                    style={({ pressed }) => [
                      styles.muscleCard,
                      styles.muscleCardWide,
                      {
                        backgroundColor: isWholeSelected ? primaryColor : surfaceSecondary,
                        borderColor: isWholeSelected ? primaryColor : borderColor,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isWholeSelected }}
                    accessibilityLabel={`Todo ${MUSCLE_LABELS[expandedGroup as MuscleKey] ?? expandedGroup}`}
                  >
                    <AppText
                      variant="bodyMd"
                      fontWeight="700"
                      color={isWholeSelected ? 'background' : 'color'}
                    >
                      Todo el grupo
                    </AppText>
                  </Pressable>
                );
              })()}

              {/* Subdivisiones */}
              {expandedSubdivisions.map((sub) => {
                const isSelected = activePending.includes(sub as MuscleGroup);
                return (
                  <Pressable
                    key={sub}
                    onPress={() => toggleMuscle(sub as MuscleGroup)}
                    style={({ pressed }) => [
                      styles.muscleCard,
                      {
                        backgroundColor: isSelected ? primaryColor : surfaceSecondary,
                        borderColor: isSelected ? primaryColor : borderColor,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${MUSCLE_LABELS[sub as MuscleKey] ?? sub}${isSelected ? ', seleccionado' : ''}`}
                  >
                    <AppText
                      variant="bodyMd"
                      fontWeight="700"
                      color={isSelected ? 'background' : 'color'}
                      numberOfLines={2}
                      textAlign="center"
                    >
                      {MUSCLE_LABELS[sub as MuscleKey] ?? sub}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </BottomSheetScrollView>

      {/* Acciones sticky */}
      <View style={[styles.footer, { borderColor, backgroundColor: surfaceBg }]}>
        <Pressable
          onPress={closeSheet}
          style={({ pressed }) => [
            styles.footerBtn,
            styles.cancelBtn,
            { borderColor, opacity: pressed ? 0.7 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
        >
          <AppText variant="bodyMd" fontWeight="600" color="textSecondary">Cancelar</AppText>
        </Pressable>

        <Pressable
          testID="confirm-muscles-button"
          onPress={handleConfirm}
          style={({ pressed }) => [
            styles.footerBtn,
            styles.confirmBtn,
            { backgroundColor: primaryColor, opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Confirmar selección"
        >
          <AppText variant="bodyMd" fontWeight="700" color="background">
            Confirmar {primaryCount > 0 ? `(${primaryCount})` : ''}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 3,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 6,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  muscleCard: {
    width: '47.5%',
    minHeight: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 2,
  },
  muscleCardWide: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
  },
  muscleEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 14,
    borderBottomWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    borderWidth: 1.5,
  },
  confirmBtn: {
    flex: 2,
  },
});

export default MuscleSelectorSheet;

