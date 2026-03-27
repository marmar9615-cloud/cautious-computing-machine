import { GeneratedFile } from '../index';

export function getLandingTemplate(): GeneratedFile[] {
  return [
    {
      path: 'src/App.tsx',
      content: `import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
`,
    },
    {
      path: 'src/pages/HomePage.tsx',
      content: `import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

const features = [
  {
    title: 'Lightning Fast',
    description: 'Built with modern technologies for blazing fast performance and optimal user experience.',
    icon: 'bolt',
  },
  {
    title: 'Fully Responsive',
    description: 'Looks great on every device, from mobile phones to widescreen desktops.',
    icon: 'device',
  },
  {
    title: 'Easy to Customize',
    description: 'Clean, well-organized code that makes customization and extension a breeze.',
    icon: 'code',
  },
  {
    title: 'Secure by Default',
    description: 'Built with security best practices to keep your data and users safe.',
    icon: 'shield',
  },
  {
    title: 'SEO Optimized',
    description: 'Structured for search engines to help your site rank higher in results.',
    icon: 'search',
  },
  {
    title: '24/7 Support',
    description: 'Our team is always available to help you with any questions or issues.',
    icon: 'support',
  },
];

function HomePage() {
  return (
    <>
      <nav className="fixed top-0 z-20 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="text-xl font-bold text-gray-900">{{APP_NAME}}</a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-600 transition-colors hover:text-gray-900">Features</a>
            <a href="#cta" className="text-sm text-gray-600 transition-colors hover:text-gray-900">Get Started</a>
            <a
              href="#cta"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Sign Up Free
            </a>
          </div>
        </div>
      </nav>

      <Hero />

      <section id="features" className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Powerful features to help you build, launch, and grow your project.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Join thousands of users who are already building with {{APP_NAME}}.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-lg font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
            >
              Start Free Trial
            </a>
            <a
              href="#"
              className="rounded-xl border border-gray-300 px-8 py-3.5 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
`,
    },
    {
      path: 'src/components/Hero.tsx',
      content: `function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 to-white" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          Now in public beta
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Build something
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> amazing</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
          {{APP_NAME}} gives you the tools and components you need to ship modern web
          applications faster than ever. Focus on your product, not the plumbing.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#cta"
            className="rounded-xl bg-indigo-600 px-8 py-3.5 text-lg font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
          >
            Get Started Free
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-xl px-8 py-3.5 text-lg font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Learn more
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
`,
    },
    {
      path: 'src/components/FeatureCard.tsx',
      content: `interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const iconPaths: Record<string, string> = {
  bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
  device: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  support: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
};

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
        <svg
          className="h-6 w-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={iconPaths[icon] || iconPaths.bolt}
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

export default FeatureCard;
`,
    },
    {
      path: 'src/components/Footer.tsx',
      content: `function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-bold text-gray-900">{{APP_NAME}}</span>
            <p className="mt-2 text-sm text-gray-500">
              Building the future, one component at a time.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Features</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">About</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-700">License</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-gray-400">
          &copy; {year} {{APP_NAME}}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
`,
    },
  ];
}
