"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiSearch, FiMenu, FiX, FiHome, FiUser, FiLogOut } from "react-icons/fi"; // Import icon
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { User } from "firebase/auth";



// Danh sách gợi ý có sẵn
const fixedSuggestions = [
  "cat", "dog", "capybara", "rabbit", "fox", "panda", "lion",
  "nature", "forest", "mountains", "ocean", "river", "desert",
  "city", "skyscraper", "street", "night lights", "architecture",
  "food", "pizza", "sushi", "coffee", "burger", "wine",
  "technology", "robot", "AI", "cyberpunk", "space", "galaxy",
  "cars", "motorcycle", "race car", "airplane", "train",
  "abstract", "minimalist", "calligraphy", "anime", "fantasy",
  "sunset", "sunrise", "clouds", "storm", "rainbow", "volcano",
  "beach", "waves", "coral", "whale", "dolphin", "shark",
  "tiger", "cheetah", "elephant", "giraffe", "zebra", "kangaroo",
  "wolf", "bear", "eagle", "owl", "parrot", "penguin",
  "chocolate", "ice cream", "steak", "pasta", "soup", "salad",
  "smartphone", "laptop", "VR", "drones", "quantum computing",
  "sports car", "SUV", "truck", "yacht", "spaceship", "satellite",
  "gothic", "steampunk", "retro", "pixel art", "sci-fi",
  "medieval", "fairy tale", "dragons", "unicorn", "wizard",
  "fireworks", "lanterns", "street art", "graffiti", "murals",
  "pyramids", "ancient ruins", "caves", "waterfalls", "cliff diving",
  "mountaineering", "hiking", "camping", "bonfire", "stargazing",
  "black hole", "supernova", "nebula", "extraterrestrial", "UFO",
  "samurai", "ninja", "warrior", "knight", "gladiator",
  "history", "renaissance", "baroque", "art deco", "modernism",
  "robotics", "nanotechnology", "biotech", "genetics", "CRISPR",
  "astronomy", "telescopes", "comets", "asteroids", "cosmology",
  "gardening", "bonsai", "succulents", "floral", "orchids",
  "ballet", "opera", "theater", "musicals", "symphony",
  "rock music", "jazz", "blues", "hip-hop", "classical",
  "tattoo", "piercing", "body art", "henna", "fashion design",
  "streetwear", "runway", "couture", "vintage", "punk style",
  "surrealism", "cubism", "pop art", "graffiti art", "psychedelic",
  "mindfulness", "meditation", "yoga", "zen", "spirituality",
  "space exploration", "Mars colony", "terraforming", "exoplanets", "dark matter",
  "historical sites", "UNESCO heritage", "museums", "art galleries", "antique shops",
  "whale watching", "safari", "birdwatching", "scuba diving", "skydiving",
  "photography", "portrait", "landscape", "macro", "aerial shots",
  "board games", "card games", "chess", "puzzles", "arcade",
  "RPG", "MMORPG", "strategy games", "FPS", "retro gaming",
  "handmade", "DIY", "crafting", "knitting", "pottery",
  "robot wars", "AI art", "holograms", "smart cities", "future tech",
  "cybersecurity", "hacking", "big data", "cloud computing", "IoT",
  "vintage cars", "classic motorcycles", "steam trains", "hot air balloons", "submarines",
  "mystery", "thriller", "horror", "science fiction", "fantasy novels",
  "wildlife photography", "nature reserves", "eco-tourism", "green energy", "sustainable living",
  "chess tournaments", "esports", "board game nights", "escape rooms", "virtual reality gaming",
  "space stations", "alien life", "extraterrestrial civilizations", "first contact", "time travel",
  "coding", "web development", "machine learning", "game development", "app development",
  "science experiments", "chemistry", "physics", "biology", "geology",
  "urban exploration", "abandoned buildings", "haunted places", "mystical sites", "time capsules",
  "aerial drone shots", "GoPro adventures", "travel vlogs", "cinematography", "documentary filmmaking",
  "classical mythology", "Greek gods", "Norse legends", "Egyptian myths", "Celtic folklore",
  "mountain biking", "rock climbing", "paragliding", "surfing", "whitewater rafting",
  "martial arts", "karate", "taekwondo", "kung fu", "Brazilian jiu-jitsu",
  "wilderness survival", "bushcraft", "foraging", "fire making", "shelter building",
  "personal finance", "investing", "cryptocurrency", "stock market", "real estate",
  "cooking", "baking", "grilling", "food photography", "restaurant reviews",
  "urban legends", "conspiracy theories", "mystery cases", "lost civilizations", "alien abductions",
  "classic literature", "poetry", "philosophy", "autobiographies", "historical fiction",
  "psychology", "neuroscience", "cognitive science", "behavioral studies", "dream analysis",
  "architecture", "landscape design", "interior design", "industrial design", "futuristic architecture",
  "superheroes", "comic books", "graphic novels", "manga", "anime cosplay",
  "sailing", "boating", "naval history", "pirates", "marine biology",
  "instrumental music", "orchestral compositions", "piano solos", "guitar riffs", "electronic beats"
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Trạng thái mở menu trên mobile  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (pathname === "/") {
      setSearchQuery("");
    }
  }, [pathname]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const filterSuggestions = (query: string) => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = fixedSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-2 px-4 flex justify-between items-center z-50">

      {/* ✅ Logo */}
      <Link href="/" className="text-2xl font-bold text-red-500">
        Pinterest
      </Link>

      {/* ✅ Search Bar */}
      <div className="flex relative flex-1 mx-2 sm:mx-4 max-w-full sm:max-w-xl">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            placeholder="Tìm kiếm ảnh..."
            value={searchQuery}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-full outline-none px-4 pr-10 focus:ring-2 focus:ring-blue-300"
          />

          {/* Nút xóa */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-gray-400 hover:bg-black rounded-full w-4 h-4 text-xs flex items-center justify-center"
            >
              Ⅹ
            </button>
          )}

          {/* Danh sách gợi ý */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <FiSearch className="inline mr-2 text-gray-500" />
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      {/* ✅ Menu Desktop */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="text-gray-600 hover:text-black">
          <FiHome size={24} />
        </Link>
        <Link href="/personal" className="text-gray-600 hover:text-black">
          <FiUser size={24} />
        </Link>
        {user && (
          <button onClick={handleLogout} className="text-gray-600 hover:text-black">
            <FiLogOut size={24} />
          </button>
        )}
      </div>


      {/* ✅ Hamburger Menu trên mobile */}
      <button className="md:hidden text-gray-600 text-2xl" onClick={toggleMenu}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>


      {/* ✅ Menu Mobile */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform ${menuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform`}
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={toggleMenu}>
          <FiX />
        </button>

        <ul className="mt-16 space-y-4 p-4">

          <li>
            <Link
              href="/"
              className="flex items-center space-x-2 text-lg  hover:text-red-500 w-full"
              onClick={toggleMenu}
            >
              <FiHome size={24} />
              <span>Trang chủ</span>
            </Link>
          </li>

          <li>
            <Link
              href="/personal"
              className="flex items-center space-x-2 text-lg  hover:text-red-500 w-full"
              onClick={toggleMenu}
            >
              <FiUser size={24} />
              <span>
                Cá nhân
              </span>
            </Link>
          </li>

          {user && (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex items-center space-x-2 text-lg  hover:text-red-500 w-full"
              >
                <FiLogOut size={24} />
                <span>Đăng xuất</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

