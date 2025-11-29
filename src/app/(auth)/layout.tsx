"use client";

import React, { useState, useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [componentVisible, setComponentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {children}
    </>
  );
};

export default AuthLayout;
