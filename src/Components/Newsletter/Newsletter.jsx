import React from 'react';
import Navbar from '../Navbar/Navbar';

const Newsletter = () => {
  return (
    <>
    
    <div className="  text-center ">
     <p className="uppercase text-xs text-gray-400 tracking-widest mb-1">Newsletter</p>
        <h2 className="text-2xl md:text-3xl font-[Playfair_Display] mb-4 text-[#A78074]">
          Join Now to Get Special Offers <br /> Every Month
        </h2>
      <p className="text-gray-500 mb-6">Every Month</p>

      <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
        <input
          type="email"
          placeholder="E-mail address"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button className="mt-3 inline-block px-6 py-2 border border-[#A78074] bg-[#A78074] text-white rounded hover:bg-white hover:text-[#A78074] transition">
          Subscribe
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4 max-w-xl mx-auto">
        By pressing the button “Subscribe”, you confirm that you have read and are agreeing to our Terms of Use
        regarding the storage of the data submitted through this form.
      </p>
    </div>
    </>
    
  );
};

export default Newsletter;
