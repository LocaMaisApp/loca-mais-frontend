import { useState } from "react";
import { BiChevronDown, BiCog, BiLogOut, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-3">
      <div className="flex items-center gap-4 text-[#101418]">
        <Link to={"/"} className="cursor-pointer">
          <img
            src="/LocaMaisLogoIcone.png"
            alt="LocaMais Logo"
            className="w-12 h-12"
          />
          <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em]">
            LocaMais
          </h2>
        </Link>
        {user && user?.type == "LANDLORD" && (
          <Link
            to={"/anunciar"}
            className="text-neutral-600 hover:underline ml-6 text-sm font-semibold leading-tight tracking-[-0.015em] hover:text-primary-900 transition-colors duration-200"
          >
            Anunciar Imóvel
          </Link>
        )}
      </div>
      {user && (
        <div className="flex gap-4 items-center">
          <label className="input rounded-xl  focus:outline-none">
            <svg
              className="h-[1.5em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow focus:outline-none h-full"
              placeholder="Buscar propriedades"
            />
          </label>

          <div
            className="relative"
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <BiUser className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name || user.email}
                </span>
              </div>
              <BiChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <BiUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name || "Usuário"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                        {user.type === "LANDLORD"
                          ? "Proprietário"
                          : "Inquilino"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <BiUser className="w-4 h-4 text-gray-500" />
                    Meu Perfil
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <BiCog className="w-4 h-4 text-gray-500" />
                    Configurações
                  </Link>

                  {user.type === "LANDLORD" && (
                    <Link
                      to="/my-properties"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V3"
                        ></path>
                      </svg>
                      Meus Imóveis
                    </Link>
                  )}

                  {user.type === "TENANT" && (
                    <Link
                      to="/my-rentals"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                      Meus Aluguéis
                    </Link>
                  )}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <BiLogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!user && (
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex gap-2">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#b2cbe5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#9bb8d3] transition-colors duration-200">
              <a href="/auth/sign-up" className="truncate">
                Cadastrar
              </a>
            </button>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eaedf1] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d1d5db] transition-colors duration-200">
              <a href="/auth/sign-in" className="truncate">
                Entrar
              </a>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
