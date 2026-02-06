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
  
  // Only process error-level issues for recommendations
  const errorIssues = issues.filter(issue => issue.type === 'error');
  
  for (const issue of errorIssues) {
    const newRecommendations = getRecommendationsForIssue(issue, selectedComponents);
    recommendations.push(...newRecommendations);
  }
  
  // Remove duplicates and sort by priority
  const uniqueRecommendations = removeDuplicateRecommendations(recommendations);
  return sortRecommendationsByPriority(uniqueRecommendations);
}

function getRecommendationsForIssue(
  issue: CompatibilityIssue,
  selectedComponents: SelectedComponents
): ComponentRecommendation[] {
  const recommendations: ComponentRecommendation[] = [];
  
  // Socket compatibility issues
  if (issue.component === 'socket') {
    recommendations.push(...getSocketCompatibilityRecommendations(issue, selectedComponents));
  }
  
  // Memory compatibility issues
  if (issue.component === 'memory') {
    recommendations.push(...getMemoryCompatibilityRecommendations(issue, selectedComponents));
  }
  
  // Power supply issues
  if (issue.component === 'power') {
    recommendations.push(...getPowerSupplyRecommendations(issue, selectedComponents));
  }
  
  // Clearance issues
  if (issue.component === 'clearance') {
    recommendations.push(...getClearanceRecommendations(issue, selectedComponents));
  }
  
  // Cooler compatibility issues
  if (issue.component === 'cooler') {
    recommendations.push(...getCoolerCompatibilityRecommendations(issue, selectedComponents));
  }
  
  // Form factor issues
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
  
  // Recommend compatible CPUs for the current motherboard
  if (mbSocket) {
    const compatibleCPUs = componentDatabase.processor.filter(
      processorOption => processorOption.specifications?.Socket === mbSocket && processorOption.id !== cpu.id
    );
    
    compatibleCPUs.forEach(compatibleCPU => {
      const priceImpact = getPriceImpact(compatibleCPU.price, cpu.price);
      recommendations.push({
        componentType: 'processor',
        component: compatibleCPU,
        reason: `Compatible with your ${motherboard.brand} ${motherboard.name} motherboard (${mbSocket} socket)`,
        resolvesIssues: [issue.component],
        priceImpact,
        priority: 'high'
      });
    });
  }
  
  // Recommend compatible motherboards for the current CPU
  if (cpuSocket) {
    const compatibleMotherboards = componentDatabase.motherboard.filter(
      mbOption => mbOption.specifications?.Socket === cpuSocket && mbOption.id !== motherboard.id
    );
    
    compatibleMotherboards.forEach(compatibleMB => {
      const priceImpact = getPriceImpact(compatibleMB.price, motherboard.price);
      recommendations.push({
        componentType: 'motherboard',
        component: compatibleMB,
        reason: `Compatible with your ${cpu.brand} ${cpu.name} processor (${cpuSocket} socket)`,
        resolvesIssues: [issue.component],
        priceImpact,
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
      memOption => memOption.specifications?.Type?.includes(requiredType) && memOption.id !== memory.id
    );
    
    compatibleMemory.forEach(compatibleMem => {
      const priceImpact = getPriceImpact(compatibleMem.price, memory.price);
      recommendations.push({
        componentType: 'memory',
        component: compatibleMem,
        reason: `Compatible ${requiredType} memory for your ${motherboard.brand} ${motherboard.name} motherboard`,
        resolvesIssues: [issue.component],
        priceImpact,
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
  
  // Calculate required wattage
  let estimatedPower = 100; // Base system power
  if (cpu) {
    const cpuTDP = parseInt(cpu.specifications?.TDP?.replace('W', '') || '65');
    estimatedPower += cpuTDP;
  }
  if (gpu) {
    const gpuTDP = parseInt(gpu.specifications?.TDP?.replace('W', '') || '150');
    estimatedPower += gpuTDP;
  }
  
  const recommendedWattage = Math.ceil(estimatedPower * 1.3); // 30% headroom
  
  const suitablePSUs = componentDatabase['power-supply'].filter(psuOption => {
    const psuWattage = parseInt(psuOption.specifications?.Wattage?.replace('W', '') || '0');
    return psuWattage >= recommendedWattage && psuOption.id !== psu.id;
  });
  
  suitablePSUs.forEach(suitablePSU => {
    const priceImpact = getPriceImpact(suitablePSU.price, psu.price);
    const psuWattage = suitablePSU.specifications?.Wattage;
    recommendations.push({
      componentType: 'power-supply',
      component: suitablePSU,
      reason: `Provides sufficient power (${psuWattage}) for your system (estimated ${estimatedPower}W + headroom)`,
      resolvesIssues: [issue.component],
      priceImpact,
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
  
  // GPU clearance issues
  if (issue.message.includes('GPU')) {
    const gpu = selectedComponents.gpu;
    const pcCase = selectedComponents.case;
    
    if (gpu && pcCase) {
      // Recommend smaller GPUs
      const smallerGPUs = componentDatabase.gpu.filter(gpuOption => {
        // Simplified: assume smaller tier GPUs are shorter
        const currentGPUTier = getGPUTier(gpu.name);
        const optionGPUTier = getGPUTier(gpuOption.name);
        return optionGPUTier < currentGPUTier && gpuOption.id !== gpu.id;
      });
      
      smallerGPUs.slice(0, 2).forEach(smallerGPU => {
        const priceImpact = getPriceImpact(smallerGPU.price, gpu.price);
        recommendations.push({
          componentType: 'gpu',
          component: smallerGPU,
          reason: `Smaller form factor that should fit in your ${pcCase.brand} ${pcCase.name}`,
          resolvesIssues: [issue.component],
          priceImpact,
          priority: 'medium'
        });
      });
      
      // Recommend larger cases
      const largerCases = componentDatabase.case.filter(caseOption => {
        const currentCaseSize = getCaseSize(pcCase.name);
        const optionCaseSize = getCaseSize(caseOption.name);
        return optionCaseSize > currentCaseSize && caseOption.id !== pcCase.id;
      });
      
      largerCases.slice(0, 2).forEach(largerCase => {
        const priceImpact = getPriceImpact(largerCase.price, pcCase.price);
        recommendations.push({
          componentType: 'case',
          component: largerCase,
          reason: `Larger case with better clearance for your ${gpu.brand} ${gpu.name}`,
          resolvesIssues: [issue.component],
          priceImpact,
          priority: 'medium'
        });
      });
    }
  }
  
  // CPU cooler clearance issues
  if (issue.message.includes('CPU cooler')) {
    const cooler = selectedComponents['cpu-cooler'];
    const pcCase = selectedComponents.case;
    
    if (cooler && pcCase) {
      // Recommend lower profile coolers
      const lowerProfileCoolers = componentDatabase['cpu-cooler'].filter(coolerOption => {
        const currentHeight = parseInt(cooler.specifications?.Height?.replace('mm', '') || '150');
        const optionHeight = parseInt(coolerOption.specifications?.Height?.replace('mm', '') || '150');
        return optionHeight < currentHeight && coolerOption.id !== cooler.id;
      });
      
      lowerProfileCoolers.forEach(lowerCooler => {
        const priceImpact = getPriceImpact(lowerCooler.price, cooler.price);
        const coolerHeight = lowerCooler.specifications?.Height;
        recommendations.push({
          componentType: 'cpu-cooler',
          component: lowerCooler,
          reason: `Lower profile cooler (${coolerHeight}) that fits in your ${pcCase.brand} ${pcCase.name}`,
          resolvesIssues: [issue.component],
          priceImpact,
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
    const compatibleCoolers = componentDatabase['cpu-cooler'].filter(coolerOption => {
      const socketSupport = coolerOption.specifications?.['Socket Support'];
      return socketSupport?.includes(cpuSocket) && coolerOption.id !== cooler.id;
    });
    
    compatibleCoolers.forEach(compatibleCooler => {
      const priceImpact = getPriceImpact(compatibleCooler.price, cooler.price);
      recommendations.push({
        componentType: 'cpu-cooler',
        component: compatibleCooler,
        reason: `Supports your ${cpu.brand} ${cpu.name} processor (${cpuSocket} socket)`,
        resolvesIssues: [issue.component],
        priceImpact,
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
  
  // Recommend compatible cases
  const compatibleCases = componentDatabase.case.filter(caseOption => {
    const caseFormFactor = caseOption.specifications?.['Form Factor'];
    // ATX cases support Micro-ATX, but not vice versa
    return (mbFormFactor === 'ATX' && caseFormFactor?.includes('ATX')) ||
           (mbFormFactor === 'Micro-ATX' && caseFormFactor) &&
           caseOption.id !== pcCase.id;
  });
  
  compatibleCases.forEach(compatibleCase => {
    const priceImpact = getPriceImpact(compatibleCase.price, pcCase.price);
    recommendations.push({
      componentType: 'case',
      component: compatibleCase,
      reason: `Supports ${mbFormFactor} motherboards like your ${motherboard.brand} ${motherboard.name}`,
      resolvesIssues: [issue.component],
      priceImpact,
      priority: 'high'
    });
  });
  
  return recommendations;
}

function getPriceImpact(newPrice: number, currentPrice: number): 'lower' | 'similar' | 'higher' {
  const ratio = newPrice / currentPrice;
  if (ratio < 0.9) return 'lower';
  if (ratio > 1.1) return 'higher';
  return 'similar';
}

function getGPUTier(gpuName: string): number {
  if (gpuName.includes('4090')) return 4;
  if (gpuName.includes('4070 Ti')) return 3;
  if (gpuName.includes('7800 XT')) return 3;
  if (gpuName.includes('4060')) return 2;
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
  return recommendations.sort((a, b) => {
    // First sort by priority
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by price impact (prefer lower/similar prices)
    const priceOrder = { lower: 3, similar: 2, higher: 1 };
    return priceOrder[b.priceImpact] - priceOrder[a.priceImpact];
  });
}