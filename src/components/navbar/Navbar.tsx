"use client";
import { AppDispatch, useAppSelector } from "@/app/redux/store";
import { signOut } from "@/app/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import AuthModal from "./AuthModal";
import { useRouter, useSearchParams } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authParam = searchParams.get("auth");
  const [isNav, setNav] = useState<boolean>(false);
  const [isDimmed, setDimmed] = useState<boolean>(false);
  const [isAuth, setAuth] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const userData = useAppSelector((state) => state.authReducer.value);

  //on nav button press
  const handleIsNav = () => {
    setDimmed(!isDimmed);
    setNav(!isNav);
    isDimmed
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "hidden");
  };

  //on dim overlay press
  const handleDim = () => {
    setDimmed(!isDimmed);
    //router.replace("/");
    setNav(false);
    setAuth(false);
    isDimmed
      ? (document.body.style.overflow = "auto")
      : (document.body.style.overflow = "hidden");
  };

  //on auth button press
  const toggleAuthModal = useCallback(() => {
    console.log(userData);
    setNav(false);
    setDimmed(true);
    setAuth(true);
    // router.push("/?auth=true");
    document.body.style.overflow = "hidden";
  }, [userData]);

  const handleResize = () => {
    if (isDimmed && isNav && window.innerWidth > 1000) {
      document.body.style.overflow = "auto";
      setNav(false);
      setDimmed(false);
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };
  const cachedHandleResize = useCallback(handleResize, [isDimmed, isNav]);
  const buttonTitles = ["Недвижимость", "Авто", "Вещи"];

  useEffect(() => {
    window.addEventListener("resize", cachedHandleResize);
    return () => {
      window.removeEventListener("resize", cachedHandleResize);
    };
  }, [cachedHandleResize]);

  useEffect(() => {
    if (authParam) {
      toggleAuthModal();
    }
  }, [authParam, toggleAuthModal]);
  return (
    <>
      <div
        className="fixed z-10 flex h-20 w-screen items-center justify-between
       bg-white px-5 py-4 lg:justify-center lg:px-64 lg:shadow-md "
      >
        <div className=" flex-grow justify-start lg:hidden">
          <div className=" flex select-none items-center !justify-start  ">
            <div
              className="cursor-pointer p-2 hover:bg-slate-200"
              onClick={handleIsNav}
            >
              <span
                className={`block ${
                  isNav ? "translate-y-[6px] -rotate-45" : "rotate-0"
                } mb-1 h-[2px] w-[20px] bg-slate-800 transition-all duration-300 ease-out`}
              ></span>
              <span
                className={`block ${
                  isNav ? "opacity-0" : "opacity-100"
                } mb-1 h-[2px] w-[20px] bg-slate-800 transition-all duration-300 ease-out`}
              ></span>
              <span
                className={`block ${
                  isNav ? "translate-y-[-6px] rotate-45" : "rotate-0"
                } mb-1 h-[2px] w-[20px] bg-slate-800 transition-all duration-300 ease-out`}
              ></span>
            </div>
          </div>
        </div>
        <div
          onClick={() => console.log(userData)}
          className="flex min-w-[150px] justify-center"
        >
          <Link href="/">
            <Image
              className="pr-4"
              src="/rea-logo.png"
              width="150"
              height="300"
              alt="Logo"
            />
          </Link>
        </div>

        <nav
          className={`fixed ${isNav ? " left-0 " : "left-[-20rem]"}
        top-20 z-10 flex h-full w-64 flex-grow flex-col items-center
        border-t-2 border-slate-300 bg-white transition-all 
        duration-200  ease-out lg:relative lg:left-0 lg:top-0 lg:h-auto lg:w-auto
        lg:flex-row lg:justify-start lg:border-t-0 lg:transition-none 
      `}
        >
          {buttonTitles.map((title) => {
            return (
              <Link
                href={`/${title.toLowerCase()}`}
                key={title}
                className="nav-button"
              >
                {title}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex flex-grow items-center justify-center lg:flex-grow-0 lg:justify-end">
          {userData.name === "" ? (
            <button onClick={toggleAuthModal} className="button">
              Вход
            </button>
          ) : (
            <button onClick={() => dispatch(signOut())} className="button">
              Выйти
            </button>
          )}
        </div>
      </div>
      {isAuth && <AuthModal handleDim={handleDim} />}
      <div
        onClick={handleDim}
        className={`${
          isDimmed ? " opacity-70  brightness-0" : "pointer-events-auto hidden"
        }
    fixed ${
      !isAuth ? "lg:hidden" : "z-20"
    } h-full min-h-screen w-full bg-slate-300`}
      />
      <span className="mb-4 block h-20 w-full" />
    </>
  );
};

export default Navbar;
