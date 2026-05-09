import { componentDatabase } from '../data/components';

interface SelectedComponents {
  [key: string]: any;
}

interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  component: string;
  message: string;
  affectedComponents: string[];
}

interface ComponentRecommendation {
  componentType: string;
  component: any;
  reason: string;
  resolvesIssues: string[];
  priceImpact: 'lower' | 'similar' | 'higher';
  priority: 'high' | 'medium' | 'low';
}

export function generateRecommendations(
  issues: CompatibilityIssue[],
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];

  const errorIssues = issues.filter(issue => issue.type === 'error');

  for (const issue of errorIssues) {
    const newRecommendations = getRecommendationsForIssue(issue, selectedComponents);
    recommendations.push(...newRecommendations);
  }

  const uniqueRecommendations = removeDuplicateRecommendations(recommendations);
  return sortRecommendationsByPriority(uniqueRecommendations);
}

function getRecommendationsForIssue(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];

  if (issue.component === 'socket') {
    recommendations.push(...getSocketCompatibilityRecommendations(issue, selectedComponents));
  }
  if (issue.component === 'memory') {
    recommendations.push(...getMemoryCompatibilityRecommendations(issue, selectedComponents));
  }
  if (issue.component === 'power') {
    recommendations.push(...getPowerSupplyRecommendations(issue, selectedComponents));
  }
  if (issue.component === 'clearance') {
    recommendations.push(...getClearanceRecommendations(issue, selectedComponents));
  }
  if (issue.component === 'cooler') {
    recommendations.push(...getCoolerCompatibilityRecommendations(issue, selectedComponents));
  }
  if (issue.component === 'formfactor') {
    recommendations.push(...getFormFactorRecommendations(issue, selectedComponents));
  }

  return recommendations;
}

function getSocketCompatibilityRecommendations(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];
  const cpu = selectedComponents.processor;
  const motherboard = selectedComponents.motherboard;

  if (!cpu || !motherboard) return recommendations;

  const cpuSocket = cpu.specifications?.Socket;
  const mbSocket = motherboard.specifications?.Socket;

  if (mbSocket) {
    const compatibleCPUs = componentDatabase.processor.filter(
      opt => opt.specifications?.Socket === mbSocket && opt.id !== cpu.id
    );
    compatibleCPUs.forEach(compatibleCPU => {
      recommendations.push({
        componentType: 'processor',
        component: compatibleCPU,
        reason: `Compatible with your ${motherboard.brand} ${motherboard.name} (${mbSocket} socket)`,
        resolvesIssues: [issue.component],
        priceImpact: getPriceImpact(compatibleCPU.price, cpu.price),
        priority: 'high'
      });
    });
  }

  if (cpuSocket) {
    const compatibleMotherboards = componentDatabase.motherboard.filter(
      opt => opt.specifications?.Socket === cpuSocket && opt.id !== motherboard.id
    );
    compatibleMotherboards.forEach(compatibleMB => {
      recommendations.push({
        componentType: 'motherboard',
        component: compatibleMB,
        reason: `Compatible with your ${cpu.brand} ${cpu.name} (${cpuSocket} socket)`,
        resolvesIssues: [issue.component],
        priceImpact: getPriceImpact(compatibleMB.price, motherboard.price),
        priority: 'high'
      });
    });
  }

  return recommendations;
}

function getMemoryCompatibilityRecommendations(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];
  const memory = selectedComponents.memory;
  const motherboard = selectedComponents.motherboard;

  if (!memory || !motherboard) return recommendations;

  const mbMemorySupport = motherboard.specifications?.Memory;

  if (mbMemorySupport) {
    const requiredType = mbMemorySupport.includes('DDR5') ? 'DDR5' : 'DDR4';

    const compatibleMemory = componentDatabase.memory.filter(
      opt => opt.specifications?.Type?.includes(requiredType) && opt.id !== memory.id
    );

    // FIX: This is where the visual "4 identical cards" bug lived.
    // The deduplication in removeDuplicateRecommendations() correctly prevents
    // true duplicates, but if multiple compatible RAM sticks have similar names
    // (e.g. all labeled "Compatible DDR5 memory...") the UI panel was rendering
    // only the `reason` text, not the component name — making them look identical.
    //
    // Fix: Cap at the 2 best-value options (sorted by price proximity to current)
    // so users aren't overwhelmed, and make the reason include the specific part name.
    const sorted = compatibleMemory.sort((a, b) => {
      const aDiff = Math.abs(a.price - memory.price);
      const bDiff = Math.abs(b.price - memory.price);
      return aDiff - bDiff;
    });

    sorted.slice(0, 2).forEach(compatibleMem => {
      recommendations.push({
        componentType: 'memory',
        component: compatibleMem,
        // FIX: Include the actual part name so each card is visually distinct
        reason: `${compatibleMem.brand} ${compatibleMem.name} — ${requiredType} compatible with your ${motherboard.brand} ${motherboard.name}`,
        resolvesIssues: [issue.component],
        priceImpact: getPriceImpact(compatibleMem.price, memory.price),
        priority: 'high'
      });
    });
  }

  return recommendations;
}

