# PC Builder Community App 🖥️

A comprehensive PC building application with real-time compatibility checking, performance benchmarking, and community features.

## 🌟 Features

### Core PC Building
- **8 Component Categories**: CPU, GPU, Motherboard, Memory, Storage, PSU, Case, Cooling
- **Real-time Compatibility**: Instant validation with detailed error/warning messages
- **Smart Recommendations**: AI-powered suggestions for better components
- **Performance Metrics**: Gaming FPS and productivity benchmarks

### Community Features
- **User Authentication**: Secure sign-up/sign-in with demo account
- **Build Saving**: Save and share your PC configurations
- **Leaderboards**: Compete by performance, gaming, and popularity
- **Social Features**: Like and view community builds

### Game Benchmarking
- **Popular Games**: Cyberpunk 2077, Counter-Strike 2, VALORANT, Elden Ring
- **Real FPS Data**: Accurate performance predictions
- **Multiple Settings**: 1080p, 1440p, 4K at different quality levels

## 🚀 Quick Start

### Try the Demo
- **Email**: `demo@pcbuilder.com`
- **Password**: `demo123`
- Access pre-built configurations and full community features

### Deploy Your Own

#### 1. One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

#### 2. Manual Setup

```bash
# Clone the repository
git clone https://github.com/your-username/pc-builder-app.git
cd pc-builder-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

#### 3. Environment Variables

Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🎯 Live Demo

**[Try the Live App →](https://pc-builder-demo.vercel.app)**

Use demo credentials or create your own account to explore all features.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Supabase Edge Functions, Hono
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel, Netlify compatible

## 🎮 Gaming Performance

Includes real benchmarking data for:
- **Cyberpunk 2077**: Ray tracing performance analysis
- **Counter-Strike 2**: High refresh rate optimization
- **VALORANT**: Competitive gaming metrics
- **Elden Ring**: Open world performance
- **The Witcher 3**: RPG gaming benchmarks

## 🏆 Community Leaderboards

Compete in multiple categories:
- **Overall Performance**: Best balanced builds
- **Gaming Performance**: Highest FPS averages
- **Productivity**: Content creation powerhouses
- **Popular Builds**: Most liked and viewed

## 📱 Responsive Design

- ✅ Desktop (1920x1080+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)
- ✅ All major browsers

## 🔧 Component Database

Over 200+ real components across 8 categories:
- **CPUs**: Intel & AMD processors
- **GPUs**: NVIDIA & AMD graphics cards
- **Motherboards**: ATX, mATX, Mini-ITX
- **Memory**: DDR4 & DDR5 kits
- **Storage**: NVMe, SATA SSDs & HDDs
- **Power Supplies**: 80+ certified PSUs
- **Cases**: Full tower to Mini-ITX
- **Cooling**: Air & liquid coolers

## 🚦 Compatibility Engine

Advanced checking for:
- **Socket Compatibility**: CPU & motherboard matching
- **Power Requirements**: PSU wattage calculations
- **Memory Support**: DDR4/DDR5 validation
- **GPU Clearance**: Case & cooler conflicts
- **Form Factor**: ATX/mATX/Mini-ITX sizing

## 📊 Performance Analysis

Real-time calculations for:
- **Gaming Performance**: FPS predictions across resolutions
- **Productivity Scores**: Rendering & encoding performance
- **Bottleneck Detection**: Component balance analysis
- **Price-to-Performance**: Value optimization

## 🔒 Privacy & Security

- **Secure Authentication**: Supabase Auth integration
- **Private Builds**: Option for personal-only configurations
- **Data Protection**: GDPR compliant data handling
- **Demo Mode**: Full functionality without account

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Component data sourced from manufacturer specifications
- Game benchmarks based on real-world testing
- Community features inspired by PC building forums
- UI components built with Radix UI and shadcn/ui

---

**Built with ❤️ for the PC building community**

[Live Demo](https://pc-builder-demo.vercel.app) • [Documentation](./DEPLOYMENT.md) • [Issues](https://github.com/your-username/pc-builder-app/issues)