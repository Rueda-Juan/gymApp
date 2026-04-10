/**
 * Domain service that rounds a target weight down to the nearest
 * achievable value using the available plate denominations and bar weight.
 *
 * Plates are loaded in pairs (one per side), so the working weight
 * is always barWeight + 2 * (sum of plates per side).
 */
export class PlateRounder {
  round(targetWeight: number, availablePlates: number[], barWeight: number): number {
    const weightPerSide = (targetWeight - barWeight) / 2;
    if (weightPerSide <= 0) return barWeight;

    const sortedPlatesDesc = [...availablePlates].sort((a, b) => b - a);
    let remaining = weightPerSide;
    let totalPerSide = 0;

    for (const plate of sortedPlatesDesc) {
      while (remaining >= plate) {
        remaining -= plate;
        totalPerSide += plate;
      }
    }

    return barWeight + totalPerSide * 2;
  }
}
