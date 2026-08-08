export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Shared Risk Level calculation logic:
 * For REAL HUMAN VOICE:
 *   - Confidence >= 85% -> LOW RISK (green)
 *   - Confidence 60-84.99% -> MEDIUM RISK (yellow)
 *   - Confidence < 60% -> HIGH RISK (red)
 *
 * For AI GENERATED VOICE:
 *   - Confidence >= 85% -> HIGH RISK (red)
 *   - Confidence 60-84.99% -> MEDIUM RISK (yellow)
 *   - Confidence < 60% -> LOW RISK (green)
 */
export const getRiskLevel = (confidence: number, isRealVoice: boolean): RiskLevel => {
  if (isRealVoice) {
    if (confidence >= 85) return 'LOW';
    if (confidence >= 60) return 'MEDIUM';
    return 'HIGH';
  } else {
    if (confidence >= 85) return 'HIGH';
    if (confidence >= 60) return 'MEDIUM';
    return 'LOW';
  }
};

export const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; border: string; label: string }> = {
  LOW: {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    label: 'LOW RISK',
  },
  MEDIUM: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    label: 'MEDIUM RISK',
  },
  HIGH: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    label: 'HIGH RISK',
  },
};
