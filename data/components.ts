export const componentDatabase = {
  processor: [
    {
      id: 'cpu-1',
      name: 'Core i9-13900K',
      brand: 'Intel',
      price: 589,
      specifications: {
        'Cores': '24 (8P+16E)',
        'Threads': '32',
        'Base Clock': '3.0 GHz',
        'Boost Clock': '5.8 GHz',
        'Socket': 'LGA1700',
        'TDP': '125W'
      },
      performance: 'High-End Gaming & Workstation'
    },
    {
      id: 'cpu-2',
      name: 'Ryzen 9 7900X',
      brand: 'AMD',
      price: 429,
      specifications: {
        'Cores': '12',
        'Threads': '24',
        'Base Clock': '4.7 GHz',
        'Boost Clock': '5.6 GHz',
        'Socket': 'AM5',
        'TDP': '170W'
      },
      performance: 'High-End Gaming & Content Creation'
    },
    {
      id: 'cpu-3',
      name: 'Core i5-13600K',
      brand: 'Intel',
      price: 319,
      specifications: {
        'Cores': '14 (6P+8E)',
        'Threads': '20',
        'Base Clock': '3.5 GHz',
        'Boost Clock': '5.1 GHz',
        'Socket': 'LGA1700',
        'TDP': '125W'
      },
      performance: 'Mid-Range Gaming'
    },
    {
      id: 'cpu-4',
      name: 'Ryzen 5 7600X',
      brand: 'AMD',
      price: 229,
      specifications: {
        'Cores': '6',
        'Threads': '12',
        'Base Clock': '4.7 GHz',
        'Boost Clock': '5.3 GHz',
        'Socket': 'AM5',
        'TDP': '105W'
      },
      performance: 'Budget Gaming'
    }
  ],
  'cpu-cooler': [
    {
      id: 'cooler-1',
      name: 'NH-D15',
      brand: 'Noctua',
      price: 109,
      specifications: {
        'Type': 'Air Cooler',
        'Height': '165mm',
        'Fans': '2x 140mm',
        'Socket Support': 'LGA1700, AM5, AM4',
        'Noise Level': '24.6 dB(A)'
      },
      performance: 'Premium Air Cooling'
    },
    {
      id: 'cooler-2',
      name: 'Kraken X63',
      brand: 'NZXT',
      price: 149,
      specifications: {
        'Type': 'AIO Liquid',
        'Radiator Size': '280mm',
        'Fans': '2x 140mm',
        'Socket Support': 'LGA1700, AM5, AM4',
        'Pump Speed': '2800 RPM'
      },
      performance: 'High-Performance Liquid'
    },
    {
      id: 'cooler-3',
      name: 'Hyper 212 RGB',
      brand: 'Cooler Master',
      price: 44,
      specifications: {
        'Type': 'Air Cooler',
        'Height': '158.8mm',
        'Fans': '1x 120mm RGB',
        'Socket Support': 'LGA1700, AM5, AM4',
        'Noise Level': '26 dB(A)'
      },
      performance: 'Budget-Friendly'
    }
  ],
  motherboard: [
    {
      id: 'mb-1',
      name: 'ROG Strix Z790-E',
      brand: 'ASUS',
      price: 449,
      specifications: {
        'Socket': 'LGA1700',
        'Chipset': 'Z790',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-7600+ (OC)',
        'PCIe Slots': '4x PCIe 5.0',
        'WiFi': 'WiFi 6E'
      },
      performance: 'Premium Features'
    },
    {
      id: 'mb-2',
      name: 'X670E Aorus Master',
      brand: 'Gigabyte',
      price: 499,
      specifications: {
        'Socket': 'AM5',
        'Chipset': 'X670E',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-6400+ (OC)',
        'PCIe Slots': '4x PCIe 5.0',
        'WiFi': 'WiFi 6E'
      },
      performance: 'Enthusiast Grade'
    },
    {
      id: 'mb-3',
      name: 'B650 Gaming X AX',
      brand: 'MSI',
      price: 199,
      specifications: {
        'Socket': 'AM5',
        'Chipset': 'B650',
        'Form Factor': 'ATX',
        'Memory': 'DDR5-5200+ (OC)',
        'PCIe Slots': '2x PCIe 4.0',
        'WiFi': 'WiFi 6'
      },
      performance: 'Mid-Range Value'
    }
  ],
  gpu: [
    {
      id: 'gpu-1',
      name: 'GeForce RTX 4090',
      brand: 'NVIDIA',
      price: 1599,
      specifications: {
        'Memory': '24GB GDDR6X',
        'Base Clock': '2230 MHz',
        'Boost Clock': '2520 MHz',
        'CUDA Cores': '16384',
        'Memory Bus': '384-bit',
        'TDP': '450W'
      },
      performance: '4K Gaming Ultra'
    },
    {
      id: 'gpu-2',
      name: 'GeForce RTX 4070 Ti',
      brand: 'NVIDIA',
      price: 799,
      specifications: {
        'Memory': '12GB GDDR6X',
        'Base Clock': '2310 MHz',
        'Boost Clock': '2610 MHz',
        'CUDA Cores': '7680',
        'Memory Bus': '192-bit',
        'TDP': '285W'
      },
      performance: '1440p Gaming High'
    },
    {
      id: 'gpu-3',
      name: 'Radeon RX 7800 XT',
      brand: 'AMD',
      price: 499,
      specifications: {
        'Memory': '16GB GDDR6',
        'Game Clock': '2124 MHz',
        'Boost Clock': '2430 MHz',
        'Stream Processors': '3840',
        'Memory Bus': '256-bit',
        'TDP': '263W'
      },
      performance: '1440p Gaming'
    },
    {
      id: 'gpu-4',
      name: 'GeForce RTX 4060',
      brand: 'NVIDIA',
      price: 299,
      specifications: {
        'Memory': '8GB GDDR6',
        'Base Clock': '1830 MHz',
        'Boost Clock': '2460 MHz',
        'CUDA Cores': '3072',
        'Memory Bus': '128-bit',
        'TDP': '115W'
      },
      performance: '1080p Gaming High'
    }
  ],
  memory: [
    {
      id: 'ram-1',
      name: 'Trident Z5 RGB 32GB',
      brand: 'G.Skill',
      price: 179,
      specifications: {
        'Capacity': '32GB (2x16GB)',
        'Type': 'DDR5',
        'Speed': '6000 MHz',
        'Timings': 'CL30-38-38-96',
        'Voltage': '1.35V',
        'RGB': 'Yes'
      },
      performance: 'High-Performance'
    },
    {
      id: 'ram-2',
      name: 'Vengeance LPX 16GB',
      brand: 'Corsair',
      price: 89,
      specifications: {
        'Capacity': '16GB (2x8GB)',
        'Type': 'DDR4',
        'Speed': '3200 MHz',
        'Timings': 'CL16-18-18-36',
        'Voltage': '1.35V',
        'RGB': 'No'
      },
      performance: 'Value Gaming'
    },
    {
      id: 'ram-3',
      name: 'Dominator Platinum RGB 64GB',
      brand: 'Corsair',
      price: 449,
      specifications: {
        'Capacity': '64GB (2x32GB)',
        'Type': 'DDR5',
        'Speed': '5600 MHz',
        'Timings': 'CL40-40-40-77',
        'Voltage': '1.25V',
        'RGB': 'Yes'
      },
      performance: 'Workstation/Creator'
    }
  ],
  storage: [
    {
      id: 'ssd-1',
      name: '980 PRO 2TB',
      brand: 'Samsung',
      price: 199,
      specifications: {
        'Capacity': '2TB',
        'Type': 'NVMe M.2',
        'Interface': 'PCIe 4.0',
        'Read Speed': '7000 MB/s',
        'Write Speed': '6900 MB/s',
        'Form Factor': '2280'
      },
      performance: 'Premium Performance'
    },
    {
      id: 'ssd-2',
      name: 'SN770 1TB',
      brand: 'WD',
      price: 79,
      specifications: {
        'Capacity': '1TB',
        'Type': 'NVMe M.2',
        'Interface': 'PCIe 3.0',
        'Read Speed': '3500 MB/s',
        'Write Speed': '3000 MB/s',
        'Form Factor': '2280'
      },
      performance: 'Budget Gaming'
    },
    {
      id: 'hdd-1',
      name: 'Barracuda 4TB',
      brand: 'Seagate',
      price: 89,
      specifications: {
        'Capacity': '4TB',
        'Type': 'HDD 3.5"',
        'Interface': 'SATA III',
        'RPM': '5400',
        'Cache': '256MB',
        'Form Factor': '3.5"'
      },
      performance: 'Mass Storage'
    }
  ],
  'power-supply': [
    {
      id: 'psu-1',
      name: 'RM1000x',
      brand: 'Corsair',
      price: 199,
      specifications: {
        'Wattage': '1000W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'Form Factor': 'ATX',
        'Fan Size': '135mm',
        'Warranty': '10 Years'
      },
      performance: 'High-End Systems'
    },
    {
      id: 'psu-2',
      name: 'Focus GX-850',
      brand: 'Seasonic',
      price: 139,
      specifications: {
        'Wattage': '850W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'Form Factor': 'ATX',
        'Fan Size': '135mm',
        'Warranty': '10 Years'
      },
      performance: 'Gaming Systems'
    },
    {
      id: 'psu-3',
      name: 'CV650',
      brand: 'Corsair',
      price: 69,
      specifications: {
        'Wattage': '650W',
        'Efficiency': '80+ Bronze',
        'Modular': 'Non-Modular',
        'Form Factor': 'ATX',
        'Fan Size': '120mm',
        'Warranty': '5 Years'
      },
      performance: 'Budget Builds'
    }
  ],
  case: [
    {
      id: 'case-1',
      name: 'H7 Flow',
      brand: 'NZXT',
      price: 149,
      specifications: {
        'Form Factor': 'Mid-Tower ATX',
        'Dimensions': '435 x 230 x 494mm',
        'Clearances': 'GPU: 381mm, CPU: 185mm',
        'Drive Bays': '2x 3.5", 4x 2.5"',
        'Front I/O': '1x USB-C, 2x USB-A',
        'Fans Included': '3x 120mm'
      },
      performance: 'Excellent Airflow'
    },
    {
      id: 'case-2',
      name: 'Define 7 Compact',
      brand: 'Fractal Design',
      price: 109,
      specifications: {
        'Form Factor': 'Mid-Tower ATX',
        'Dimensions': '399 x 212 x 453mm',
        'Clearances': 'GPU: 315mm, CPU: 169mm',
        'Drive Bays': '2x 3.5", 3x 2.5"',
        'Front I/O': '2x USB-A, Audio',
        'Fans Included': '2x 140mm'
      },
      performance: 'Silent Computing'
    },
    {
      id: 'case-3',
      name: 'MasterBox MB311L',
      brand: 'Cooler Master',
      price: 59,
      specifications: {
        'Form Factor': 'Micro-ATX',
        'Dimensions': '387 x 192 x 411mm',
        'Clearances': 'GPU: 350mm, CPU: 159mm',
        'Drive Bays': '1x 3.5", 2x 2.5"',
        'Front I/O': '2x USB-A, Audio',
        'Fans Included': '1x 120mm'
      },
      performance: 'Compact Budget'
    }
  ]
};