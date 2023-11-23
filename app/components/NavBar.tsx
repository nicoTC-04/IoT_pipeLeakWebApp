// components/Navbar.tsx
//'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Navbar.module.css'; // If using CSS Modules
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
    return (
        <div className={styles.header}>
            <Image
                src="/logo1.png"
                alt="Logo"
                height={80}
                width={80}
                className={styles.logo}
            />
            <input className={styles.sidemenu} type="checkbox" id="side-menu"/>
            <label className={styles.hamb} htmlFor="side-menu"><span className={styles.hambline}></span></label>
            <nav className={styles.nav}>
                <ul className={styles.menu}>
                    <li><Link href="/dashboard"><p>Dashboard</p></Link></li>
                    <li><Link href="/microcontroladores"><p>Microcontroladores</p></Link></li>
                    <li><Link href="/cuenta"><p>Tu cuenta</p></Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