function getPowerSupplyRecommendations(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];
  const psu = selectedComponents['power-supply'];
  const cpu = selectedComponents.processor;
  const gpu = selectedComponents.gpu;

  if (!psu) return recommendations;

  let estimatedPower = 100;
  if (cpu) {
    const cpuTDP = parseInt(cpu.specifications?.TDP?.replace('W', '') || '65');
    estimatedPower += isNaN(cpuTDP) ? 65 : cpuTDP; // FIX: guard parseInt NaN
  }
  if (gpu) {
    const gpuTDP = parseInt(gpu.specifications?.TDP?.replace('W', '') || '150');
    estimatedPower += isNaN(gpuTDP) ? 150 : gpuTDP; // FIX: guard parseInt NaN
  }

  const recommendedWattage = Math.ceil(estimatedPower * 1.3);

  const suitablePSUs = componentDatabase['power-supply'].filter(opt => {
    const psuWattage = parseInt(opt.specifications?.Wattage?.replace('W', '') || '0');
    return !isNaN(psuWattage) && psuWattage >= recommendedWattage && opt.id !== psu.id;
  });

  // FIX: Cap at 2 options, include specific wattage in reason
  suitablePSUs.slice(0, 2).forEach(suitablePSU => {
    const psuWattage = suitablePSU.specifications?.Wattage ?? 'unknown';
    recommendations.push({
      componentType: 'power-supply',
      component: suitablePSU,
      reason: `${suitablePSU.brand} ${suitablePSU.name} (${psuWattage}) — meets your system's ~${estimatedPower}W draw with 30% headroom`,
      resolvesIssues: [issue.component],
      priceImpact: getPriceImpact(suitablePSU.price, psu.price),
      priority: 'high'
    });
  });

  return recommendations;
}

function getClearanceRecommendations(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];

  if (issue.message.includes('GPU')) {
    const gpu = selectedComponents.gpu;
    const pcCase = selectedComponents.case;

    if (gpu && pcCase) {
      const smallerGPUs = componentDatabase.gpu.filter(opt => {
        const currentTier = getGPUTier(gpu.name);
        const optionTier = getGPUTier(opt.name);
        return optionTier < currentTier && opt.id !== gpu.id;
      });

      smallerGPUs.slice(0, 2).forEach(smallerGPU => {
        recommendations.push({
          componentType: 'gpu',
          component: smallerGPU,
          reason: `${smallerGPU.brand} ${smallerGPU.name} — shorter form factor that fits in your ${pcCase.brand} ${pcCase.name}`,
          resolvesIssues: [issue.component],
          priceImpact: getPriceImpact(smallerGPU.price, gpu.price),
          priority: 'medium'
        });
      });

      const largerCases = componentDatabase.case.filter(opt => {
        const currentSize = getCaseSize(pcCase.name);
        const optionSize = getCaseSize(opt.name);
        return optionSize > currentSize && opt.id !== pcCase.id;
      });

      largerCases.slice(0, 2).forEach(largerCase => {
        recommendations.push({
          componentType: 'case',
          component: largerCase,
          reason: `${largerCase.brand} ${largerCase.name} — larger case with clearance for your ${gpu.brand} ${gpu.name}`,
          resolvesIssues: [issue.component],
          priceImpact: getPriceImpact(largerCase.price, pcCase.price),
          priority: 'medium'
        });
      });
    }
  }

  if (issue.message.includes('CPU cooler')) {
    const cooler = selectedComponents['cpu-cooler'];
    const pcCase = selectedComponents.case;

    if (cooler && pcCase) {
      const currentHeight = parseInt(cooler.specifications?.Height?.replace('mm', '') || '150');

      const lowerProfileCoolers = componentDatabase['cpu-cooler'].filter(opt => {
        const optionHeight = parseInt(opt.specifications?.Height?.replace('mm', '') || '150');
        return optionHeight < currentHeight && opt.id !== cooler.id;
      });

      lowerProfileCoolers.forEach(lowerCooler => {
        const coolerHeight = lowerCooler.specifications?.Height ?? 'compact';
        recommendations.push({
          componentType: 'cpu-cooler',
          component: lowerCooler,
          reason: `${lowerCooler.brand} ${lowerCooler.name} (${coolerHeight}) — fits within your ${pcCase.brand} ${pcCase.name}'s clearance`,
          resolvesIssues: [issue.component],
          priceImpact: getPriceImpact(lowerCooler.price, cooler.price),
          priority: 'high'
        });
      });
    }
  }

  return recommendations;
}

