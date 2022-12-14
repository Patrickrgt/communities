import Image from "next/image";
import React from "react";
import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  MenuIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";

import {
  BeakerIcon,
  ChevronDownIcon,
  HomeIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { getCsrfToken, signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";

import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";

function Header() {
  const session = useSession();

  // Wagmi hooks to interact with Metamask
  const [{ data: connectData }, connectAsync] = useConnect();
  const [, signMessage] = useSignMessage();

  const handleLogin = async () => {
    try {
      const res = await connectAsync(connectData.connectors[0]);
      const callbackUrl = "/protected";
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.data?.account,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: res.data?.chain?.id,
        nonce: await getCsrfToken(),
      });
      const { data: signature, error } = await signMessage({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  const handleLogout = async () => {
    signOut({ redirect: false });
  };

  const ethereumPresent = typeof window !== "undefined" && !!window.ethereum;

  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm items-center">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <Image
            objectFit="contain"
            src="https://links.papareact.com/fqy"
            layout="fill"
          />
        </Link>
      </div>

      <div className="mx-7 flex items-center xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className=" ml-2 hidden flex-1 lg:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      {/* Search Box */}
      <form className="flex flex-1 items-center space-x-2 border rounded-sm border-gray-200">
        <SearchIcon className="h-6 w-6 text-grey-200 bg-gray-100 px-3 py-1" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search Reddit"
        />
        <button type="submit" hidden />
      </form>

      <div className="mx-5 hidden items-center space-x-2 text-gray-500  lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <SpeakerphoneIcon className="icon" />
      </div>

      <div className="ml-5 flex items-center lg:hidden">
        <MenuIcon className="icon" />
      </div>

      {/* SIgn in / Sign out button */}
      {session ? (
        <div
          onClick={
            session.status === "authenticated" ? handleLogout : handleLogin
          }
          className="hidden cursor-pointer lg:flex items-center space-x-2 p-2 border-gray-100"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              objectFit="contain"
              src="https://links.papareact.com/23l"
              layout="fill"
              alt=""
            />
          </div>
          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">Sign Out</p>
          </div>

          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : (
        <div
          onClick={
            session.status === "authenticated" ? handleLogout : handleLogin
          }
          className="hidden cursor-pointer lg:flex items-center space-x-2 p-2 border-gray-100"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image
              objectFit="contain"
              src="https://links.papareact.com/23l"
              layout="fill"
              alt=""
            />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  );
}

export default Header;
