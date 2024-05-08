import { isAuthenticate } from "@services/utils/authenticate";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const AlertTriggered: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>FMS Pitik</title>
      </Head>

      <main>
        <p className="text-center mt-6">
          This is: <code className="bg-gray-200 p-1">{router.asPath}</code>{" "}
          page.
        </p>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = isAuthenticate;

export default AlertTriggered;
