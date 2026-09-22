import Head from "next/head";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import Logo from "../components/Logo";

export default function Home() {
  return (
    <>
      <Head>
        <title>Por dentro das empresas — Tudo sobre uma empresa em um só lugar</title>
      </Head>
      <header className="flex justify-between items-center px-8 py-5 linha-registro">
        <Logo />
        <nav className="flex gap-6 text-sm">
          <Link href="/login">Entrar</Link>
          <Link href="/cadastro">Criar conta</Link>
        </nav>
      </header>

      <main className="flex flex-col items-center px-6 pt-24 pb-32 text-center">
        <h1 className="text-4xl md:text-5xl font-medium max-w-2xl leading-tight">
          Pesquise uma empresa
        </h1>
        <p className="mt-4 text-ink/70 max-w-xl">
          Tudo sobre uma empresa em um só lugar.
        </p>

        <div className="mt-10 w-full flex justify-center">
          <SearchBar tamanho="grande" />
        </div>

        <p className="mt-6 text-sm text-ink/50">
          Exemplo: Magazine Luiza
        </p>

        <p className="mt-24 text-ink/60 max-w-md">
          Informação empresarial de forma simples, rápida e transparente.
        </p>
      </main>
    </>
  );
}
