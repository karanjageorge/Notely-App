import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-100">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-slate-800">Notely</h1>

        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="hover:bg-slate-100">
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button className="bg-slate-900 hover:bg-slate-700">
              Register
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-center text-center md:text-left mt-20 px-10">
        
        {/* HERO TEXT */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
            Organize your thoughts effortlessly with{" "}
            <span className="text-slate-700">Notely.</span>
          </h1>

          <p className="text-slate-600 text-lg">
            A clean and powerful note-taking application built for clarity,
            productivity, and simplicity.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            <Link to="/register">
              <Button className="bg-slate-900 hover:bg-slate-700 px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="outline" className="px-8 py-6 text-lg hover:bg-slate-200">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* HERO ANIMATION SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex justify-center mt-10 md:mt-0"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="bg-white shadow-xl rounded-xl p-6 w-80 border"
          >
            <div className="flex items-center gap-2">
              <FileText className="text-slate-500" />
              <h3 className="font-semibold text-slate-700">Sample Note</h3>
            </div>

            <p className="mt-4 text-slate-600">
              This is an example note to show animation. Notely helps you stay
              organized and productive.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-6 text-center text-slate-600 border-t">
        © {new Date().getFullYear()} Notely. All rights reserved.
      </footer>

    </div>
  );
}