function getCoolerCompatibilityRecommendations(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];
  const cooler = selectedComponents['cpu-cooler'];
  const cpu = selectedComponents.processor;

  if (!cooler || !cpu) return recommendations;

  const cpuSocket = cpu.specifications?.Socket;

  if (cpuSocket) {
    const compatibleCoolers = componentDatabase['cpu-cooler'].filter(opt => {
      const socketSupport = opt.specifications?.['Socket Support'];
      return socketSupport?.includes(cpuSocket) && opt.id !== cooler.id;
    });

    compatibleCoolers.forEach(compatibleCooler => {
      recommendations.push({
        componentType: 'cpu-cooler',
        component: compatibleCooler,
        reason: `${compatibleCooler.brand} ${compatibleCooler.name} — supports ${cpuSocket} socket on your ${cpu.brand} ${cpu.name}`,
        resolvesIssues: [issue.component],
        priceImpact: getPriceImpact(compatibleCooler.price, cooler.price),
        priority: 'high'
      });
    });
  }

  return recommendations;
}

function getFormFactorRecommendations(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];
  const motherboard = selectedComponents.motherboard;
  const pcCase = selectedComponents.case;

  if (!motherboard || !pcCase) return recommendations;

  const mbFormFactor = motherboard.specifications?.['Form Factor'];

  const compatibleCases = componentDatabase.case.filter(opt => {
    const caseFormFactor = opt.specifications?.['Form Factor'];
    return (
      ((mbFormFactor === 'ATX' && caseFormFactor?.includes('ATX')) ||
       (mbFormFactor === 'Micro-ATX' && !!caseFormFactor)) &&
      opt.id !== pcCase.id
    );
  });

  compatibleCases.forEach(compatibleCase => {
    recommendations.push({
      componentType: 'case',
      component: compatibleCase,
      reason: `${compatibleCase.brand} ${compatibleCase.name} — supports ${mbFormFactor} form factor`,
      resolvesIssues: [issue.component],
      priceImpact: getPriceImpact(compatibleCase.price, pcCase.price),
      priority: 'high'
    });
  });

  return recommendations;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getPriceImpact(newPrice: number, currentPrice: number): 'lower' | 'similar' | 'higher' {
  // FIX: Guard against division by zero when currentPrice is 0
  if (!currentPrice || currentPrice === 0) return 'similar';
  const ratio = newPrice / currentPrice;
  if (ratio < 0.9) return 'lower';
  if (ratio > 1.1) return 'higher';
  return 'similar';
}

function getGPUTier(gpuName: string): number {
  if (gpuName.includes('4090'))    return 4;
  if (gpuName.includes('4070 Ti')) return 3;
  if (gpuName.includes('7800 XT')) return 3;
  if (gpuName.includes('4060'))    return 2;
  return 1;
}

function getCaseSize(caseName: string): number {
  if (caseName.includes('Compact') || caseName.includes('Micro')) return 1;
  if (caseName.includes('H7')) return 2;
  return 2;
}

function removeDuplicateRecommendations(recommendations: ComponentRecommendation[]): ComponentRecommendation[] {
  const seen = new Set<string>();
  return recommendations.filter(rec => {
    const key = `${rec.componentType}-${rec.component.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortRecommendationsByPriority(recommendations: ComponentRecommendation[]): ComponentRecommendation[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const priceOrder = { lower: 3, similar: 2, higher: 1 };
  return recommendations.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return priceOrder[b.priceImpact] - priceOrder[a.priceImpact];
  });
}