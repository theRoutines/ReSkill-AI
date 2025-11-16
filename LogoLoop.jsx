import React from "react";
import { motion } from "framer-motion";

// IMPORT YOUR LOGOS
import logo1 from "../assets/logo1.jpeg";
import logo2 from "../assets/logo2.jpeg";
import logo3 from "../assets/logo3.jpeg";
import logo4 from "../assets/logo4.jpeg";
import logo5 from "../assets/logo5.jpeg";

// ARRAY OF IMAGES
const logos = [logo1, logo2, logo3, logo4, logo5];

const LogoLoop = () => {
  return (
    <div className="w-full overflow-hidden py-8 bg-black">
      <motion.div
        className="flex space-x-20"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "linear",
        }}
      >
        {/* DUPLICATE THE ARRAY TO MAKE INFINITE LOOP */}
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`logo-${index}`}
            className="h-20 w-auto object-contain"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LogoLoop;
