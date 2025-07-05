import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
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
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a
                className="text-[#101418] text-sm font-medium leading-normal"
                href="#"
              >
                Anunciar Propriedade
              </a>
              <a
                className="text-[#101418] text-sm font-medium leading-normal"
                href="#"
              >
                Alugar Propriedade
              </a>
              <a
                className="text-[#101418] text-sm font-medium leading-normal"
                href="#"
              >
                Sobre Nós
              </a>
              <a
                className="text-[#101418] text-sm font-medium leading-normal"
                href="#"
              >
                Contatos
              </a>
            </div>
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
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCI-Cb1hsx85KKqavsuCo4aHwb9YZEsLFH08w46t8qOX_SKyNWUhvign_yu1Lt5DWmGaoCWghGTP9oCzjtlWD2rMpmsuiCgZfIaplkRcGgQVYBt1bberf-VVUvFKVY-6aPuWyPhWNXWS6nWnWjdes4fj5P431rHU5pWyIvvvSCMFR7wUuEya7oYaLsKrthjt-uF_1U_4Qwo6ab1H56mO6FQAYtnEFL4qI1f-vAzEanK4yXfrbbl1o3IlJxmloptIvYBPlI5llMwMw")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Aluguel Direto, Simplificado
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Conecte-se diretamente com proprietários e inquilinos.
                      Gerencie anúncios, contratos, pagamentos e manutenção sem
                      esforço.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-3 flex justify-center">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#b2cbe5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Anunciar Propriedade</span>
                    </button>
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#eaedf1] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                      <span className="truncate">Encontrar Propriedade</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#101418] tracking-light  text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                  Gestão Completa de Propriedades
                </h1>
                <p className="text-[#101418] text-base font-normal leading-normal max-w-[720px]">
                  O LocaMais oferece um conjunto abrangente de ferramentas para
                  simplificar seu processo de aluguel.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dbe2] bg-gray-50 p-4 flex-col">
                  <div
                    className="text-[#101418]"
                    data-icon="House"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101418] text-base font-bold leading-tight">
                      Anúncios de Propriedades
                    </h2>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Crie e gerencie anúncios detalhados de propriedades com
                      facilidade.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dbe2] bg-gray-50 p-4 flex-col">
                  <div
                    className="text-[#101418]"
                    data-icon="FileText"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101418] text-base font-bold leading-tight">
                      Gestão de Contratos
                    </h2>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Gere e gerencie contratos de aluguel diretamente no
                      aplicativo.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dbe2] bg-gray-50 p-4 flex-col">
                  <div
                    className="text-[#101418]"
                    data-icon="CurrencyDollar"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101418] text-base font-bold leading-tight">
                      Controle de Pagamentos
                    </h2>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Acompanhe pagamentos, envie lembretes e gerencie
                      transações financeiras.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#d4dbe2] bg-gray-50 p-4 flex-col">
                  <div
                    className="text-[#101418]"
                    data-icon="Wrench"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96,72.34,72.34,0,0,0,94,124.94L33.79,177c-.15.12-.29.26-.43.39a32,32,0,0,0,45.26,45.26c.13-.13.27-.28.39-.42L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69ZM160,152a56.14,56.14,0,0,1-27.07-7,8,8,0,0,0-9.92,1.77L67.11,211.51a16,16,0,0,1-22.62-22.62L109.18,133a8,8,0,0,0,1.77-9.93,56,56,0,0,1,58.36-82.31l-31.2,33.81a8,8,0,0,0-1.94,7.1L141.83,108a8,8,0,0,0,6.14,6.14l26.35,5.66a8,8,0,0,0,7.1-1.94l33.81-31.2A56.06,56.06,0,0,1,160,152Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#101418] text-base font-bold leading-tight">
                      Agendamento de Manutenção
                    </h2>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Agende e gerencie solicitações de manutenção e reparos com
                      eficiência.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1 className="text-[#101418] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                  Principais Recursos
                </h1>
                <p className="text-[#101418] text-base font-normal leading-normal max-w-[720px]">
                  Explore as funcionalidades principais que fazem do LocaMais a
                  solução ideal para aluguéis diretos.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCu4wdtB1rsvap0dLVnvw5WoLWTD-ROno53iswlNFe75je6kVBnNisAxvd7y6tarXXlXMWtoA4oSxkix9rERVXU2g7kXXfqZAACnmVDpkFCADVUxM_Ftzczg-PhsR-AtlktvnSviq8b4kHtZxtemBwXa72oXI9qtXhEc8D3c_Ld8zjlLQfEJJuspariZqbzv7OM9jKz56HjGpXGGBNcBd-CpNU8ZADO99q2Q_v8vGUdwv_17vrzTM0moxprfSM-hNQ-MxSo2vVdnw")',
                    }}
                  ></div>
                  <div>
                    <p className="text-[#101418] text-base font-medium leading-normal">
                      Comunicação Direta
                    </p>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Comunique-se diretamente com inquilinos ou proprietários
                      através do sistema de mensagens do aplicativo.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCBN4sj70s_aomDEQUmFiD95k82L9lwW2qVzjkGTwCWS2ZspF3PIF57TPm3w5-HJUccupv0IkU9pjRgn3TH0NNIZ-KWPuFUeI8C1Fd9Bo7SknU8PHJqdF6G83-XSBPaS6PJzdufj05H7A-ombUZSWa0JZrgt2NFV4Y-Dp5sXP2K0o512x3OjZKXgJq0BEeuqMxk7kWnw6HlgBG2Mibetr4WtNrgJSnR5vt9MRmkXoT0ALKjUGYLoJurzOyw8yiu4Kgn-qYSOEpO7w")',
                    }}
                  ></div>
                  <div>
                    <p className="text-[#101418] text-base font-medium leading-normal">
                      Relatórios Financeiros
                    </p>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Gere relatórios financeiros detalhados para receitas,
                      despesas e desempenho geral.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtdZMd6Y1uX51WUh3y0Ak-rkowsAjvbbXl2JUwvmHIS3qm0GMOvLsP1Tb0aF9bD35v4qXcCFFP3yThAfjUsnJDLh04dPgE5D9vSBU5R3DJ0fYJ9UlIGvgLr-WPzdoD7iMZePjZfZhOK5xoSbn0DqN4aDtC4mX1ldRPr9yMB2SxmwurVDfwT5F9aA6Pd3RmBE6laJKuU0-JrEeZltuPTyO6uR_wYryejn_nu9YeLmfyS2zx_5QSnaxluqNCLYxQK7elQLc5XOYXqA")',
                    }}
                  ></div>
                  <div>
                    <p className="text-[#101418] text-base font-medium leading-normal">
                      Transações Seguras
                    </p>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Garanta transações seguras e confiáveis com processamento
                      de pagamento.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBw0wecZ7GvyjBxWwes6KbmJdkWRIJxDYuUXPBa8UEyjR2cFHsv2aFmpNX1HSmJQ6hYI-X-fs9kNftBWvg4Cp5vLuIen0-PmAlfFKwTljdKFAO3Xux3i_eUBV2dVMbuoOuapFRMd9Xrt2yP6amGEuMsDe9bGL2FtMBoqHK5xeQVcmDKs7emXssUQI1EaaWy5NYOmLjgoQCAuSiWxTaHytI9IikYHasKV8aqODa2ks5aku5TR0Mo3WbVkBnzQHv6av4ErkaNMnl4lQ")',
                    }}
                  ></div>
                  <div>
                    <p className="text-[#101418] text-base font-medium leading-normal">
                      Interface Amigável
                    </p>
                    <p className="text-[#5c728a] text-sm font-normal leading-normal">
                      Desfrute de uma experiência perfeita e intuitiva com nosso
                      design amigável ao usuário.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="@container">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 items-center text-center">
                  <h1
                    className="text-[#101418] tracking-light text-[32px] font-bold leading-tight 
                  @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                  >
                    Pronto para Simplificar seus Aluguéis?
                  </h1>
                  <p className="text-[#101418] text-base font-normal leading-normal max-w-[720px">
                    Cadastre-se hoje e experimente o futuro da gestão direta de
                    propriedades.
                  </p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#b2cbe5] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow">
                      <span className="truncate">Começar Agora</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a
                  className="text-[#5c728a] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  Sobre Nós
                </a>
                <a
                  className="text-[#5c728a] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  Contato
                </a>
                <a
                  className="text-[#5c728a] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  Termos de Serviço
                </a>
                <a
                  className="text-[#5c728a] text-base font-normal leading-normal min-w-40"
                  href="#"
                >
                  Política de Privacidade
                </a>
              </div>
              <p className="text-[#5c728a] text-base font-normal leading-normal">
                © 2025 LocaMais. Todos os direitos reservados.
              </p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
