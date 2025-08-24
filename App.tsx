import React, { useState, useEffect, useRef, useCallback } from 'react';
import { analyticsService } from './services/analyticsService';
import { useLeadForm } from './hooks/useLeadForm';
import { TrendCard } from './components/TrendCard';
import type { TrendCardData } from './types';

const trendCardData: TrendCardData[] = [
  { category: 'AI · 생성', title: '오픈소스 모델의 상업 채택 가속', summary: '대규모 언어 모델의 오픈소스화가 기업들의 AI 도입 장벽을 낮추고 있습니다.', sourceName: '뉴럴뉴스', sourceLogoUrl: 'https://picsum.photos/40/40?grayscale&random=1', publishedDate: '2025-08-24' },
  { category: '커머스', title: '라이브쇼핑 리텐션 2배 만든 포맷', summary: '단순 판매를 넘어 엔터테인먼트 요소를 결합한 새로운 포맷이 고객 유지율을 극대화합니다.', sourceName: '리테일랩', sourceLogoUrl: 'https://picsum.photos/40/40?grayscale&random=2', publishedDate: '2025-08-23' },
  { category: '소셜', title: '짧은 형태 뉴스레터의 재부상', summary: '정보 과잉 시대에 대응해, 한 가지 주제를 깊이 있게 다루는 짧은 뉴스레터가 인기를 끌고 있습니다.', sourceName: '미디어인사이트', sourceLogoUrl: 'https://picsum.photos/40/40?grayscale&random=3', publishedDate: '2025-08-22' },
  { category: '블록체인', title: '실물자산 토큰화(RWA) 시장 개화', summary: '부동산, 미술품 등 전통 자산을 블록체인에 올려 유동성을 확보하는 시장이 본격적으로 열리고 있습니다.', sourceName: '크립토리포트', sourceLogoUrl: 'https://picsum.photos/40/40?grayscale&random=4', publishedDate: '2025-08-21' },
];

const Header: React.FC = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0F]/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#" className="text-2xl font-bold tracking-tighter text-white">firstvibe</a>
            <nav className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#footer" className="hover:text-white transition-colors">Privacy</a>
                <a href="mailto:contact@firstvibe.com" className="hover:text-white transition-colors">Contact</a>
            </nav>
        </div>
    </header>
);

const Hero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    useEffect(() => {
        const timer = setTimeout(() => analyticsService.viewHero(), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCta = () => {
        analyticsService.clickCta('hero_primary');
        onCtaClick();
    };

    return (
        <section id="hero" className="pt-32 pb-16 text-center">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6">
                    오늘의 트렌드, 딱 핵심만
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
                    업계 큐레이터가 엄선한 하이라이트를 매일 메일로 받아보세요.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                    <button 
                        onClick={handleCta}
                        className="w-full sm:w-auto text-lg font-semibold bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-500 transform hover:scale-105 transition-all duration-300"
                    >
                        가입 없이 메일로 하이라이트 받기
                    </button>
                </div>
                <p className="text-sm text-gray-500">
                    출처 기반 큐레이션 • 60초 요약 • 무료 하이라이트
                </p>
            </div>
        </section>
    );
};

const TrendCardsSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    analyticsService.viewCards(trendCardData.length);
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section id="cards" ref={sectionRef} className="py-16 opacity-0 transform translate-y-8 transition-all duration-1000 ease-out">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">오늘의 트렌드 미리보기</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trendCardData.map((card, index) => (
                        <TrendCard key={index} data={card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const LeadFormSection: React.FC<{ formRef: React.RefObject<HTMLDivElement> }> = ({ formRef }) => {
    const { formData, honeypot, errors, isLoading, isSubmitted, submitError, handleInputChange, handleHoneypotChange, handleSubmit } = useLeadForm();
    const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsSubmitButtonEnabled(true), 200);
        return () => clearTimeout(timer);
    }, []);
    
    if (isSubmitted) {
        return (
            <div ref={formRef} className="py-24 text-center bg-gray-900/50 rounded-lg">
                 <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-green-400 mb-4">제출 완료!</h2>
                    <p className="text-lg text-gray-300 mb-6">곧 오늘의 하이라이트를 보내드릴게요.</p>
                    <p className="text-sm text-gray-500">스팸함을 확인해주세요. 구독 취소는 언제든 가능합니다.</p>
                </div>
            </div>
        );
    }

    return (
        <section id="lead-form" ref={formRef} className="py-16 bg-[#111115] rounded-t-3xl">
            <div className="container mx-auto px-6 max-w-lg">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-6">
                         <div className="relative">
                            <label htmlFor="name" className="sr-only">이름</label>
                            <input type="text" id="name" name="name" placeholder="이름" value={formData.name} onChange={handleInputChange} required className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
                            {errors.name && <p id="name-error" className="text-red-400 text-sm mt-2">{errors.name}</p>}
                        </div>
                        <div className="relative">
                            <label htmlFor="email" className="sr-only">이메일</label>
                            <input type="email" id="email" name="email" placeholder="이메일 주소" value={formData.email} onChange={handleInputChange} required className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
                             {errors.email && <p id="email-error" className="text-red-400 text-sm mt-2">{errors.email}</p>}
                        </div>
                        <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                                <input id="consent" name="consent" type="checkbox" checked={formData.consent} onChange={handleInputChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined} />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="consent" className="font-medium text-gray-300">개인정보 수집 및 이메일 수신에 동의합니다.</label>
                            </div>
                        </div>
                         {errors.consent && <p id="consent-error" className="text-red-400 text-sm -mt-4">{errors.consent}</p>}
                        {/* Honeypot field for spam prevention */}
                        <input type="text" name="company" className="hidden" value={honeypot} onChange={handleHoneypotChange} tabIndex={-1} autoComplete="off" />

                        <button 
                            type="submit" 
                            disabled={isLoading || !isSubmitButtonEnabled} 
                            className="w-full text-lg font-semibold bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-500 transform hover:scale-102 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 flex justify-center items-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>처리 중...</span>
                                </>
                            ) : "하이라이트 받기"}
                        </button>
                        {submitError && <p className="text-red-400 text-sm text-center">{submitError}</p>}
                    </div>
                </form>
            </div>
        </section>
    );
};

const Footer: React.FC = () => (
    <footer id="footer" className="bg-[#111115] text-center py-8">
        <div className="container mx-auto px-6 text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Firstvibe. All Rights Reserved.</p>
            <div className="mt-2">
                <a href="#footer" className="hover:text-gray-400 transition-colors">개인정보처리방침</a>
            </div>
        </div>
    </footer>
);

function App() {
    const formRef = useRef<HTMLDivElement>(null);

    const handleCtaClick = useCallback(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <>
            <Header />
            <main>
                <Hero onCtaClick={handleCtaClick} />
                <TrendCardsSection />
                <LeadFormSection formRef={formRef} />
            </main>
            <Footer />
        </>
    );
}

export default App;