interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  component: string;
  message: string;
  affectedComponents: string[];
}

interface SelectedComponents {
  [key: string]: any;
}

export function checkCompatibility(selectedComponents: SelectedComponents): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  
  const cpu = selectedComponents.processor;
  const motherboard = selectedComponents.motherboard;
  const memory = selectedComponents.memory;
  const gpu = selectedComponents.gpu;
  const cooler = selectedComponents['cpu-cooler'];
  const psu = selectedComponents['power-supply'];
  const pcCase = selectedComponents.case;

  // CPU and Motherboard Socket Compatibility
  if (cpu && motherboard) {
    const cpuSocket = cpu.specifications?.Socket;
    const mbSocket = motherboard.specifications?.Socket;
    
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push({
        type: 'error',
        component: 'socket',
        message: `CPU socket (${cpuSocket}) is not compatible with motherboard socket (${mbSocket})`,
        affectedComponents: ['processor', 'motherboard']
      });
    }
  }

  // Memory Type Compatibility
  if (memory && motherboard) {
    const memoryType = memory.specifications?.Type;
    const mbMemory = motherboard.specifications?.Memory;
    
    if (memoryType && mbMemory) {
      const memoryStandard = memoryType.includes('DDR5') ? 'DDR5' : 'DDR4';
      const mbSupportsMemory = mbMemory.includes(memoryStandard);
      
      if (!mbSupportsMemory) {
        issues.push({
          type: 'error',
          component: 'memory',
          message: `${memoryType} memory is not compatible with motherboard that supports ${mbMemory}`,
          affectedComponents: ['memory', 'motherboard']
        });
      }
    }
  }

  // CPU and Memory Type Compatibility
  if (cpu && memory) {
    const memoryType = memory.specifications?.Type;
    const cpuId = cpu.id;
    
    // Intel 12th/13th gen and AMD Ryzen 7000 series support DDR5
    // Older generations typically support DDR4
    if (memoryType && cpuId) {
      const supportsDDR5 = cpuId.includes('cpu-1') || cpuId.includes('cpu-2') || cpuId.includes('cpu-3'); // Intel 13th gen and AMD 7000 series
      const isDDR5Memory = memoryType.includes('DDR5');
      const isDDR4Memory = memoryType.includes('DDR4');
      
      if (isDDR5Memory && !supportsDDR5) {
        issues.push({
          type: 'warning',
          component: 'memory',
          message: `This CPU may not support DDR5 memory. Check CPU specifications.`,
          affectedComponents: ['processor', 'memory']
        });
      }
    }
  }

  // Power Supply Wattage Check
  if (psu && (cpu || gpu)) {
    const psuWattage = parseInt(psu.specifications?.Wattage?.replace('W', '') || '0');
    let estimatedPower = 100; // Base system power
    
    if (cpu) {
      const cpuTDP = parseInt(cpu.specifications?.TDP?.replace('W', '') || '65');
      estimatedPower += cpuTDP;
    }
    
    if (gpu) {
      const gpuTDP = parseInt(gpu.specifications?.TDP?.replace('W', '') || '150');
      estimatedPower += gpuTDP;
    }
    
    // Add some headroom (20% minimum)
    const recommendedWattage = Math.ceil(estimatedPower * 1.2);
    
    if (psuWattage < recommendedWattage) {
      issues.push({
        type: 'error',
        component: 'power',
        message: `Power supply (${psuWattage}W) may be insufficient. Recommended: ${recommendedWattage}W+`,
        affectedComponents: ['power-supply', 'processor', 'gpu']
      });
    } else if (psuWattage < estimatedPower * 1.1) {
      issues.push({
        type: 'warning',
        component: 'power',
        message: `Power supply wattage is close to estimated consumption. Consider higher wattage for better efficiency.`,
        affectedComponents: ['power-supply']
      });
    }
  }

  // GPU and Case Clearance
  if (gpu && pcCase) {
    const gpuLength = gpu.specifications?.['Memory Bus']; // Using this as a proxy since we don't have actual length
    const caseClearance = pcCase.specifications?.Clearances;
    
    if (caseClearance) {
      const maxGpuLength = parseInt(caseClearance.split('GPU: ')[1]?.split('mm')[0] || '300');
      
      // Estimate GPU length based on model (this is simplified)
      let estimatedGpuLength = 250; // Default
      if (gpu.name.includes('4090')) estimatedGpuLength = 340;
      else if (gpu.name.includes('4070 Ti')) estimatedGpuLength = 300;
      else if (gpu.name.includes('7800 XT')) estimatedGpuLength = 320;
      
      if (estimatedGpuLength > maxGpuLength) {
        issues.push({
          type: 'error',
          component: 'clearance',
          message: `GPU may not fit in case. Estimated GPU length: ${estimatedGpuLength}mm, Case clearance: ${maxGpuLength}mm`,
          affectedComponents: ['gpu', 'case']
        });
      }
    }
  }

  // CPU Cooler and Case Height Clearance
  if (cooler && pcCase) {
    const coolerHeight = parseInt(cooler.specifications?.Height?.replace('mm', '') || '150');
    const caseClearance = pcCase.specifications?.Clearances;
    
    if (caseClearance) {
      const maxCoolerHeight = parseInt(caseClearance.split('CPU: ')[1]?.split('mm')[0] || '160');
      
      if (coolerHeight > maxCoolerHeight) {
        issues.push({
          type: 'error',
          component: 'clearance',
          message: `CPU cooler (${coolerHeight}mm) may not fit in case. Maximum height: ${maxCoolerHeight}mm`,
          affectedComponents: ['cpu-cooler', 'case']
        });
      }
    }
  }

  // CPU Cooler Socket Support
  if (cooler && cpu) {
    const coolerSupport = cooler.specifications?.['Socket Support'];
    const cpuSocket = cpu.specifications?.Socket;
    
    if (coolerSupport && cpuSocket && !coolerSupport.includes(cpuSocket)) {
      issues.push({
        type: 'error',
        component: 'cooler',
        message: `CPU cooler does not support ${cpuSocket} socket`,
        affectedComponents: ['cpu-cooler', 'processor']
      });
    }
  }

  // Memory Speed and Motherboard Support
  if (memory && motherboard) {
    const memorySpeed = parseInt(memory.specifications?.Speed?.replace(' MHz', '') || '0');
    const mbMemorySupport = motherboard.specifications?.Memory;
    
    if (memorySpeed && mbMemorySupport) {
      // Extract maximum supported speed from motherboard specs
      const maxSupportedSpeed = parseInt(mbMemorySupport.match(/(\d+)\+/)?.[1] || '3200');
      
      if (memorySpeed > maxSupportedSpeed) {
        issues.push({
          type: 'warning',
          component: 'memory',
          message: `Memory speed (${memorySpeed}MHz) exceeds motherboard specification (${maxSupportedSpeed}MHz+). May run at lower speed.`,
          affectedComponents: ['memory', 'motherboard']
        });
      }
    }
  }

  // Form Factor Compatibility
  if (motherboard && pcCase) {
    const mbFormFactor = motherboard.specifications?.['Form Factor'];
    const caseFormFactor = pcCase.specifications?.['Form Factor'];
    
    if (mbFormFactor && caseFormFactor) {
      // Simplified check - ATX case should support Micro-ATX, but not vice versa
      if (mbFormFactor === 'ATX' && caseFormFactor === 'Micro-ATX') {
        issues.push({
          type: 'error',
          component: 'formfactor',
          message: `ATX motherboard will not fit in Micro-ATX case`,
          affectedComponents: ['motherboard', 'case']
        });
      }
    }
  }

  return issues;
}

export function getCompatibilityStatus(issues: CompatibilityIssue[]) {
  const errors = issues.filter(issue => issue.type === 'error');
  const warnings = issues.filter(issue => issue.type === 'warning');
  
  if (errors.length > 0) {
    return {
      status: 'error' as const,
      message: `${errors.length} critical compatibility issue${errors.length > 1 ? 's' : ''} found`,
      color: 'destructive' as const
    };
  } else if (warnings.length > 0) {
    return {
      status: 'warning' as const,
      message: `${warnings.length} compatibility warning${warnings.length > 1 ? 's' : ''} found`,
      color: 'secondary' as const
    };
  } else {
    return {
      status: 'compatible' as const,
      message: 'All components are compatible',
      color: 'default' as const
    };
  }
}