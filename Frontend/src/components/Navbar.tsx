import { Link } from 'react-router-dom'
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo / App name */}
      <Link to="/" className="text-2xl font-bold text-gradient">
        ResumeAI
      </Link>

      {/* User profile / Sign out menu */}
      <div className="flex items-center space-x-4">
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 border border-red-500/30",
              userButtonPopoverCard: "bg-gray-900 border border-red-900/30",
              userButtonPopoverActionButton: "text-white hover:bg-red-900/30",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverFooter: "bg-gray-800 border-t border-red-900/30",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;