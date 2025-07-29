import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import kottp from '../../assets/kottp.jpg';
import fady from '../../assets/fady.jpeg';
import hedra from '../../assets/hedra.jpeg';
import Navbar from "../Navbar/Navbar";

const team = [
  {
    name: "Mahmoud Hussein Kamal",
    role: "Frontend Developer",
    image: kottp,
    linkedin: "https://www.linkedin.com/in/mahmoud-hussein-0bb055242/",
    github: "https://github.com/kottp6/",
  },
  {
    name: "Fady Gabriel Ghattas",
    role: "Frontend Developer",
    image: fady,
    linkedin: "https://www.linkedin.com/in/fady-gabriel-74522a253",
    github: "https://github.com/FadyGabriel",
  },
  {
    name: "Monica Hanna Rezq",
    role: "Frontend Developer",
    image: "", // Image intentionally missing
    linkedin: "https://www.linkedin.com/in/monica-hanna-0b087430b",
    github: "https://github.com/monicahanna1942",
  },
  {
    name: "Hedra Talat Hosny",
    role: "Frontend Developer",
    image: hedra,
    linkedin: "https://www.linkedin.com/in/hedra-talat-071924339/",
    github: "https://github.com/Hedratalat",
  },
  {
    name: "Mariem Mourad Ramadan",
    role: "Frontend Developer",
    image: "", // Image intentionally missing
    linkedin: "https://www.linkedin.com/in/mariem-mourad",
    github: "https://github.com/mariem-mourad",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function OurTeam() {
  return (
    <>
    <Navbar></Navbar>
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <motion.h2
          className="text-5xl font-light mb-16 border-b border-[#A77F73] pb-4 text-[#A77F73]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Team
        </motion.h2>
        <p className="text-gray-600">Meet the people who make it all happen</p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md overflow-hidden p-6 text-center"
          >
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-[#A77F73] text-white flex items-center justify-center text-2xl font-bold mb-4">
                {getInitials(member.name)}
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
            <p className="text-gray-500">{member.role}</p>
            <div className="flex justify-center mt-4 space-x-4 text-gray-600 text-xl">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <FaLinkedin />
              </a>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                <FaGithub />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    </>
  );
}
