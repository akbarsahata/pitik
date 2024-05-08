import { isAuthenticate } from "@services/utils/authenticate";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import metadata from "../package.json";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | FMS Pitik</title>
      </Head>

      <main>
        <p className="text-center mt-6" data-testid="title">
          Welcome to Pitik Farm Management System v{metadata.version}!!! 🐔🐔🐔
        </p>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default Home;
