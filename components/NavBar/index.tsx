"use client";

import { useState } from "react";
import LoginModal from "../Auth/LoginModal";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ weight: "500", subsets: ["latin"] });

 function NavBar({ }) {
    const [modalOpen, setModalOpen] = useState(false);

    const onModalOpen = () => {
        setModalOpen(true);
    }

    const onModalClose = () => {
        setModalOpen(false);
    }

    return (
        <div className='relative w-full flex items-center justify-center h-20 dark:bg-[#0e0e0e]'>
            <button className={`px-5 py-2 dark:bg-white text-text-purple rounded-2xl text-2xl ${quicksand.className}`} onClick={onModalOpen}> Log In </button>
            <LoginModal modalOpen={modalOpen} onModalClose={onModalClose} />
        </div>
    );
}

export default NavBar;