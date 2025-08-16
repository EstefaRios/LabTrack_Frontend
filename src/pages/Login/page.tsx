import React from 'react';
import LoginForm from '../../components/LoginForm';
import { DNAParticles } from '../../components/DNAParticles';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 border border-slate-400 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-slate-300 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-slate-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-slate-300 rounded-full"></div>

        <div className="absolute top-1/2 left-10 w-20 h-20 border border-slate-500 rounded-full"></div>
        <div className="absolute top-10 right-1/4 w-16 h-16 border border-slate-300 rounded-full"></div>
        <div className="absolute bottom-10 left-1/3 w-36 h-36 border border-slate-300 rounded-full"></div>
        <div className="absolute top-3/4 right-10 w-22 h-22 border border-slate-500 rounded-full"></div>

        {/* Laboratory grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(148, 163, 184, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "100px 100px",
          }}
        ></div>

        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-400 rounded-full"></div>
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-slate-300 rounded-full"></div>
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-slate-400 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-slate-300 rounded-full"></div>

        <div className="absolute top-1/6 right-1/3 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
        <div className="absolute top-2/5 left-1/5 w-1 h-1 bg-slate-400 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-slate-300 rounded-full"></div>
        <div className="absolute bottom-1/6 right-1/5 w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
        <div className="absolute top-1/2 right-1/6 w-1 h-1 bg-slate-300 rounded-full"></div>

        {/* Additional decorative circles and dots */}
        <div className="absolute top-16 left-1/2 w-14 h-14 border border-slate-400 rounded-full"></div>
        <div className="absolute top-1/3 right-1/6 w-18 h-18 border border-slate-300 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/6 w-26 h-26 border border-slate-400 rounded-full"></div>
        <div className="absolute top-3/4 left-2/3 w-12 h-12 border border-slate-300 rounded-full"></div>
        <div className="absolute bottom-1/6 right-1/3 w-22 h-22 border border-slate-400 rounded-full"></div>

        {/* Additional small decorative dots */}
        <div className="absolute top-1/5 left-1/6 w-1 h-1 bg-slate-400 rounded-full"></div>
        <div className="absolute top-1/4 right-1/5 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
        <div className="absolute top-3/5 left-1/3 w-1 h-1 bg-slate-400 rounded-full"></div>
        <div className="absolute bottom-2/5 right-1/4 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
        <div className="absolute top-4/5 left-3/4 w-1 h-1 bg-slate-400 rounded-full"></div>
        <div className="absolute bottom-3/4 right-2/3 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
        <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-slate-400 rounded-full"></div>
        <div className="absolute bottom-1/5 right-3/4 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>

        {/* More connecting lines */}
        <div className="absolute top-1/5 right-1/4 w-18 h-0.5 bg-gradient-to-r from-slate-400 to-transparent transform rotate-25"></div>
        <div className="absolute bottom-2/5 left-1/5 w-14 h-0.5 bg-gradient-to-l from-slate-300 to-transparent transform -rotate-30"></div>
        <div className="absolute top-3/5 right-1/3 w-20 h-0.5 bg-gradient-to-r from-slate-400 to-transparent transform rotate-60"></div>
        <div className="absolute bottom-1/4 left-2/3 w-16 h-0.5 bg-gradient-to-l from-slate-300 to-transparent transform -rotate-45"></div>

        <div className="absolute top-1/4 left-1/4 w-20 h-0.5 bg-gradient-to-r from-slate-400 to-transparent transform rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/3 w-16 h-0.5 bg-gradient-to-l from-slate-300 to-transparent transform -rotate-12"></div>
        <div className="absolute top-2/3 right-1/4 w-24 h-0.5 bg-gradient-to-r from-slate-400 to-transparent transform rotate-12"></div>
      </div>

      <DNAParticles />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding and info */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img src="/src/assets/images/labtrack.png" alt="LabTrack" className="h-20 w-auto rounded-lg img-animate" />
              <div className="text-slate-600 text-base font-medium font-sans opacity-90">
                Innovación y salud, siempre contigo
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-800 font-sans">Acceso Seguro a Resultados</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-sans">
                Consulte sus resultados de laboratorio de forma segura y confidencial. Nuestro sistema garantiza la
                privacidad y precisión de su información médica con tecnología de vanguardia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                  <svg className="w-5 h-5 text-slate-600 svg-animate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-800 font-sans">Seguro</h3>
                  <p className="text-xs text-slate-600 font-sans">Datos protegidos</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                  <svg className="w-5 h-5 text-slate-600 svg-animate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-800 font-sans">Innovador</h3>
                  <p className="text-xs text-slate-600 font-sans">Tecnología avanzada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;