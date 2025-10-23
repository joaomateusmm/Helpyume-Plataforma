"use client";

import React, { useEffect, useState } from "react";

import { Tabs } from "@/components/ui/tabs";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authentication = () => {
  // Slide data functions - each returns the content for one slide
  type Slide = { image: string; title: string; caption: string };

  const getSlideOne = (): Slide => ({
    image: "/bg-1.jpg",
    title: "Gerencie seus investimentos",
    caption: "",
  });

  const getSlideTwo = (): Slide => ({
    image: "/bg-2.jpg",
    title: "Tenha controle total de suas finanças",
    caption: "",
  });

  const getSlideThree = (): Slide => ({
    image: "/bg-3.jpg",
    title: "Tenha acesso a Gráficos e Insights",
    caption: "",
  });

  const slidesData: Slide[] = [getSlideOne(), getSlideTwo(), getSlideThree()];
  const [active, setActive] = useState(0);
  const [tabValue, setTabValue] = useState<string>("sign-in");
  const [prevTab, setPrevTab] = useState<string | null>(null);
  const [prevVisible, setPrevVisible] = useState(false);
  const [activeVisible, setActiveVisible] = useState(true);

  const changeTab = (newValue: string) => {
    if (newValue === tabValue) return;
    // keep previous for fade-out
    setPrevTab(tabValue);
    setPrevVisible(true);
    // hide active, then show new active for fade-in
    setActiveVisible(false);
    setTabValue(newValue);

    // trigger CSS transitions on next frame
    requestAnimationFrame(() => {
      setPrevVisible(false);
      setActiveVisible(true);
    });

    // clear previous after transition
    setTimeout(() => setPrevTab(null), 350);
  };

  useEffect(() => {
    const id = setInterval(
      () => setActive((s) => (s + 1) % slidesData.length),
      10000,
    );
    return () => clearInterval(id);
  }, [slidesData.length]);

  return (
    <div className="bg-muted/50 min-h-screen">
      <div className="flex h-screen w-full">
        <div className="flex w-full flex-col lg:flex-row">
          {/* Left: imagem / placeholder (carousel preparado para receber 3 imagens) */}
          <aside className="relative hidden h-screen w-[85vw] items-center justify-center text-white lg:flex">
            <div className="flex h-full w-full flex-col items-center justify-center gap-6">
              <div className="relative h-full w-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 flex h-full w-[300%] transition-transform duration-700"
                  style={{
                    transform: `translateX(-${active * (100 / slidesData.length)}%)`,
                  }}
                >
                  {slidesData.map((slide, i) => (
                    <div key={i} className="h-full w-1/3 flex-shrink-0">
                      <div
                        className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-r-4xl bg-black/5"
                        style={{
                          backgroundImage: `url(${slide.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {/* dark overlay to keep text readable */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
                        <div className="relative mb-15 flex flex-col p-6 text-center text-white">
                          <h3 className="font- w-150 font-sans text-5xl">
                            {slide.title}
                          </h3>
                          <p className="mt-2 text-sm opacity-80">
                            {slide.caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {slidesData.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Ver slide ${idx + 1}`}
                      onClick={() => setActive(idx)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        active === idx ? "w-8 bg-white" : "w-6 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right: forms */}
          <main className="flex h-screen w-full items-center justify-center bg-gradient-to-t from-green-600/10 via-transparent to-black/50 p-8 lg:w-1/2">
            <div className="w-full max-w-md">
              <Tabs
                value={tabValue}
                onValueChange={changeTab}
                defaultValue="sign-in"
              >
                <div>
                  {/* Animated panels container */}
                  <div className="relative min-h-[520px]">
                    {/* Active panel (fades in) */}
                    <div
                      key={tabValue}
                      className={`w-full transition-opacity duration-300 ease-in-out ${
                        activeVisible ? "z-20 opacity-100" : "opacity-0"
                      }`}
                    >
                      {tabValue === "sign-in" ? (
                        <SignInForm
                          switchToSignUp={() => changeTab("sign-up")}
                        />
                      ) : (
                        <SignUpForm
                          switchToSignIn={() => changeTab("sign-in")}
                        />
                      )}
                    </div>

                    {/* Previous panel (fades out) */}
                    {prevTab && (
                      <div
                        className={`absolute inset-0 w-full transition-opacity duration-300 ease-in-out ${
                          prevVisible
                            ? "z-10 opacity-100"
                            : "pointer-events-none opacity-0"
                        }`}
                      >
                        {prevTab === "sign-in" ? (
                          <SignInForm
                            switchToSignUp={() => changeTab("sign-up")}
                          />
                        ) : (
                          <SignUpForm
                            switchToSignIn={() => changeTab("sign-in")}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
