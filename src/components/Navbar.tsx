import { BsPerson } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-3">
      <div className="flex items-center gap-4 text-[#101418]">
        <img
          src="/LocaMaisLogoIcone.png"
          alt="LocaMais Logo"
          className="w-12 h-12"
        />
        <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em]">
          LocaMais
        </h2>
      </div>
      {user && (
        <div className="flex gap-4">
          <label className="input rounded-xl focus:outline-none">
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
              className="grow focus:outline-none"
              placeholder="Buscar propriedades"
            />
          </label>
          <div className="dropdown dropdown-end ">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost rounded-md border border-neutral-200"
            >
              <BsPerson className="w-[20px] h-[20px] " />
            </div>
            <ul
              tabIndex={0}
              className="menu space-y-2 dropdown-content bg-base-200 rounded-box  mt-1 w-52 p-2 shadow-sm"
            >
              <li>Configurações</li>
              <li>Sair</li>
            </ul>
          </div>
        </div>
      )}
      {!user && (
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex gap-2">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#b2cbe5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em]">
              <a href="/auth/sign-up" className="truncate">
                Cadastrar
              </a>
            </button>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eaedf1] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em]">
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
