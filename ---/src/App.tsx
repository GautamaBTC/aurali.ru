import BurgerMenu from './components/BurgerMenu';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e6] via-white to-[#f5f0e6] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top-left blurred gradient */}
        <div 
          className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 
            bg-gradient-to-br from-[#1e3a5f]/10 via-[#4a6b8a]/5 to-transparent 
            rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        
        {/* Bottom-right blurred gradient */}
        <div 
          className="absolute -bottom-1/4 -right-1/3 w-3/4 h-3/4 
            bg-gradient-to-tl from-[#c4826c]/15 via-[#9caf88]/5 to-transparent 
            rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
        
        {/* Center accent */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-1/2 h-1/2 
            bg-gradient-to-r from-[#9caf88]/5 to-[#c4826c]/5 
            rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        />
      </div>

      {/* Header with Burger Menu */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="relative z-50">
            <h1 className="text-2xl md:text-3xl font-light tracking-wider">
              <span className="bg-gradient-to-r from-[#1e3a5f] via-[#4a6b8a] to-[#c4826c] bg-clip-text text-transparent">
                SERENE
              </span>
              <span className="text-[#9caf88] ml-2 font-extralight">spa</span>
            </h1>
          </div>
          
          {/* Burger Menu */}
          <BurgerMenu />
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative min-h-screen flex items-center justify-center px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Decorative element */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#9caf88]" />
              <svg 
                className="w-6 h-6 text-[#9caf88]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2C13.5 2 15 3.5 15 5C15 6.5 14 8 12 9.5C10 8 9 6.5 9 5C9 3.5 10.5 2 12 2ZM12 11C14 12.5 15 14.5 15 16C15 18 13.5 20 12 22C10.5 20 9 18 9 16C9 14.5 10 12.5 12 11Z"/>
              </svg>
              <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#9caf88]" />
            </div>
          </div>
          
          {/* Main Title */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-wide text-[#1e3a5f] leading-tight">
            Гармония
            <br />
            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#9caf88] to-[#c4826c] bg-clip-text text-transparent">
              тела и разума
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#4a6b8a]/70 font-light max-w-2xl mx-auto leading-relaxed">
            Откройте для себя пространство абсолютного спокойствия, 
            где каждая деталь создана для вашего восстановления
          </p>
          
          {/* CTA Button */}
          <div className="pt-8">
            <button 
              className="
                group relative px-10 py-4 
                bg-gradient-to-r from-[#1e3a5f] via-[#4a6b8a] to-[#1e3a5f]
                bg-[length:200%_100%] bg-[position:0%_0]
                text-white font-light tracking-wider
                rounded-full overflow-hidden
                shadow-lg shadow-[#1e3a5f]/20
                transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                hover:bg-[position:100%_0] hover:shadow-xl hover:shadow-[#1e3a5f]/30
                hover:scale-105
                active:scale-95
              "
            >
              <span className="relative z-10">Записаться</span>
              
              {/* Shine effect */}
              <span 
                className="
                  absolute inset-0 -translate-x-full
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  group-hover:translate-x-full
                  transition-transform duration-1000 ease-out
                "
              />
            </button>
          </div>
        </div>
      </main>

      {/* Floating Elements Demo */}
      <section className="py-24 px-6 md:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[#9caf88]">
              Наши услуги
            </p>
            <h3 className="text-3xl md:text-4xl font-extralight text-[#1e3a5f]">
              Путь к восстановлению
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Массаж', 
                desc: 'Традиционные техники для глубокого расслабления',
                icon: '🌿'
              },
              { 
                title: 'Уход за лицом', 
                desc: 'Премиальные процедуры для сияющей кожи',
                icon: '✨'
              },
              { 
                title: 'Хаммам', 
                desc: 'Древние ритуалы очищения и обновления',
                icon: '🌊'
              },
            ].map((service, index) => (
              <div 
                key={service.title}
                className="
                  group relative p-8 
                  bg-white/60 backdrop-blur-xl
                  rounded-3xl border border-white/50
                  shadow-soft
                  transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                  hover:bg-white/80 hover:shadow-lg hover:-translate-y-2
                "
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-6">{service.icon}</div>
                <h4 className="text-xl font-light text-[#1e3a5f] mb-3">
                  {service.title}
                </h4>
                <p className="text-[#4a6b8a]/70 font-light leading-relaxed">
                  {service.desc}
                </p>
                
                {/* Gradient line */}
                <div 
                  className="
                    absolute bottom-0 left-8 right-8 h-[2px]
                    bg-gradient-to-r from-[#1e3a5f] via-[#9caf88] to-[#c4826c]
                    transform scale-x-0 origin-left
                    transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                    group-hover:scale-x-100
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Info Section */}
      <section className="py-16 px-6 md:px-8 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-xl rounded-full border border-white/50 shadow-soft">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9caf88] to-[#c4826c] animate-pulse" />
            <span className="text-sm text-[#4a6b8a] font-light tracking-wide">
              Нажмите на бургер-меню в правом верхнем углу
            </span>
          </div>
          
          <p className="text-[#4a6b8a]/60 text-sm">
            Демонстрация плавной анимации с градиентами для спа-салона
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-8 border-t border-[#9caf88]/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#4a6b8a]/50 text-sm font-light">
            © 2026 SERENE spa. Все права защищены.
          </p>
          <div className="flex gap-8">
            {['Instagram', 'Telegram', 'WhatsApp'].map((social) => (
              <a 
                key={social}
                href="#"
                className="
                  text-[#4a6b8a]/50 text-sm font-light
                  hover:text-[#c4826c] transition-colors duration-300
                "
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
