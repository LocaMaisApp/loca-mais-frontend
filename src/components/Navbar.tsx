import { useState } from "react";
import { BiChevronDown, BiCog, BiLogOut, BiSolidReport, BiUser } from "react-icons/bi";
import { BsHouse, BsHouseFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] bg-white px-10 py-3">
      <div className="flex items-center gap-4 text-[#101418]">
        <Link to={"/"} className="cursor-pointer flex gap-2 items-center">
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
          <>
            <Link
              to={"/anunciar"}
              className="text-neutral-600 hover:underline ml-6 text-sm font-semibold leading-tight tracking-[-0.015em] hover:text-primary-900 transition-colors duration-200"
            >
              Anunciar Imóvel
            </Link>
            <Link
              to={"/propriedades/cadastrar"}
              className="text-neutral-600 hover:underline ml-6 text-sm font-semibold leading-tight tracking-[-0.015em] hover:text-primary-900 transition-colors duration-200"
            >
              Cadastrar Imóvel
            </Link>
          </>
        )}
      </div>
      {user && (
        <div className="flex gap-4 items-center">
          <form
            onSubmit={handleSearch}
            className="input rounded-xl focus:outline-none"
          >
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="grow focus:outline-none h-full"
              placeholder="Buscar propriedades"
            />
          </form>

          <div
            className="dropdown dropdown-hover "
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div tabIndex={0} role="button" className="flex items-center ">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <BiUser className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.name || user.email}
                </span>
              </div>
              <BiChevronDown
                className={`w-4 h-4 text-gray-500  ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            <div
              className=" dropdown-content absolute right-0 mt-2
             w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 "
            >
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
                      {user.type === "LANDLORD" ? "Proprietário" : "Inquilino"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <BiUser className="w-4 h-4 text-gray-500" />
                  Meu Perfil
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <BiCog className="w-4 h-4 text-gray-500" />
                  Configurações
                </Link>

                {user.type === "LANDLORD" && (
                  <>
                  <Link
                    to="/proprietario/gerenciar"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                    >
                    <BsHouse className="w-4 h-4 text-gray-500" />
                    Gerenciar
                  </Link>
                  <Link
                    to="/proprietario/gerenciar/relatorios"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                    >
                    <BiSolidReport className="w-4 h-4 text-gray-500" />
                    Relatórios
                  </Link>
                    </>
                )}

                {user.type === "TENANT" && (
                  <Link
                    to="/my-rentals"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 "
                  >
                    <BsHouseFill className="w-4 h-4 text-gray-500" />
                    Meus Aluguéis
                  </Link>
                )}

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-100"
                  >
                    <BiLogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
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
