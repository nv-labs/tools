"use client";

import { useState, FC, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";
import Dropdown from "./dropdown";
import SignIn from "./sign-in";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header: FC = () => {
  const { user, signOut } = useContext(UserContext);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="header pt-6 pb-10">
        <div className="container flex justify-between items-center">
          <a href="/">
            <Image
              src={"/img/logo.svg"}
              className="opacity-90 w-36 lg:w-auto"
              alt="Logo"
              width={180}
              height={27}
            />
          </a>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1 md:gap-3">
              {!user ? (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setShowSignInModal(!showSignInModal);
                  }}
                >
                  Sign in
                </button>
              ) : (
                <Dropdown signOut={signOut} />
              )}
              {user ? (
                <Link href="/new-tool" className="btn btn-secondary btn-sm">
                  Submit tool
                </Link>
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowSignInModal(!showSignInModal);
                  }}
                >
                  Submit tool
                </button>
              )}
            </div>
          </div>{" "}
        </div>

        <SignIn showModal={showSignInModal} setShowModal={setShowSignInModal} />
      </header>
    </>
  );
};

export default Header;
