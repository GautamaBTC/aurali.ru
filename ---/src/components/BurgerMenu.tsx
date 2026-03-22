import { useState, useEffect, useCallback } from 'react';

interface BurgerMenuProps {
  className?: string;
}

export default function BurgerMenu({ className = '' }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { label: 'Главная', href: '#' },
    { label: 'Услуги', href: '#services' },
    { label: 'О нас', href: '#about' },
    { label: 'Галерея', href: '#gallery' },
    { label: 'Контакты', href: '#contact' },
  ];

  const toggleMenu = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (!isOpen) {
      setIsOpen(true);
      setMenuVisible(true);
    } else {
      setMenuVisible(false);
      // Delay closing state for exit animation
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
    
    // Reset animation lock
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  }, [isOpen, isAnimating]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, toggleMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={toggleMenu}
        className={`
          relative z-50 flex h-14 w-14 flex-col items-center justify-center 
          rounded-2xl bg-white/80 backdrop-blur-xl
          shadow-soft
          transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
          hover:bg-white hover:shadow-lg hover:scale-105
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-[#9caf88]/30 focus:ring-offset-2
          ${className}
        `}
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
      >
        {/* Ripple Container */}
        <span className="absolute inset-0 overflow-hidden rounded-2xl">
          <span 
            className={`
              absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/5 to-[#c4826c]/5
              transition-opacity duration-300
              ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </span>
        
        {/* Burger Lines Container */}
        <div className="relative flex h-5 w-7 flex-col justify-between">
          {/* Line 1 - Short (left aligned) */}
          <span
            className={`
              block h-[2px] rounded-full
              bg-gradient-to-r from-[#1e3a5f] via-[#4a6b8a] to-[#c4826c]
              bg-[length:200%_100%]
              transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
              origin-left
              ${isOpen 
                ? 'w-full translate-x-[2px] translate-y-[9px] rotate-45 bg-[position:100%_0]' 
                : 'w-4 bg-[position:0%_0]'
              }
            `}
            style={{
              transitionDelay: isOpen ? '0ms' : '150ms',
            }}
          />
          
          {/* Line 2 - Full width (middle) */}
          <span
            className={`
              block h-[2px] rounded-full
              bg-gradient-to-r from-[#c4826c] via-[#9caf88] to-[#1e3a5f]
              bg-[length:200%_100%]
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isOpen 
                ? 'w-0 opacity-0 translate-x-4 bg-[position:100%_0]' 
                : 'w-full opacity-100 bg-[position:0%_0]'
              }
            `}
            style={{
              transitionDelay: isOpen ? '0ms' : '75ms',
            }}
          />
          
          {/* Line 3 - Medium (right aligned) */}
          <span
            className={`
              block h-[2px] rounded-full self-end
              bg-gradient-to-r from-[#9caf88] via-[#4a6b8a] to-[#1e3a5f]
              bg-[length:200%_100%]
              transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
              origin-right
              ${isOpen 
                ? 'w-full -translate-x-[2px] -translate-y-[9px] -rotate-45 bg-[position:100%_0] self-auto' 
                : 'w-5 bg-[position:0%_0]'
              }
            `}
            style={{
              transitionDelay: isOpen ? '100ms' : '0ms',
            }}
          />
        </div>
        
        {/* Hover glow effect */}
        <span 
          className={`
            absolute inset-0 -z-10 rounded-2xl
            bg-gradient-to-br from-[#1e3a5f]/20 to-[#c4826c]/20
            blur-xl opacity-0 transition-opacity duration-500
            group-hover:opacity-100
          `}
        />
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div
          className={`
            fixed inset-0 z-40
            bg-gradient-to-br from-[#f5f0e6]/95 via-white/90 to-[#f5f0e6]/95
            backdrop-blur-2xl
            ${menuVisible ? 'menu-enter' : 'menu-exit'}
          `}
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleMenu();
          }}
        >
          {/* Decorative blurred gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className={`
                absolute -top-1/4 -left-1/4 w-1/2 h-1/2
                bg-gradient-to-br from-[#1e3a5f]/20 to-transparent
                rounded-full blur-3xl
                transition-all duration-1000 ease-out
                ${menuVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
              `}
              style={{ transitionDelay: '200ms' }}
            />
            <div 
              className={`
                absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3
                bg-gradient-to-tl from-[#c4826c]/20 to-transparent
                rounded-full blur-3xl
                transition-all duration-1000 ease-out
                ${menuVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
              `}
              style={{ transitionDelay: '300ms' }}
            />
            <div 
              className={`
                absolute top-1/3 right-1/4 w-1/3 h-1/3
                bg-gradient-to-bl from-[#9caf88]/15 to-transparent
                rounded-full blur-2xl
                transition-all duration-1000 ease-out
                ${menuVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
              `}
              style={{ transitionDelay: '400ms' }}
            />
          </div>

          {/* Menu Content */}
          <nav className="relative h-full flex flex-col justify-center items-start px-8 md:px-16 lg:px-24">
            <ul className="space-y-6 md:space-y-8">
              {menuItems.map((item, index) => (
                <li 
                  key={item.label}
                  className={menuVisible ? 'menu-item-enter' : ''}
                  style={{ 
                    animationDelay: `${200 + index * 100}ms`,
                  }}
                >
                  <a
                    href={item.href}
                    onClick={toggleMenu}
                    className="
                      group relative inline-block
                      text-3xl md:text-5xl lg:text-6xl font-light
                      text-[#1e3a5f] hover:text-[#c4826c]
                      transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                    "
                  >
                    <span className="relative z-10 block overflow-hidden">
                      <span 
                        className="
                          block transition-transform duration-500 
                          ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                          group-hover:-translate-y-full
                        "
                      >
                        {item.label}
                      </span>
                      <span 
                        className="
                          absolute top-full left-0
                          bg-gradient-to-r from-[#1e3a5f] via-[#9caf88] to-[#c4826c]
                          bg-clip-text text-transparent
                          transition-transform duration-500 
                          ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                          group-hover:-translate-y-full
                        "
                      >
                        {item.label}
                      </span>
                    </span>
                    
                    {/* Underline */}
                    <span 
                      className="
                        absolute -bottom-2 left-0 h-[2px] w-0
                        bg-gradient-to-r from-[#1e3a5f] via-[#9caf88] to-[#c4826c]
                        transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                        group-hover:w-full
                      "
                    />
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div 
              className={`
                mt-16 md:mt-24 space-y-4
                ${menuVisible ? 'menu-item-enter' : ''}
              `}
              style={{ animationDelay: '700ms' }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-[#4a6b8a]/60">
                Контакты
              </p>
              <a 
                href="tel:+79001234567"
                className="
                  block text-xl md:text-2xl text-[#1e3a5f] hover:text-[#c4826c]
                  transition-colors duration-300
                "
              >
                +7 (900) 123-45-67
              </a>
              <p className="text-[#4a6b8a]/80">
                Ежедневно с 9:00 до 21:00
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
